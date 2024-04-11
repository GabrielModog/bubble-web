import Image from "next/image";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import prisma from "@/lib/db";
import { Card } from "@/components/ui/card";

import BubbleDescriptionForm from "@/components/bubble/BubbleDescriptionForm";
import { Cake } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CreateBlobCard } from "@/components/blob/CreateBlobCard";
import { BlobCard } from "@/components/blob/BlobCard";
import Pagination from "@/components/common/Pagination";

interface BubbleRouteProps {
  params: {
    id: string;
  };
  searchParams: {
    page: string;
  };
}

export default async function BubbleRoute({
  params,
  searchParams,
}: BubbleRouteProps) {
  const take = 5;
  const { data, count } = await getData(params.id, searchParams.page);

  const { getUser } = getKindeServerSession();

  const user = await getUser();

  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 my-8">
      <div className="w-[65%] flex flex-col gap-y-5">
        <CreateBlobCard />
        {data?.blobs.map((ps) => (
          <BlobCard
            key={ps.id}
            id={ps.id}
            title={ps.title}
            textContent={ps.textContent}
            username={ps.user?.username ?? null}
            bubbleName={data.name}
            imageUrl={ps.imageUrl ?? null}
            voteCount={ps.votes.reduce<number>((acc, vote) => {
              if (vote.voteType === "UP") return acc + 1;
              if (vote.voteType === "DOWN") return acc - 1;
              return acc;
            }, 0)}
          />
        ))}

        <Pagination totalPages={Math.ceil(count / take)} />
      </div>

      <div className="w-[35%]">
        <Card className="rounded-sm">
          <div className="bg-muted p-4 font-semibold">About Bubble</div>
          <div className="p-4">
            <div className="flex items-center gap-x-3">
              <Image
                src={`https://avatar.vercel.sh/${data?.name}`}
                alt="bubble Avatar"
                width={64}
                height={64}
                className="rounded-full"
              />
              <Link href={`/b/${data?.name}`} className="font-medium">
                <span className="text-2xl">b/{data?.name}</span>
              </Link>
            </div>
            <div className="mt-2">
              {data?.userId === user?.id ? (
                <BubbleDescriptionForm
                  bubbleName={params.id}
                  description={data?.description ?? ""}
                />
              ) : (
                <p className="text-sm font-normal text-secondary-foreground">
                  {data?.description}
                </p>
              )}

              <div className="flex items-center gap-x-2 mt-4">
                <Cake className="w-4 h-4 text-muted-foreground" />
                <p className="text-muted-foreground font-medium text-sm">
                  <b> Created At: </b>
                  {new Date(data?.createdAt as Date).toLocaleDateString(
                    "pt-br",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
              <Separator className="my-4" />
              <div className="flex flex-col">
                <Button className="rounded-full" asChild>
                  <Link
                    href={user?.id ? `${data?.name}/create` : `api/auth/login`}
                  >
                    Create Blob
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

async function getData(name: string, skip: string) {
  const take = 5;
  const [count, data] = await prisma.$transaction([
    prisma.blob.count({
      where: {
        bubbleName: name,
      },
    }),
    prisma.bubble.findUnique({
      where: {
        name,
      },
      select: {
        name: true,
        createdAt: true,
        description: true,
        userId: true,
        blobs: {
          take: take,
          skip: skip ? (Number(skip) - 1) * take : 0,
          select: {
            title: true,
            id: true,
            imageUrl: true,
            textContent: true,
            votes: {
              select: {
                userId: true,
                voteType: true,
              },
            },
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return { count, data };
}
