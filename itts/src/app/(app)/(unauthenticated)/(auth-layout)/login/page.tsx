import configPromise from "@payload-config";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

import LoginForm from "./login-form";

export default async function Page() {
  const payload = await getPayload({ config: configPromise });
  const headers = await nextHeaders();
  const { user } = await payload.auth({ headers });

  if (user) {
    redirect("/student");
  }

  return <LoginForm />;
}
