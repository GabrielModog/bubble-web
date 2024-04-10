import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, Cake, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";

import prisma from "@/lib/db";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DownVoteButton, UpVoteButton } from "@/components/common/VotesButtons";
import { BlobContentRender } from "@/components/blob/BlobContentRender";
import { CommentForm } from "@/components/comment/CommentForm";
import { ClipboardLink } from "@/components/common/ClipboardLink";

import { handleVote } from "@/actions/vote";

const DEFAULT_USER_IMAGE = "https://i.pravatar.cc/300";

interface BlobRouteProps {
  params: {
    id: string;
  };
}

export default async function BlobRoute(props: BlobRouteProps) {
  const { params } = props;

  const data = await getData(params.id);

  const votesCount = data.votes.reduce((acc, vote) => {
    if (vote.voteType === "UP") return acc + 1;
    if (vote.voteType === "DOWN") return acc - 1;

    return acc;
  }, 0);

  return (
    <div className="max-w-[1200px] mx-auto gap-x-10 mt-4 mb-10">
      <div className="w-[70%] flex flex-col gap-y-5">
        <Card className="p-2 flex">
          <div className="flex flex-col  items-center  gap-y-2  p-2">
            <form action={handleVote}>
              <input type="hidden" name="voteDirection" value="UP" />
              <input type="hidden" name="blobId" value={data.id} />
              <UpVoteButton />
            </form>
            {votesCount}
            <form action={handleVote}>
              <input type="hidden" name="voteDirection" value="DOWN" />
              <input type="hidden" name="blobId" value={data.id} />
              <DownVoteButton />
            </form>
          </div>

          <div className="p-2 w-full">
            <p className="text-xs text-muted-foreground">
              Blobed by u/{data.user?.username}
            </p>

            <h1 className="font-medium mt-1 text-lg">{data.title}</h1>

            {data.imageUrl && (
              <Image
                src={data.imageUrl}
                alt="User Image"
                width={500}
                height={400}
                className="w-full h-auto object-contain mt-2"
              />
            )}

            {data.textContent && <BlobContentRender data={data.textContent} />}

            <div className="flex gap-x-5 items-center mt-3">
              <div className="flex items-center gap-x-1">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground font-medium text-xs">
                  {data.comments.length} Comments
                </p>
              </div>

              <ClipboardLink id={params.id} />
            </div>

            <CommentForm blobId={params.id} />

            <Separator className="my-5" />

            <div className="flex flex-col gap-y-7">
              {data.comments.map((item) => (
                <div key={item.id} className="flex flex-col">
                  <div className="flex items-center gap-x-3">
                    <img
                      src={
                        item.user?.imageUrl
                          ? item.user.imageUrl
                          : DEFAULT_USER_IMAGE
                      }
                      className="w-7 h-7 rounded-full"
                      alt="Avatar of user"
                    />

                    <h3 className="text-sm font-medium">
                      {item.user?.username}
                    </h3>
                  </div>

                  <p className="ml-10 text-secondary-foreground text-sm tracking-wide">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <div className="w-[30%]">
        <Card className="rounded-sm">
          <div className="bg-muted p-4 font-semibold">About Bubble</div>
          <div className="p-4">
            <div className="flex items-center gap-x-3">
              <Image
                src={`https://avatar.vercel.sh/${data?.bubbleName}`}
                alt="Bubble Avatar"
                width={64}
                height={64}
                className="rounded-full"
              />
              <Link href={`/r/${data?.bubbleName}`} className="font-medium">
                <span className="text-2xl">r/{data?.bubbleName}</span>
              </Link>
            </div>
            <div className="mt-2">
              <p className="text-sm font-normal text-secondary-foreground">
                {data?.bubble?.description}
              </p>

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
                  <Link href={`${data?.bubbleName}/create`}>Create Blob</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

async function getData(blobId: string) {
  const data = await prisma.blob.findUnique({
    where: {
      id: blobId,
    },
    select: {
      id: true,
      createdAt: true,
      title: true,
      imageUrl: true,
      textContent: true,
      bubbleName: true,
      comments: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          text: true,
          user: {
            select: {
              imageUrl: true,
              username: true,
            },
          },
        },
      },
      votes: {
        select: {
          voteType: true,
        },
      },
      bubble: {
        select: {
          name: true,
          createdAt: true,
          description: true,
        },
      },
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!data) return notFound();

  return data;
}
