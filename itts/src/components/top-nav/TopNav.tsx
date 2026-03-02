"use client";

import { logoutAction } from "@/app/(app)/(unauthenticated)/(auth-layout)/login/actions";
import { useAuth } from "@/app/(app)/_providers/Auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getLastName } from "@/lib/utils";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ProfileModal from "../modal/ProfileModal";

export function TopNav() {
  const pathname = usePathname();
  const { user, setUser } = useAuth();

  const fullName =
    user?.lead && typeof user.lead === "object" ? user.lead.fullName : "";

  const signOut = async () => {
    try {
      const { success } = await logoutAction();
      if (success) {
        setUser(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (pathname.includes("/student/tests/")) {
    return <></>;
  }

  return (
    <div
      className={cn(
        "header flex items-center justify-between pb-[1.5rem] pt-[2rem]",
        pathname === "/student" ? "w-[calc(100%-19.1875rem)]" : "",
      )}
    >
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold">
            Hello {getLastName(fullName || "")}
          </h3>
          <Image
            src="/waving-hand.svg"
            alt="wave-hand"
            width={22}
            height={22}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {"Let's learn something new today!"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* <div className="relative h-10">
          <Search className="absolute right-3 top-1/2 z-10 -translate-y-1/2 transform text-gray-500" />
          <Input
            placeholder="Search from courses..."
            className="w-[19.9375rem]"
          />
        </div> */}
        <div className="flex items-center gap-4 text-[#6D737A]">
          {/* <Button variant="ghost" size="icon" className="[&_svg]:size-6">
            <Image
              src="/home/translate.svg"
              alt="translate"
              width={20}
              height={20}
            />
          </Button> */}
          {/* <NotificationPopover>
            <Button variant="ghost" size="icon" className="[&_svg]:size-6">
              <Image
                src="/home/notification-bing.svg"
                alt="translate"
                width={20}
                height={20}
              />
            </Button>
          </NotificationPopover> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="[&_svg]:size-6">
                <Image
                  src="/setting-2.svg"
                  alt="setting"
                  width={20}
                  height={20}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ProfileModal>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </ProfileModal>
              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
