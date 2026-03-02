import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Header from "./header";

export default function Done() {
  return (
    <>
      <Header />
      <div className="mt-[116px]">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col gap-4">
            <h1 className="text-[24px] font-bold text-[#151515]">
              Cảm ơn bạn đã dành thời gian thực hiện bài kiểm tra đầu vào.
            </h1>
            <p className="text-balance text-[16px] text-[#6d737a] max-w-[900px]">
              Bộ phận tư vấn sẽ nhanh chóng liên hệ với bạn! Hoặc bạn có thể chủ
              động liên hệ với IELTS THE TUTORS thông qua các nền tảng bên dưới
              để nhận lộ trình học cá nhân hóa nhanh chóng đạt Aim như ý nhé!
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <a
              href="https://zalo.me/0907345178"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex h-[52px] w-[198px] items-center justify-center gap-3",
                "rounded-[12px] border border-[#0063F324] bg-[#0063F30A] text-[#313957]",
                "hover:bg-[#0063F319]",
              )}
            >
              <Image src="/icons/zalo.svg" alt="zalo" width={28} height={28} />
              Contact with Zalo
            </a>
            <a
              href="tel:0907345178"
              target="_blank"
              className={cn(
                "inline-flex h-[52px] w-[212px] items-center justify-center gap-3",
                "rounded-[12px] border border-[#25D36624] bg-[#25D3660A] text-[#313957]",
                "hover:bg-[#25D36619]",
              )}
            >
              <Image
                src="/icons/whatsapp.svg"
                alt="zalo"
                width={28}
                height={28}
              />
              Contact with Phone
            </a>
            <a
              href="https://www.facebook.com/messages/t/2099160833665158"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex h-[52px] w-[248px] items-center justify-center gap-3",
                "rounded-[12px] border border-[#0084FF24] bg-[#0084FF0A] text-[#313957]",
                "hover:bg-[#0084FF19]",
              )}
            >
              <Image
                src="/icons/fb-messenger.svg"
                alt="zalo"
                width={28}
                height={28}
              />
              Contact with Messenger
            </a>
          </div>
          <div>
            <Button
              asChild
              className="h-[40px] w-[192px] rounded-[12px] bg-[#E72929] px-6 py-4 font-semibold"
            >
              <Link href="/student">
                Quay lại trang chủ{" "}
                <Image
                  src="/icons/send.svg"
                  alt="send"
                  width={16}
                  height={16}
                />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
