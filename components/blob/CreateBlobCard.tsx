import Image from "next/image";
import { ImageUp } from "lucide-react";

import { Card } from "@/components/ui/card";

import pfp from "../public/pfp.png";
import Link from "next/link";

export function CreateBlobCard() {
  return (
    <Card className="px-4 py-2 flex items-center gap-x-2 border-none">
      <Image src={pfp} alt="pfp" className="w-fit h-12 rounded-full border" />
      <Link
        href="/b/create"
        className="flex justify-between items-center w-full text-sm border px-5 py-3 rounded-lg"
      >
        Create Blob
        <ImageUp className="w-4 h-4" />
      </Link>
    </Card>
  );
}
