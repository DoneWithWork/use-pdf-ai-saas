import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import React, { useContext, useRef, useState } from "react";
import { ChatContext } from "./Chat/ChatContext";
import { motion } from "motion/react";

import { File } from "@prisma/client";
import { cn, shortenName } from "@/lib/utils";
import { FileType } from "@/types/message";

interface ChatInputProps {
  isDisabled?: boolean;
  files: FileType[];
}

const ChatInput = ({ isDisabled, files }: ChatInputProps) => {
  const { addMessage, handleInputChange, isLoading, message, setNewMessage } =
    useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [popUpSuggestions, setPopUpSuggestions] = useState(false);
  const acceptSuggestion = (name: string) => {
    console.log(name);
    const currentMessage = message;
    const atIndex = currentMessage.lastIndexOf("@");
    const newMessage = currentMessage.substring(0, atIndex + 1) + name;
    setNewMessage(newMessage);
    setPopUpSuggestions(false);
  };
  return (
    <div className="absolute bottom-0 left-0 w-full">
      {popUpSuggestions && (
        <motion.div
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          animate={{ opacity: 1 }}
          className=" bg-gray-300 px-2 py-2 rounded-md w-48 ml-5"
        >
          <p>Documents</p>
          {files.map((file, index) => {
            return (
              <div
                key={file.id}
                onClick={() => acceptSuggestion(file.name)}
                className={cn(
                  index === 0 ? "bg-gray-100" : "",
                  "cursor-pointer hover:bg-gray-50"
                )}
              >
                {shortenName(file.name, 10)}
              </div>
            );
          })}
        </motion.div>
      )}
      <div className="">
        <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
          <div className="relative flex h-full flex-1 items-stretch md:flex-col">
            <div className="relative flex flex-col w-full flex-grow p-4">
              <div className="relative">
                <Textarea
                  rows={1}
                  ref={textareaRef}
                  maxRows={4}
                  autoFocus
                  onChange={(event) => {
                    handleInputChange(event);
                    const value = event.target.value;

                    const words = value.split(" ");
                    const lastWord = words.pop();
                    const containsAt = lastWord && lastWord.charAt(0) === "@";
                    console.log(words);
                    if (containsAt) {
                      console.log("Pop up suggestions"); // Replace with your suggestion logic
                      setPopUpSuggestions(true);
                    } else {
                      setPopUpSuggestions(false);
                    }
                  }}
                  value={message}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();

                      addMessage();

                      textareaRef.current?.focus();
                    }
                  }}
                  placeholder="Enter your question..."
                  className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                />

                <Button
                  disabled={isLoading || isDisabled}
                  className="absolute bottom-1.5 right-[8px]"
                  aria-label="send message"
                  onClick={() => {
                    addMessage();

                    textareaRef.current?.focus();
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
