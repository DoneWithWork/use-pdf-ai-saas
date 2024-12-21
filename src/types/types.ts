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

export type PDFDocument = {
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
type features = {
  text: string;
  tooltip: string;
  negative?: boolean;
};
export type PricingType = {
  title: string;
  price: number;
  quota: number;
  description: string;
  buttonText: string;
  features: features[];
  href: string;
};
export type DocumentTypes = PDFDocument | FolderDocument;

export type WorkspaceType = {
  name: string;
  id: string;
  createdAt: Date;
  Files: workspaceFile[];
};
type workspaceFile = {
  id: string;
};
