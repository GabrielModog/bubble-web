"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SubmitButton } from "@/components/SubmitButton";

import { updateUsername } from "@/actions/settings";

const INTIAL_STATE_SETTINGS_FORM = {
  message: "",
  status: "",
};

interface SettingsFormProps {
  username?: string;
}

export default function SettingsForm(props: SettingsFormProps) {
  const { username } = props;
  const [state, formAction] = useFormState(
    updateUsername,
    INTIAL_STATE_SETTINGS_FORM
  );
  const { toast } = useToast();

  useEffect(() => {
    if (state?.status) {
      switch (state.status) {
        case "success":
          toast({
            title: "Success",
            description: state.message,
          });
          return;
        case "error":
          toast({
            title: "Error",
            description: state.message,
            variant: "destructive",
          });
          return;
      }
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
      <Separator className="my-4" />
      <Label>Username:</Label>
      <p className="text-muted-foreground text-sm">
        In this settings page you can change your username!
      </p>
      <Input
        name="username"
        defaultValue={username}
        required
        className="mt-2"
        min={2}
        maxLength={22}
      />
      <div className="w-full flex mt-5 gap-x-5 justify-end">
        <Button variant="secondary" type="button" asChild>
          <Link href="/">Cancel</Link>
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}
