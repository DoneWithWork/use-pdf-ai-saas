import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Folder, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/app/_trpc/client";
import { ErrorToast, SuccessToast } from "./Toasts";
const newFolderSchema = z.object({
  name: z.string().min(1, {
    message: "Folder name is required",
  }),
});

export default function NewFolder() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const {
    mutate: createFolder,
    isSuccess,
    isPending,
  } = trpc.createFolder.useMutation({
    onSuccess: () => {
      console.log("Success");
      return SuccessToast("Folder created successfully");
    },
    onError: (error) => {
      console.log(error);
      return ErrorToast(`Error: ${error.message}`);
    },
    retry: 3,
    retryDelay: 3000,
  });
  const form = useForm<z.infer<typeof newFolderSchema>>({
    resolver: zodResolver(newFolderSchema),
    defaultValues: {
      name: "",
    },
  });
  useEffect(() => {
    if (isSuccess && !isPending) {
      setOpen(false);
    }
  }, [isPending, isSuccess]);
  function onSubmit(values: z.infer<typeof newFolderSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    createFolder({ name: values.name });

    utils.getUserDocumentPaginated.invalidate();
    console.log(values);
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={"default"}>
          <Folder size={20} className="w-6 h-6 mr-2" />
          <span>New Folder</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Folder</SheetTitle>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <Input placeholder="Folder Name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
