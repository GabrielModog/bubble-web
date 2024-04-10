"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          {" "}
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Please wait...
        </>
      ) : (
        "Save"
      )}
    </Button>
  );
}
