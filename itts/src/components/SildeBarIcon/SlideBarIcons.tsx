"use client";

import {
  Activity,
  Archive,
  Award,
  Book,
  BookOpen,
  Briefcase,
  CalendarClock,
  ClipboardCheck,
  Compass,
  Crown,
  Database,
  DoorOpen,
  Drama,
  File,
  FileStack,
  FileText,
  Fingerprint,
  FolderCog,
  FolderOpen,
  GraduationCap,
  HeartHandshake,
  LayoutList,
  Library,
  MapPin,
  Martini,
  MessageSquare,
  Pizza,
  Receipt,
  Rocket,
  ShieldAlert,
  SpellCheck,
  Target,
  UserCheck,
  UserRoundCheckIcon,
  Users,
} from "lucide-react";
import { SidebarIconProvider } from "payload-sidebar-plugin/components";
import React from "react";

const customIcons = {
  rocket: (props: any) => <Rocket {...props} className="text-red-500" />,
  class: (props: any) => <BookOpen {...props} className="text-cyan-800" />,
  users: (props: any) => <Users {...props} className="text-cyan-500" />,
  Book: (props: any) => <Book {...props} className="text-cyan-500" />,
  MapPin: (props: any) => <MapPin {...props} className="text-rose-600" />,
  martini: (props: any) => <Martini {...props} className="text-rose-600" />,
  pizza: (props: any) => <Pizza {...props} className="text-rose-600" />,
  compass: (props: any) => <Compass {...props} className="text-rose-600" />,
  DoorOpen: (props: any) => <DoorOpen {...props} className="text-blue-500" />,
  drama: (props: any) => <Drama {...props} className="text-rose-600" />,
  Activity: (props: any) => <Activity {...props} className="text-indigo-600" />,
  Briefcase: (props: any) => (
    <Briefcase {...props} className="text-amber-600" />
  ),
  schedule: (props: any) => (
    <CalendarClock {...props} className="text-fuchsia-500" />
  ),
  attendance: (props: any) => (
    <ClipboardCheck {...props} className="text-green-600" />
  ),
  fingerprint: Fingerprint,
  ClipboardCheck: (props: any) => (
    <ClipboardCheck {...props} className="text-green-800" />
  ),
  Receipt: (props: any) => <Receipt {...props} className="text-lime-600" />,
  UserCheck: (props: any) => (
    <UserCheck {...props} className="text-emerald-600" />
  ),
  Users: (props: any) => <Users {...props} className="text-teal-600" />,
  HeartHandshake: (props: any) => (
    <HeartHandshake {...props} className="text-pink-500" />
  ),
  image: (props: any) => <FolderCog {...props} className="text-orange-600" />,
  GraduationCap: (props: any) => (
    <GraduationCap {...props} className="text-violet-600" />
  ),
  MessageSquare: (props: any) => (
    <MessageSquare {...props} className="text-blue-400" />
  ),
  ClipboardList: (props: any) => (
    <MessageSquare {...props} className="text-blue-400" />
  ),
  FileQuestion: (props: any) => (
    <MessageSquare {...props} className="text-blue-400" />
  ),
  PenLine: (props: any) => (
    <MessageSquare {...props} className="text-blue-400" />
  ),
  Archive: (props: any) => <Archive {...props} className="text-red-600" />,
  FileText: (props: any) => <FileText {...props} className="text-indigo-500" />,
  Library: (props: any) => <Library {...props} className="text-orange-600" />,
  Crown: (props: any) => <Crown {...props} className="text-yellow-500" />,
  Award: (props: any) => <Award {...props} className="text-yellow-500" />,
  LayoutList: (props: any) => (
    <LayoutList {...props} className="text-emerald-600" />
  ),
  FileStack: (props: any) => <FileStack {...props} className="text-sky-300" />,
  File: (props: any) => <File {...props} className="text-fuchsia-500" />,
  words: (props: any) => <File {...props} className="text-indigo-500" />,
  Database: (props: any) => <Database {...props} className="text-green-400" />,
  FolderOpen: (props: any) => (
    <FolderOpen {...props} className="text-orange-600" />
  ),
  SpellCheck: (props: any) => (
    <SpellCheck {...props} className="text-red-400" />
  ),
  Target: (props: any) => <Target {...props} className="text-rose-500" />,
  ShieldAlert: (props: any) => (
    <ShieldAlert {...props} className="text-red-500" />
  ),
  Permission: (props: any) => (
    <UserRoundCheckIcon {...props} className="text-[#E72727]" />
  ),
};

export function SidebarIcons({ children }: { children: React.ReactNode }) {
  return (
    <SidebarIconProvider icons={customIcons}>{children}</SidebarIconProvider>
  );
}
