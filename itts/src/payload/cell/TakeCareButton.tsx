"use client";

import { useRouter } from "next/navigation";

const TakeCareButton = ({ rowData }) => {
  const router = useRouter();

  const handleClick = async () => {
    const classId = rowData.id;

    try {
      const res = await fetch(
        `/api/care?where[class_ref][equals]=${classId}&limit=1`,
      );

      const data = await res.json();

      if (data?.docs?.length > 0) {
        const careId = data.docs[0].id;
        router.push(`/admin/collections/care/${careId}`);
        return;
      }

      router.push(`/admin/collections/care/create?class_ref=${classId}`);
    } catch (error) {
      console.error("Take care redirect error:", error);
    }
  };

  return (
    <button
      className="bg-[#E72727] text-white cursor-pointer rounded-[12px] border border-[#E72727] px-3 py-2 hover:bg-white hover:text-[#E72727] hover:border-[#E72727] transition-all duration-300 ease-in-out"
      onClick={handleClick}
    >
      Chăm sóc
    </button>
  );
};

export default TakeCareButton;
