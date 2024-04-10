"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

import prisma from "@/lib/db";

export async function createBubble(prevState: unknown, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return redirect("/api/auth/login");
  }

  try {
    const bubbleName = formData.get("name") as string;

    const data = await prisma.bubble.create({
      data: {
        name: bubbleName,
        userId: user.id,
      },
    });

    return redirect(`/r/${data.name}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "[error] This name already used!",
          status: "error",
        };
      }
    }
    throw error;
  }
}

export async function updateSubDescription(
  prevState: unknown,
  formData: FormData
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  try {
    const bubbleName = formData.get("bubbleName") as string;
    const description = formData.get("description") as string;

    await prisma.bubble.update({
      where: {
        name: bubbleName,
      },
      data: {
        description,
      },
    });

    return {
      status: "success",
      message: "Successfully updated!",
    };
  } catch (error) {
    return {
      message: `${error}`,
      status: "error",
    };
  }
}

export async function createComment(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const text = formData.get("comment") as string;
  const blobId = formData.get("blobId") as string;

  const data = await prisma.comment.create({
    data: {
      text,
      blobId,
      userId: user.id,
    },
  });

  return data;
}
