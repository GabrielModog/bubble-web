"use client";

import { useFormStatus } from "react-dom";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function UpVoteButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" size="sm" disabled={pending}>
      {!pending ? (
        <ArrowUp className="w-4 h-4" />
      ) : (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
    </Button>
  );
}

export function DownVoteButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" size="sm" disabled={pending}>
      {!pending ? (
        <ArrowDown className="w-4 h-4" />
      ) : (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
    </Button>
  );
}
