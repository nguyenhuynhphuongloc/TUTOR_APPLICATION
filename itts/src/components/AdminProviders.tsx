// src/components/AdminProviders/index.tsx
"use client";

import { SidebarIcons } from "@/components/SildeBarIcon/SlideBarIcons";
import React from "react";

export default function AdminProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarIcons>{children}</SidebarIcons>;
}
