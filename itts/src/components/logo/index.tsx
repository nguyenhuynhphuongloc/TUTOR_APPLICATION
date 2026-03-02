import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"
      width={94 * 1.5}
      height={49 * 1.5}
      alt="IELTS - The Tutors"
    />
  );
}
