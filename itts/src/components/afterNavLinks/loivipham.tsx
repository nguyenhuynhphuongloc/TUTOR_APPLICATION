"use client";
import { Link, NavGroup } from "@payloadcms/ui";
import { ShieldAlert } from "lucide-react";
import { usePathname } from "next/navigation";

export const AfterNavLinksStudentViolation = () => {
  const pathname = usePathname();

  const href = "/admin/loivipham";

  const active = pathname.includes(href);

  return (
    <NavGroup label={"Views"}>
      <Link
        href={href}
        className="nav__link cursor-pointer"
        id="nav-analytics"
        style={{
          cursor: active ? "pointer" : "auto",
          pointerEvents: active ? "none" : "auto",
        }}
      >
        {active && <div className="nav__link-indicator" />}
        <div className="nav__link-label cursor-pointer flex items-center hover:bg-gray-200">
          <ShieldAlert size={20} className="mr-1 text-red-600" />{" "}
          <span className="text-lg ml-1">lỗi vi phạm</span>
        </div>
      </Link>
    </NavGroup>
  );
};

export default AfterNavLinksStudentViolation;
