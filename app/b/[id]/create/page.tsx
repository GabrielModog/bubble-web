"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { JSONContent } from "@tiptap/react";
import { Text, Video } from "lucide-react";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";

import pfp from "../../../../public/bubble-logo.svg";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BlobContentEditor } from "@/components/blob/BlobContentEditor";
import { SubmitButton } from "@/components/common/SubmitButton";
import { UploadDropzone } from "@/components/common/UploadButton";

import { createBlob } from "@/actions/blob";

const rules = [
  {
    id: 1,
    text: "Remember the human",
  },
  {
    id: 2,
    text: "Behave like you would in real life",
  },
  {
    id: 3,
    text: "Look for the original source of content",
  },
  {
    id: 4,
    text: "Search for duplication before posting",
  },
  {
    id: 5,
    text: "Read community guidelines!",
  },
];

interface CreateBlobPostRouteProps {
  params: {
    id: string;
  };
}

export default function CreateBlobPostRoute(props: CreateBlobPostRouteProps) {
  const { params } = props;

  const [title, setTitle] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [content, setContent] = useState<JSONContent | null>(null);

  const createBlobPost = createBlob.bind(null, {
    content,
  });

  return (
    <div className="max-w-[1000px] mx-auto flex gap-x-10 mt-4">
      <div className="w-[65%] flex flex-col gap-y-5">
        <h1 className="font-semibold">
          Bubble:{" "}
          <Link href={`/b/${params.id}`} className="text-orange-600">
            b/{params.id}
          </Link>
        </h1>
        <Tabs defaultValue="post" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="post">
              <Text className="w-4 h-4 mr-2" />
              Post
            </TabsTrigger>
            <TabsTrigger value="media">
              <Video className="w-4 h-4 mr-2" />
              Image & Video
            </TabsTrigger>
          </TabsList>
          <TabsContent value="post">
            <Card>
              <form action={createBlobPost}>
                <CardHeader>
                  <Label>Title</Label>
                  <Input
                    name="title"
                    placeholder="Title"
                    value={title ?? ""}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                  />
                  <Input type="hidden" name="imageUrl" value={imageUrl ?? ""} />
                  <Input type="hidden" name="bubbleName" value={params.id} />
                  <BlobContentEditor
                    setContent={setContent}
                    content={content}
                  />
                </CardHeader>
                <CardFooter>
                  <SubmitButton />
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="media">
            <CardHeader>
              <h1>Upload Media</h1>
              {!imageUrl ? (
                <UploadDropzone
                  endpoint="imageUploader"
                  className="ut-button:bg-orange-600 ut-button:ut-readying:bg-orange-600 ut-label:text-orange-600"
                  onClientUploadComplete={(res) => setImageUrl(res[0].url)}
                  onUploadError={(error: Error) => console.error(error)}
                />
              ) : (
                <Image
                  src={imageUrl}
                  alt="uploded image"
                  width={500}
                  height={500}
                />
              )}
            </CardHeader>
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-[35%]">
        <Card className="flex flex-col p-4">
          <div className="flex items-center gap-x-2">
            <Image src={pfp} alt="pfp" className="w-10 h-10" />
            <h1 className="font-medium">Posting in the community</h1>
          </div>
          <Separator />
          <ol className="list-decimal	flex flex-col gap-y-2 mt-5 px-4">
            {rules.map((rule) => (
              <li key={`rule_${rule.id}`} className="text-sm font-medium">
                {rule.text}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
