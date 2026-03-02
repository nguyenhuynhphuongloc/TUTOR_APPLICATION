import { redirect } from "next/navigation";

export default function Home() {
  redirect("/student"); // This immediately redirects to /student
}
