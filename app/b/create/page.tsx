"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { SubmitButton } from "@/components/common/SubmitButton";

import { createBubble } from "@/actions/bubble";

const INITIAL_STATE_CREATE_BUBBLE = {
  message: "",
  status: "",
};

export default function BubblePage() {
  const [state, formAction] = useFormState(
    createBubble,
    INITIAL_STATE_CREATE_BUBBLE
  );
  const { toast } = useToast();

  useEffect(() => {
    if (state?.status === "error") {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col mt-4">
      <form action={formAction}>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Create Bubble
        </h1>
        <Separator className="my-4" />
        <Label className="text-lg">Name</Label>
        <p className="text-sm">
          Bubble name including capitalization cannot be changed!
        </p>
        <div className="relative mt-3">
          <p className="absolute left-0 flex w-8 items-center justify-center h-full text-muted-foreground">
            b/
          </p>
          <Input
            name="name"
            className="pl-6"
            minLength={2}
            maxLength={22}
            required
          />
        </div>
        {state.status === "error" && (
          <p className="mt-1 text-destructive">{state.message}</p>
        )}
        <div className="w-full flex mt-5 gap-x-5 justify-end">
          <Button variant="secondary" type="button" asChild>
            <Link href="/">Cancel</Link>
          </Button>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
