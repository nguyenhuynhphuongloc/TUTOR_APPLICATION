"use client";

import Image from "next/image";
import Link from "next/link";

export default function LoginForm(props: React.PropsWithChildren<{}>) {
  return (
    <>
      <div className="flex flex-col items-center gap-12 text-center">
        <Image src="/logo.png" alt="logo" width={118} height={61} />
        <div className="flex flex-col gap-4">
          <h1 className="text-[36px] font-bold text-[#151515]">
            Forgot Password
          </h1>
          <p className="text-balance text-[20px] text-[#6d737a]">
            Sorry, your login information is incorrect!
          </p>
          <p className="text-balance text-[20px] text-[#6d737a]">
            For assistance resetting your password, please contact the academic
            department or visit the support desk at the center!
          </p>
        </div>
      </div>
      <div className="mt-[24px] flex justify-between gap-4">
        <button className="inline-flex h-[52px] w-[216px] items-center justify-center gap-3 rounded-[12px] border border-[#0063F324] bg-[#0063F30A] text-[#313957]">
          <Image src="/zalo.svg" alt="zalo" width={28} height={28} />
          Contact with Zalo
        </button>
        <button className="inline-flex h-[52px] w-[216px] items-center justify-center gap-3 rounded-[12px] border border-[#25D36624] bg-[#25D3660A] text-[#313957]">
          <Image src="/whatsapp.svg" alt="zalo" width={28} height={28} />
          Contact with Phone
        </button>
      </div>
      <div className="mt-2 text-center">
        <Link href="/login" className="text-[18px] text-[#151515]">
          I already have an account.{" "}
          <span className="font-semibold text-[#E72929] hover:underline">
            Sign in
          </span>
        </Link>
      </div>
      <p className="mt-[110px] text-center text-[16px] text-[#A8ABB2]">
        &#169; 2025 ALL RIGHTS RESERVED
      </p>
    </>
  );
}
