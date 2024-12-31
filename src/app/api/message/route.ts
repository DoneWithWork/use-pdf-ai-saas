import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import db from "../../../../prisma/db";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { initPinecone } from "@/lib/pinecone/pinecone";
import { openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { getUserSubscriptionPlan } from "@/lib/stripe";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { getUser } = await getKindeServerSession();
    const subscription = await getUserSubscriptionPlan();
    const user = await getUser();
    const { id: userId } = user;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { workspaceId, message } = SendMessageValidator.parse(body);
    const workspace = await db.workspace.findFirst({
      where: {
        id: workspaceId,
        userId,
      },
      select: {
        Files: {
          select: {
            id: true,
          },
        },
        Messages: {
          select: {
            id: true,
          },
        },
      },
    });

    const numberOfMessages = workspace?.Messages.length;
    if (numberOfMessages === subscription?.questions) {
      return new Response("You have reached your limit of questions", {
        status: 400,
      });
    }
    console.log(`Number of messages: ${numberOfMessages}`);
    if (workspace) console.log(workspaceId);
    if (!workspace) return new Response("Workspace not found", { status: 404 });

    await db.message.create({
      data: {
        text: message,
        isUserMessage: true,
        userId,
        workspaceId,
      },
    });
    const fileIds = workspace.Files.map((file) => file.id);
    // #1 Vectorise the embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });
    const pinecone = await initPinecone();
    const pineconeIndex = pinecone.Index("pdf-ai");

    const vectorStores: { [key: string]: PineconeStore } = {};
    for (const fileId of fileIds) {
      // Create a PineconeStore for each file
      const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        //@ts-expect-error - this is a bug in the pinecone types
        pineconeIndex,
        namespace: fileId,
      });

      // Store the vectorStore by file ID
      vectorStores[fileId] = vectorStore;
    }

    //pro user gets more messages, etc
    const topResults = [];

    // Iterate through vector stores and collect similarity search results
    for (const [fileId, vectorStore] of Object.entries(vectorStores)) {
      const results = await vectorStore.similaritySearch(
        message,
        subscription.quota || 2
      ); // Top 4 matches per document
      topResults.push(...results.map((result) => ({ ...result, fileId }))); // Attach fileId to results
    }

    // Output the final top results
    // console.log("top results: ", topResults);

    const prevMessage = await db.message.findMany({
      where: {
        workspaceId,
        userId,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 2,
    });

    // based on subscription plan, we can limit the number of messages , etc
    const formattedPrevMessages = prevMessage.map((m) => ({
      role: m.isUserMessage ? ("user" as const) : ("assistant" as const),
      content: m.text,
    }));
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      stream: true, // stream the response in real-time
      messages: [
        {
          role: "system",
          content: `
            You are an intelligent assistant with access to user-provided context and previous conversations. 
            Answer questions concisely and accurately using the given context and previous conversation as your primary reference. 
            Supplement with general knowledge only if explicitly required, but prioritize the provided context. 
            Use Markdown formatting for the response. 
            If you are unsure or the required information is not in the context, state, "I'm not sure" without making up information.
          `,
        },
        {
          role: "user",
          content: `
            Below is the relevant context and prior conversation history. 
            Please use this to answer the user's question accurately and concisely. 
            Focus only on what is relevant and avoid unnecessary elaboration. 
            If you are unsure, explicitly state so.
    
            --------------------
            **PREVIOUS CONVERSATION**:
            ${formattedPrevMessages
              .map((message) => {
                if (message.role === "user")
                  return `User: ${message.content}\n`;
                return `Assistant: ${message.content}\n`;
              })
              .join("")}
    
            --------------------
            **CONTEXT**:
            ${topResults.map((r) => `- ${r.pageContent}`).join("\n")}
    
            --------------------
            **USER INPUT**: 
            ${message}
          `,
        },
      ],
      max_tokens: subscription.maxTokens || 300,
      temperature: 0.0, // Ensure deterministic and fact-focused responses
    });
    console.log(subscription.maxTokens);
    console.log(topResults);
    const references = topResults.map((r) => {
      return {
        fileId: r.fileId,
        pageNumber: +r.metadata["loc.pageNumber"],
      };
    });
    console.log(references);
    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        await db.message.create({
          data: {
            text: completion,
            isUserMessage: false,
            userId,
            workspaceId,
            PageFiles: {
              create: references.map((ref) => ({
                fileId: ref.fileId,
                pageNumber: ref.pageNumber,
              })),
            },
          },
        });
      }, // links the file ids references to the page numbers
    });
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
