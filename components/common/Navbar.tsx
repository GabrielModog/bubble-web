import Link from "next/link";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";

import BubbleTextImage from "../../public/bubble-logotipo.svg";
import BubbleMobileImage from "../../public/bubble-logo.svg";

import { Button } from "../ui/button";
import { ThemeToggle } from "../theme/ThemeToggle";
import { UserDropdown } from "../user/UserDropdown";

export async function Navbar() {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  return (
    <nav className="h-[10vh] w-full flex items-center border-b px-5 lg:px-14 justify-between">
      <Link href="/" className="flex items-center gap-x-3">
        <Image
          src={BubbleMobileImage}
          alt="Bubble Mobile Icon"
          className="h-10 w-fit"
        />
        <Image
          src={BubbleTextImage}
          alt="Bubble Desktop"
          className="h-9 w-fit hidden lg:block"
        />
      </Link>

      <div className="flex items-center gap-x-3">
        <ThemeToggle />
        {user ? (
          <UserDropdown userImage={user.picture} />
        ) : (
          <>
            <Button variant="secondary" asChild>
              <RegisterLink>Sign Up</RegisterLink>
            </Button>
            <Button asChild>
              <LoginLink>Login</LoginLink>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
