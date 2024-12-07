import { AppRouter } from "@/server";
import { inferRouterOutputs } from "@trpc/server";

//infer the output of any types
type RouterOutput = inferRouterOutputs<AppRouter>;

type Messages = RouterOutput["getFileMessages"]["messages"];

type OmitText = Omit<Messages[number], "text">;

//our react loader
type ExtendedText = {
  text: string | JSX.Element;
};

export type ExtendedMessage = OmitText & ExtendedText;
export type FileType = {
  id: string;
  name: string;
};
