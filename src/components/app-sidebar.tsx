"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Calendar, BookCopy, Flame, LayoutDashboard, Settings, FileText, Youtube } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/syllabus", label: "Syllabus", icon: BookCopy },
  { href: "/streaks", label: "Streaks", icon: Flame },
  { href: "/summarizer", label: "Summarizer", icon: FileText },
  { href: "/ai-feedback", label: "AI Feedback", icon: BrainCircuit },
  { href: "/resources", label: "Resources", icon: Youtube },
];

const settingsMenuItem = { href: "/settings", label: "Settings", icon: Settings };


export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <Flame className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold tracking-tighter">StudyStreak AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
            {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                      <SidebarMenuButton
                          isActive={isActive(item.href)}
                          tooltip={{ children: item.label, side: "right" }}
                          className="justify-start"
                      >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarContent className="p-2 mt-auto">
         <SidebarMenu>
            <SidebarMenuItem>
                <Link href={settingsMenuItem.href}>
                <SidebarMenuButton
                    isActive={isActive(settingsMenuItem.href)}
                    tooltip={{ children: settingsMenuItem.label, side: "right" }}
                    className="justify-start"
                >
                    <settingsMenuItem.icon className="h-5 w-5" />
                    <span>{settingsMenuItem.label}</span>
                </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
