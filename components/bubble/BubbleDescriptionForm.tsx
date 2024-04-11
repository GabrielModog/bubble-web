"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import { updateBubbleDescription } from "@/actions/bubble";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/common/SubmitButton";
import { useToast } from "@/components/ui/use-toast";

interface BubbleDescriptionFormProps {
  bubbleName: string;
  description: string;
}

const INITIAL_STATE_SUBDESCRIPTION = {
  message: "",
  status: "",
};

export default function BubbleDescriptionForm(
  props: BubbleDescriptionFormProps
) {
  const { bubbleName, description } = props;
  const [state, formAction] = useFormState(
    updateBubbleDescription,
    INITIAL_STATE_SUBDESCRIPTION
  );
  const { toast } = useToast();

  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: "Success",
        description: state.message,
      });
    }

    if (state.status === "error") {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="mt-3 flex flex-col gap-2">
      <input type="hidden" name="bubbleName" value={bubbleName} />
      <Textarea
        name="description"
        placeholder="Add a description to your community"
        maxLength={100}
        defaultValue={description ?? ""}
      />
      <SubmitButton />
    </form>
  );
}
