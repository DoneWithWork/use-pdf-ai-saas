import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Expand, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";

export default function PdfFullscreen({ url }: { url: string }) {
  const [isOpen, setIsopen] = useState(false);
  const { toast } = useToast();
  const [numpages, setNumpages] = useState(0);

  const { width, ref } = useResizeDetector();
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) setIsopen(v);
      }}
    >
      <DialogTrigger asChild onClick={() => setIsopen(true)}>
        <Button aria-label="Fullscreen" variant={"ghost"} className="gap-1.5">
          <Expand className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <DialogTitle>PDF</DialogTitle>
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
          <div ref={ref}>
            <Document
              file={url}
              className={"max-h-screen w-full"}
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again",
                  variant: "destructive",
                });
              }}
              onLoadSuccess={({ numPages }) => {
                setNumpages(numPages);
              }}
            >
              {new Array(numpages).fill(0).map((_, index) => (
                <Page
                  key={index}
                  width={width ? width : 1}
                  pageNumber={index + 1}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
}
