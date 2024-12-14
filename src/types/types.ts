import { AppRouter } from "@/server";
import { File, Folders } from "@prisma/client";
import { inferRouterOutputs } from "@trpc/server";

//infer the output of any types
type RouterOutput = inferRouterOutputs<AppRouter>;

type Messages = RouterOutput["getWorkspaceChatMessages"]["messages"];

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
export type FileOrFolder = File | Folders;

export enum DocumentType {
  PDF = "PDF",
  FOLDER = "FOLDER",
}

type PDFDocument = {
  id: string;
  name: string;
  size: number;
  documentType: DocumentType.PDF;
  createdAt: Date;
};

type FolderDocument = {
  id: string;
  name: string;
  number_of_files: number;
  documentType: DocumentType.FOLDER;
  createdAt: Date;
};

export type DocumentTypes = PDFDocument | FolderDocument;
