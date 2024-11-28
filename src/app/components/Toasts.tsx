import { useToast } from "@/hooks/use-toast";

export function SuccessToast(message: string) {
  const { toast } = useToast();
  return toast({
    title: "Success",
    description: message,
    variant: "default",
  });
}
export function ErrorToast(message: string) {
  const { toast } = useToast();
  return toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
}
