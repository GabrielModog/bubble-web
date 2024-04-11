import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { DownVoteButton, UpVoteButton } from "@/components/common/VotesButtons";
import { BlobContentRender } from "@/components/blob/BlobContentRender";

import { handleVote } from "@/actions/vote";

interface BlobCardProps {
  id: string;
  title: string;
  textContent: any;
  username: string | null;
  bubbleName: string | null;
  imageUrl: string | null;
  voteCount: number;
}

export function BlobCard(props: BlobCardProps) {
  const { title, imageUrl, username, bubbleName, id, voteCount, textContent } =
    props;
  return (
    <Card className="flex relative overflow-hidden">
      <div className="flex flex-col items-center gap-y-2 bg-muted p-2">
        <form action={handleVote}>
          <input type="hidden" name="voteDirection" value="UP" />
          <input type="hidden" name="postId" value={id} />
          <UpVoteButton />
        </form>
        <div>{voteCount}</div>
        <form action={handleVote}>
          <input type="hidden" name="voteDirection" value="DOWN" />
          <input type="hidden" name="postId" value={id} />
          <DownVoteButton />
        </form>
      </div>
      <div>
        <div className="flex items-center p-2 gap-x-2">
          <Link href="/" className="font-semibold text-xs">
            b/{bubbleName}
          </Link>
          <p className="font-semibold text-xs text-muted-foreground">
            Post by {username}
          </p>
        </div>
        <div className="px-2">
          <Link href="/">
            <h3 className="font-medium mt-1 text-lg">{title}</h3>
          </Link>
        </div>

        <div className="max-h-[300px] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="post image"
              width={600}
              height={500}
              className="w-full h-full"
            />
          ) : (
            <BlobContentRender data={textContent} />
          )}
        </div>

        <div className="m-3">
          <div className="flex items-center gap-x-1">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground font-medium text-xs">
              Comments
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
