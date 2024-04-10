"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

import prisma from "@/lib/db";

export async function updateUsername(prevState: unknown, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const username = formData.get("username") as string;

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username,
      },
    });

    return {
      message: "Sucessfully <username> updated!",
      status: "success",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "This name is already used.",
          status: "error",
        };
      }

      return {
        message: `${error}`,
        status: "error",
      };
    }
  }
}
