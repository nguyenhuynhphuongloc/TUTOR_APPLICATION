import configPromise from "@payload-config";
import { getPayload } from "payload";

import { redirect } from "next/navigation";
import Header from "./header";
import SelectMode from "./select-mode";

export default async function Page({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  const payload = await getPayload({ config: configPromise });
  try {
    await payload.findByID({
      collection: "leads",
      id: leadId,
    });
  } catch {
    redirect("/placement-tests");
  }

  return (
    <>
      <Header />
      <div className="mt-[116px]">
        <div className="relative mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-4">
            <h3 className="text-center text-[24px] font-bold text-[#202020]">
              Choose Test Topic
            </h3>
            <SelectMode leadId={leadId} />
          </div>
        </div>
      </div>
    </>
  );
}
