import configPromise from "@payload-config";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const payload = await getPayload({ config: configPromise });
  const headers = await nextHeaders();
  const { user } = await payload.auth({ headers });

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
