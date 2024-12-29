import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { useMutation } from "@tanstack/react-query";
import React, { createContext, useRef, useState } from "react";

//the type
type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setNewMessage: (message: string) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  setNewMessage: () => {},
  isLoading: false,
});
interface ChatContextProviderProps {
  children: React.ReactNode;
  workspaceId: string;
}
export const ChatContextProvider = ({
  workspaceId,
  children,
}: ChatContextProviderProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const utils = trpc.useUtils();
  //store the input message incase of error --> avoid rerendering
  const backUpMessage = useRef("");
  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          workspaceId,
          message,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.body;
    },
    onMutate: async ({ message }) => {
      backUpMessage.current = message;
      setMessage("");

      //optimistic updates
      await utils.getWorkspaceChatMessages.cancel();

      //step2
      const previousMessages = utils.getWorkspaceChatMessages.getInfiniteData();

      //stepe 3 insert the new value
      utils.getWorkspaceChatMessages.setInfiniteData(
        {
          workspaceId,
          limit: INFINITE_QUERY_LIMIT,
        },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }
          const newPages = [...old.pages];
          const latestPage = newPages[0]!;
          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
              PageFiles: [],
            },
            ...latestPage.messages,
          ];
          newPages[0] = latestPage;
          return {
            ...old,
            pages: newPages,
          };
        }
      );
      setIsloading(true);
      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      setIsloading(false);

      if (!stream) {
        console.log("No stream");
        return;
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // accumulated response
      let accResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        accResponse += chunkValue;

        // append chunk to the actual message
        utils.getWorkspaceChatMessages.setInfiniteData(
          { workspaceId, limit: INFINITE_QUERY_LIMIT },
          (old) => {
            if (!old) return { pages: [], pageParams: [] };

            const isAiResponseCreated = old.pages.some((page) =>
              page.messages.some((message) => message.id === "ai-response")
            );

            const updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages;

                if (!isAiResponseCreated) {
                  updatedMessages = [
                    {
                      createdAt: new Date().toISOString(),
                      id: "ai-response",
                      text: accResponse,
                      isUserMessage: false,
                      PageFiles: [],
                    },
                    ...page.messages,
                  ];
                } else {
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === "ai-response") {
                      return {
                        ...message,
                        text: accResponse,
                        PageFiles: message.PageFiles || [],
                      };
                    }
                    return message;
                  });
                }

                return {
                  ...page,
                  messages: updatedMessages,
                };
              }

              return page;
            });

            return { ...old, pages: updatedPages };
          }
        );
      }
    },
    onError: (error, __, context) => {
      setMessage(backUpMessage.current);
      console.error(error);
      utils.getWorkspaceChatMessages.setData(
        { workspaceId },
        { messages: context?.previousMessages ?? [] }
      );
    },
    onSettled: async () => {
      setIsloading(false);
      await utils.getWorkspaceChatMessages.invalidate({
        workspaceId,
      });
    },
  });
  const addMessage = () => sendMessage({ message });

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };
  const setNewMessage = (message: string) => {
    setMessage(message);
  };
  return (
    <ChatContext.Provider
      value={{
        setNewMessage,
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
