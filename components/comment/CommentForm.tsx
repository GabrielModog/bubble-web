"use client";

import { useRef } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/actions/bubble";

import { SubmitButton } from "@/components/common/SubmitButton";

interface CommentFormProps {
  blobId: string;
}

export function CommentForm(props: CommentFormProps) {
  const { blobId } = props;
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      className="mt-5"
      action={async (formData) => {
        await createComment(formData);
        ref.current?.reset();
      }}
      ref={ref}
    >
      <input type="hidden" name="blobId" value={blobId} />
      <Label>Comment right here</Label>
      <Textarea
        placeholder="What are your thoughts?"
        className="w-full mt-1 mb-2"
        name="comment"
      />
      <SubmitButton />
    </form>
  );
}
