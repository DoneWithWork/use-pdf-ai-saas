import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import db from "../../../../prisma/db";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { initPinecone } from "@/lib/pinecone/pinecone";
import { openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { getUser } = await getKindeServerSession();
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
    },
  });
  console.log(workspaceId);
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
    const results = await vectorStore.similaritySearch(message, 4); // Top 4 matches per document
    topResults.push(...results.map((result) => ({ ...result, fileId }))); // Attach fileId to results
  }

  // Output the final top results
  console.log("top results: ", topResults);

  const prevMessage = await db.message.findMany({
    where: {
      workspaceId,
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });

  const formattedPrevMessages = prevMessage.map((m) => ({
    role: m.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: m.text,
  }));
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    stream: true, // will stream the response real time
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. If a document is specified, use use the title of the provided document to search with the context for the answer. If multiple documents are give, look carefully for the correct context. If you don't know the answer, just say that you don't know, don't try to make up an answer. If a user ask a question related to the document use your knowlege base to answer the question. If a user ask the contents of the docs summarise what you are given",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${topResults.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`,
      },
    ],
    max_tokens: 200,
    temperature: 0,
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          userId,
          workspaceId,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
};
