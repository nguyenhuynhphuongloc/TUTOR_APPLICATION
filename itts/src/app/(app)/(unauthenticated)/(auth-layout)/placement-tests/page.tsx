import configPromise from "@payload-config";
import { getPayload } from "payload";
import RegisterForm from "./register-form";

export const revalidate = 3600;

export default async function Page() {
  const payload = await getPayload({ config: configPromise });
  const { docs = [] } = await payload.find({
    collection: "branches",
    select: {
      name: true,
    },
  });

  return <RegisterForm branchs={docs} />;
}
