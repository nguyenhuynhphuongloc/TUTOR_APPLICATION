"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import rocketAnimation from "@/lottie/rocket.json";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LottieAnimation from "./lottie";

const items = [
  {
    title: "Trang chủ",
    url: "/student",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
      >
        <path d="M14.167 8.33341H15.8337C17.5003 8.33341 18.3337 7.50008 18.3337 5.83341V4.16675C18.3337 2.50008 17.5003 1.66675 15.8337 1.66675H14.167C12.5003 1.66675 11.667 2.50008 11.667 4.16675V5.83341C11.667 7.50008 12.5003 8.33341 14.167 8.33341Z" />
        <path d="M4.16699 18.3334H5.83366C7.50032 18.3334 8.33366 17.5001 8.33366 15.8334V14.1667C8.33366 12.5001 7.50032 11.6667 5.83366 11.6667H4.16699C2.50033 11.6667 1.66699 12.5001 1.66699 14.1667V15.8334C1.66699 17.5001 2.50033 18.3334 4.16699 18.3334Z" />
        <path d="M5.00033 8.33341C6.84127 8.33341 8.33366 6.84103 8.33366 5.00008C8.33366 3.15913 6.84127 1.66675 5.00033 1.66675C3.15938 1.66675 1.66699 3.15913 1.66699 5.00008C1.66699 6.84103 3.15938 8.33341 5.00033 8.33341Z" />
        <path d="M15.0003 18.3334C16.8413 18.3334 18.3337 16.841 18.3337 15.0001C18.3337 13.1591 16.8413 11.6667 15.0003 11.6667C13.1594 11.6667 11.667 13.1591 11.667 15.0001C11.667 16.841 13.1594 18.3334 15.0003 18.3334Z" />
      </svg>
    ),
  },
  // {
  //   title: "Khóa học",
  //   url: "#",
  //   icon: (
  //     <svg
  //       width="20"
  //       height="20"
  //       viewBox="0 0 20 20"
  //       fill="none"
  //       xmlns="http://www.w3.org/2000/svg"
  //       stroke="currentColor"
  //     >
  //       <path d="M2.91602 15V5.83334C2.91602 2.50001 3.74935 1.66667 7.08268 1.66667H12.916C16.2493 1.66667 17.0827 2.50001 17.0827 5.83334V14.1667C17.0827 14.2833 17.0827 14.4 17.0743 14.5167" />
  //       <path d="M5.29102 12.5H17.0827V15.4167C17.0827 17.025 15.7743 18.3333 14.166 18.3333H5.83268C4.22435 18.3333 2.91602 17.025 2.91602 15.4167V14.875C2.91602 13.5667 3.98268 12.5 5.29102 12.5Z" />
  //       <path d="M6.66602 5.83333H13.3327" />
  //       <path d="M6.66602 8.75H10.8327" />
  //     </svg>
  //   ),
  // },
  {
    title: "Bài tập",
    url: "/student/exercise",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
      >
        <path d="M18.3327 13.95V3.89168C18.3327 2.89168 17.516 2.15001 16.5243 2.23335H16.4743C14.7243 2.38335 12.066 3.27502 10.5827 4.20835L10.441 4.30002C10.1993 4.45002 9.79935 4.45002 9.55768 4.30002L9.34935 4.17502C7.86601 3.25002 5.21601 2.36668 3.46602 2.22501C2.47435 2.14168 1.66602 2.89168 1.66602 3.88335V13.95C1.66602 14.75 2.31602 15.5 3.11602 15.6L3.35768 15.6334C5.16602 15.875 7.95768 16.7917 9.55768 17.6667L9.59101 17.6833C9.81601 17.8083 10.1743 17.8083 10.391 17.6833C11.991 16.8 14.791 15.875 16.6077 15.6334L16.8827 15.6C17.6827 15.5 18.3327 14.75 18.3327 13.95Z" />
        <path d="M10 4.57501V17.075" />
        <path d="M6.45898 7.07501H4.58398" />
        <path d="M7.08398 9.57501H4.58398" />
      </svg>
    ),
  },
  {
    title: "Kho đề",
    url: "/student/question-bank",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
      >
        <path d="M7.49935 18.3333H12.4993C16.666 18.3333 18.3327 16.6667 18.3327 12.5V7.49999C18.3327 3.33332 16.666 1.66666 12.4993 1.66666H7.49935C3.33268 1.66666 1.66602 3.33332 1.66602 7.49999V12.5C1.66602 16.6667 3.33268 18.3333 7.49935 18.3333Z" />
        <path d="M15.3169 12.725V6.31665C15.3169 5.67498 14.8003 5.20832 14.1669 5.25832H14.1336C13.017 5.34999 11.3253 5.925 10.3753 6.51666L10.2836 6.575C10.1336 6.66667 9.87524 6.66667 9.71691 6.575L9.5836 6.49166C8.64193 5.9 6.95026 5.34165 5.8336 5.24998C5.20026 5.19998 4.68359 5.675 4.68359 6.30833V12.725C4.68359 13.2333 5.10025 13.7167 5.60858 13.775L5.75858 13.8C6.90858 13.95 8.69195 14.5417 9.70862 15.1L9.73359 15.1083C9.87526 15.1917 10.1086 15.1917 10.2419 15.1083C11.2586 14.5417 13.0503 13.9583 14.2086 13.8L14.3836 13.775C14.9003 13.7167 15.3169 13.2416 15.3169 12.725Z" />
        <path d="M10 6.75V14.7167" />
      </svg>
    ),
  },
  {
    title: "Bộ sưu tập từ vựng",
    url: "/student/vocabulary",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
      >
        <path d="M3.33398 6.66666C3.33398 4.30963 3.33398 3.13112 4.06622 2.39889C4.79845 1.66666 5.97696 1.66666 8.33398 1.66666H11.6673C14.0243 1.66666 15.2029 1.66666 15.9351 2.39889C16.6673 3.13112 16.6673 4.30963 16.6673 6.66666V13.3333C16.6673 15.6903 16.6673 16.8689 15.9351 17.6011C15.2029 18.3333 14.0243 18.3333 11.6673 18.3333H8.33398C5.97696 18.3333 4.79845 18.3333 4.06622 17.6011C3.33398 16.8689 3.33398 15.6903 3.33398 13.3333V6.66666Z" />
        <path d="M16.5821 13.3333H6.58213C5.80716 13.3333 5.41967 13.3333 5.10175 13.4185C4.23902 13.6497 3.56515 14.3236 3.33398 15.1863" />
        <path d="M6.66602 5.83334H13.3327" />
        <path d="M6.66602 8.75H10.8327" />
        <path d="M16.2493 15.8333H6.66602" />
      </svg>
    ),
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const defaultOptions = {
    loop: true,
    autoplay: pathname === "/student/wow",
    animationData: rocketAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  function onClickWow(e: React.MouseEvent) {
    e.preventDefault();

    router.push("/student/wow");
  }

  if (pathname.includes("/student/tests/")) {
    return <></>;
  }

  return (
    <Sidebar className="px-[1.5rem]">
      <Image
        className="pb-[2rem] pt-[2.5rem]"
        src="/logo.png"
        alt="Logo"
        width={144}
        height={49}
      />
      <SidebarContent>
        <SidebarMenu className="relative pb-60">
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              (pathname.startsWith(item.url) && item.url !== "/student");

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "group/item h-[3.25rem] rounded-[12px] hover:bg-[#E729291A] hover:font-semibold hover:text-[#E72929]",
                  )}
                >
                  <Link
                    href={item.url}
                    className="transition-colors duration-200"
                  >
                    <div className="group-hover/item:text-[#E72929]">
                      {item.icon}
                    </div>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="relative flex flex-col items-center justify-center p-0">
        <LottieAnimation
          options={defaultOptions}
          height={275}
          width={275}
          className="absolute bottom-[-1rem] cursor-pointer"
          playOnHover
          handleClick={onClickWow}
          isActive={pathname === "/student/wow"}
          name="rocket"
        />
      </SidebarFooter>
    </Sidebar>
  );
}
