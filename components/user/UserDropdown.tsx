/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { MenuIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserDropdownProps {
  userImage: string | null;
}

const DEFAULT_USER_IMAGE = "https://i.pravatar.cc/300";

export function UserDropdown(props: UserDropdownProps) {
  const { userImage = DEFAULT_USER_IMAGE } = props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full border p-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
          <MenuIcon className="w-6 h-6 lg:w-5 lg:h-5" />
          <img
            src={userImage ?? DEFAULT_USER_IMAGE}
            alt="user avatar"
            className="rounded-full size-8 hidden lg:block"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem>
          <Link href="/b/create">Create a Bubble</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/create">Create Blob</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutLink>Logout</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
