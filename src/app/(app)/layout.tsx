
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { UserNav } from "@/components/user-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user status is resolved
    }
    
    if (!user) {
      router.push("/");
      return;
    }

  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    // Show a loading state while checking for user or redirecting
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              {/* <h1 className="text-lg font-semibold">StudyStreak AI</h1> */}
            </div>
            <UserNav />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
  );
}
