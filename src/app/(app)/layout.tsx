
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { UserNav } from "@/components/user-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OnboardingPage from "./onboarding/page";
import { doc } from "firebase/firestore";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'userProfiles', user.uid);
  }, [user, firestore]);
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const [isOnboarding, setIsOnboarding] = useState(true);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    if (isUserLoading || isProfileLoading) {
      return; // Wait until both user and profile data are loaded
    }
    
    if (!user) {
      router.push("/");
      return;
    }

    if (userProfile && (userProfile as any).onboardingComplete) {
      setIsOnboarding(false);
    } else {
      setIsOnboarding(true);
    }
    setIsCheckingOnboarding(false);

  }, [user, isUserLoading, userProfile, isProfileLoading, router]);

  if (isUserLoading || isCheckingOnboarding) {
    // You can render a loading spinner here
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }
  
  if (isOnboarding && user) {
    return <OnboardingPage />;
  }

  if (!user) {
    // This case should be handled by the initial useEffect, but as a fallback
    return <div className="flex h-screen w-full items-center justify-center">Redirecting...</div>;
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
