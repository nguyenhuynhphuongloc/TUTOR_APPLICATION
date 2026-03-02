import Image from "next/image";

export default function UnauthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="absolute left-1/2 top-[-35%] lg:h-[733px] w-[733px] -translate-x-1/2 rounded-full bg-[#e72929] opacity-10 blur-[200px]" />
      <div className="relative mx-auto grid min-h-dvh max-w-[1440px] items-center px-[24px] py-[32px] lg:grid-cols-2">
        <div className="flex w-full lg:w-[448px] flex-col gap-4 justify-self-center">
          {children}
        </div>
        <div className="relative hidden h-[639px] rounded-[24px] lg:block">
          <Image
            src="/new-banner.jpg"
            width={1080}
            height={1515}
            alt="login-bg-image"
            className="absolute inset-0 h-full w-full rounded-[24px] object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
}
