import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-[#E72929]">404</h1>
      <p className="mt-4 text-lg">Oops! We can&#39;t find that page.</p>
      <p className="text-gray-500">
        The page you are looking for might have been moved or deleted.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-[#E72929] px-4 py-2 text-white"
      >
        Go Home
      </Link>
    </div>
  );
}
