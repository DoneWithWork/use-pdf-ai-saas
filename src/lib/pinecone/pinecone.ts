import { Pinecone } from "@pinecone-database/pinecone";

let pinecone: Pinecone | null = null;

export const initPinecone = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};
export async function LoadUploadThing() {}
