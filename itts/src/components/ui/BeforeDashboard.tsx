"use client";

import Image from "next/image";

export default function BeforeDashboard() {
  return (
    <div className="">
      <div className="flex items-center bg-slate-50 gap-80">
        <Image src="/logo.png" alt="Logo" width={100} height={48} priority />

        <h2 className="text-4xl text-center text-red-600">
          {" "}
          Chào mừng năm mới 2026{" "}
        </h2>
      </div>

      <div className="mt-10 flex items-center ml-32">
        <Image
          src="/tutor_hello.png"
          alt="Logo"
          width={150}
          height={48}
          priority
        />
        <h3 className="text-3xl text-center text-blue-950">
          {" "}
          Chào mừng bạn đến với hệ thống quản lý trung tâm IELTS THE TUTORS
        </h3>
      </div>
    </div>
  );
}
