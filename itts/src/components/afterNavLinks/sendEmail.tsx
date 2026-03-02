"use client";
import { Link, NavGroup } from "@payloadcms/ui";
import { Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export const SendEmailLink = () => {
  const pathname = usePathname();

  const href = "/admin/email";

  // Check if the current path includes the href
  const active = pathname.includes(href);

  return (
    <NavGroup label={"Email"}>
      <Link
        href={href}
        className="nav__link cursor-pointer"
        id="nav-send-email"
        style={{
          cursor: active ? "pointer" : "auto",
          pointerEvents: active ? "none" : "auto",
        }}
      >
        <div className="nav__link-label cursor-pointer flex items-center hover:bg-gray-200">
          <Mail className="mr-2 text-blue-500" /> <span>Gửi Email</span>
        </div>
      </Link>
    </NavGroup>
  );
};

export default SendEmailLink;
