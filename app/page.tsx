import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import prisma from "@/lib/db";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CreateBlobCard } from "@/components/blob/CreateBlobCard";
import { BlobCard } from "@/components/blob/BlobCard";
import { SuspenseCard } from "@/components/common/SuspenseCard";
import Pagination from "@/components/common/Pagination";

import HeroBanner from "../public/banner.png";
import HeroImage from "../public/bubble-logo.svg";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface HomeProps {
  searchParams: {
    page: string;
  };
}

export default async function Home(props: HomeProps) {
  const { searchParams } = props;

  const user = await getUserData();

  return (
    <div className="max-w-[1000px] mx-auto flex gap-10 my-8">
      <div className="w-[65%] flex flex-col gap-y-5">
        <CreateBlobCard />
        <Suspense fallback={<SuspenseCard />} key={searchParams.page}>
          <ShowItems skip={searchParams.page} />
        </Suspense>
      </div>
      <div className="w-[35%]">
        <Card>
          <Image src={HeroBanner} alt="Hero" />
          <div className="p-2">
            <div className="flex-items-center">
              <Image src={HeroImage} alt="hero" className="w-10 h-16 -mt-6" />
              <h1 className="font-medium">Home</h1>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              This is your Bubble homepage. Please, enjoy!
            </p>
            <Separator className="my-5" />
            <div className="flex flex-col gap-y-3">
              {user && (
                <Button variant="secondary" asChild>
                  <Link href={`/b/${user?.username}/create`}>
                    Create Blob Post
                  </Link>
                </Button>
              )}
              <Button asChild>
                <Link href="/b/create">Create Bubble</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

async function getUserData() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  const data = await prisma.user.findUnique({
    where: {
      id: user?.id ?? "",
    },
  });

  return data;
}

async function getData(take: number = 5, skip: string) {
  const [count, data] = await prisma.$transaction([
    prisma.blob.count(),
    prisma.blob.findMany({
      take: take,
      skip: skip ? (Number(skip) - 1) * take : 0,
      select: {
        title: true,
        createdAt: true,
        textContent: true,
        id: true,
        imageUrl: true,
        votes: true,
        user: {
          select: {
            username: true,
          },
        },
        bubbleName: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);
  return { data, count };
}

async function ShowItems({ skip }: { skip: string }) {
  const take = 5;
  const { data, count } = await getData(take, skip);
  return (
    <>
      {data.map((post) => (
        <BlobCard
          key={post.id}
          id={post.id}
          title={post.title}
          textContent={post.textContent}
          username={post.user?.username ?? null}
          bubbleName={post.bubbleName}
          imageUrl={post.imageUrl ?? null}
          voteCount={post.votes.reduce<number>((acc, vote) => {
            if (vote.voteType === "UP") return acc + 1;
            if (vote.voteType === "DOWN") return acc - 1;
            return acc;
          }, 0)}
        />
      ))}
      {count >= 1 && <Pagination totalPages={Math.ceil(count / take)} />}
    </>
  );
}
