"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { VoteType } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/db";

export async function handleVote(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const blobId = formData.get("blobId") as string;
  const voteDirection = formData.get("voteDirection") as VoteType;

  const vote = await prisma.vote.findFirst({
    where: {
      blobId,
      userId: user.id,
    },
  });

  if (vote) {
    if (vote.voteType === voteDirection) {
      await prisma.vote.delete({
        where: {
          id: vote.id,
        },
      });
      return revalidatePath("/");
    } else {
      await prisma.vote.update({
        where: {
          id: vote.id,
        },
        data: {
          voteType: voteDirection,
        },
      });
      return revalidatePath("/");
    }
  }

  await prisma.vote.create({
    data: {
      voteType: voteDirection,
      userId: user.id,
      blobId,
    },
  });
  return revalidatePath("/");
}
