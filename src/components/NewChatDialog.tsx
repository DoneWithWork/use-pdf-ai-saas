"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { z } from "zod";
import { trpc } from "../app/_trpc/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
});

export default function NewChatDialog() {
  const { mutate: newChat, isPending } = trpc.newChat.useMutation({
    onSuccess: () => {
      console.log("Chat created successfully.");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    newChat(data); // Submit form data to mutation
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          New Chat <Plus className="w-4 h-4 ml-2 font-semibold" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Chat Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex-row-custom">
              {isPending ? (
                <div className="flex-row-custom gap-2">
                  <Loader2 className="animate-spin h-6 w-6 " />
                  <p className="pl-2 text-gray-500">Creating...</p>
                </div>
              ) : (
                <Button type="submit" disabled={isPending}>
                  Submit
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
