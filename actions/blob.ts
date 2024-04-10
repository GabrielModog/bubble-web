"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { JSONContent } from "@tiptap/react";
import { redirect } from "next/navigation";

import prisma from "@/lib/db";

interface CreateBlobState {
  content: JSONContent | null;
}

export async function createBlob(
  { content }: CreateBlobState,
  formData: FormData
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const title = formData.get("title") as string;
  const imageUrl = formData.get("imageUrl") as string | null;
  const bubbleName = formData.get("bubbleName") as string;

  await prisma.blob.create({
    data: {
      title,
      imageUrl,
      bubbleName,
      textContent: content ?? undefined,
      userId: user.id,
    },
  });

  return redirect(`/r/${bubbleName}`);
}
