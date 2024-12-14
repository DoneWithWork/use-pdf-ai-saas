"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useResizeDetector } from "react-resize-detector";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SimpleBar from "simplebar-react";
import PdfFullscreen from "./PdfFullscreen";
import { ErrorToast } from "../mis/Toasts";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfRenderer = ({ url }: { url: string }) => {
  const { width, ref } = useResizeDetector();
  const [curPage, setCurPage] = useState(1);
  const [numpages, setNumpages] = useState(0);

  const [scale, setScale] = useState<number>(1);

  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState(0);
  const isLoading = renderedScale !== scale;
  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((val) => Number(val) > 0 && Number(val) <= numpages),
  });

  type TCustomPage = z.infer<typeof CustomPageValidator>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPage>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });
  useEffect(() => {
    setCurPage(1);
    setValue("page", "1"); // Reset the input field to page 1
  }, [url, setValue]);
  //only if inputs are valid
  const handlePageSubmit = ({ page }: TCustomPage) => {
    setCurPage(Number(page));
    setValue("page", String(page));
  };
  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center max-h-screen h-full ">
      <div className="h-14 w-full border-b z-10 border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            variant={"ghost"}
            disabled={curPage === 1}
            aria-label="previous page"
            onClick={() => {
              setCurPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              setValue("page", String(curPage - 1));
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
              onChange={(e) => setValue("page", e.target.value)} // Allow user input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />

            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numpages ?? "x"}</span>
            </p>
          </div>
          <Button
            disabled={curPage === numpages}
            variant={"ghost"}
            aria-label="next page"
            onClick={() => {
              setCurPage((prev) => (prev + 1 > numpages ? numpages : prev + 1));
              setValue("page", String(curPage + 1));
            }}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5" aria-label="zoom" variant={"ghost"}>
                <Search className="h-4 w-4" />
                {scale * 100}%<ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            variant={"ghost"}
            aria-label="rotate 90 degree"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <PdfFullscreen url={url} />
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
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
                ErrorToast("Error loading PDF. Please try again");
              }}
              onLoadSuccess={({ numPages }) => {
                setNumpages(numPages);
              }}
            >
              {isLoading && renderedScale ? (
                <Page
                  scale={scale}
                  rotate={rotation}
                  width={width ? width : 1}
                  pageNumber={curPage}
                  key={"@" + renderedScale}
                />
              ) : null}
              <Page
                className={cn(isLoading ? "hidden" : "")}
                scale={scale}
                rotate={rotation}
                key={"@" + scale}
                width={width ? width : 1}
                pageNumber={curPage}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => {
                  setRenderedScale(scale);
                }}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
