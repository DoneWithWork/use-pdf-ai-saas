import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/types";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { forwardRef } from "react";
import { Icons } from "@/components/mis/Icons";
import { Pencil } from "lucide-react";
interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}
import { motion } from "motion/react";

//passing refs from parent to child components
const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex h-6 w-6 aspect-square items-center justify-center",
            {
              "order-2 bg-blue-600 rounded-sm": message.isUserMessage,
              "order-1 bg-blue-800 rounded-sm": !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            }
          )}
        >
          {message.isUserMessage ? (
            <Icons.user className="fill-zinc-200 text-zinc-200 h-3/4 w-3/4" />
          ) : (
            <Pencil className="fill-zinc-300 h-3/4 w-3/4" />
          )}
        </div>

        <div
          className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("px-4 py-2 rounded-lg inline-block", {
              "bg-blue-600 text-white": message.isUserMessage,
              "bg-gray-200 text-gray-900": !message.isUserMessage,
              "rounded-br-none":
                !isNextMessageSamePerson && message.isUserMessage,
              "rounded-bl-none":
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {typeof message.text === "string" ? (
              <ReactMarkdown
                className={cn("prose", {
                  "text-zinc-50": message.isUserMessage,
                })}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {message.id !== "loading-message" ? (
              <div
                className={cn("text-xs select-none  w-full text-right mt-2", {
                  "text-zinc-500": !message.isUserMessage,
                  "text-blue-300": message.isUserMessage,
                })}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </div>
            ) : null}
          </div>
          <div className="flex flex-row gap-1 text-sm w-full justify-end">
            {message.pageNumbers &&
              message.pageNumbers.map((pageNum, index) => (
                <motion.div
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-gray-200 font-semibold"
                  key={index}
                >
                  <p>{pageNum}</p>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    );
  }
);

Message.displayName = "Message";

export default Message;
