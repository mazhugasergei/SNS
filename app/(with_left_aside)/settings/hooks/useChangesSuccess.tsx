import { toast } from "@/components/ui/use-toast";

export const useChangesSuccess = () => toast({
  title: "Success!",
  description: "Changes were saved."
})