
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { UserNav } from "@/components/user-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OnboardingPage from "./onboarding/page";

// Assume a function to check if user has completed onboarding
// In a real app, this would check a flag in the user's Firestore profile
async function checkIfOnboardingComplete(userId: string): Promise<boolean> {
  // For now, let's simulate this. Replace with actual Firestore check.
  console.log("Checking onboarding status for:", userId);
  // const userProfileRef = doc(db, 'users', userId, 'userProfiles', userId);
  // const docSnap = await getDoc(userProfileRef);
  // return docSnap.exists() && docSnap.data().onboardingComplete === true;
  return false; // For demonstration, force onboarding
}


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    if (isUserLoading) return; // Wait until user object is available

    if (!user) {
      router.push("/");
      return;
    }

    checkIfOnboardingComplete(user.uid).then(isComplete => {
      if (!isComplete) {
        setIsOnboarding(true);
      } else {
        setIsOnboarding(false);
      }
      setIsCheckingOnboarding(false);
    });

  }, [user, isUserLoading, router]);

  if (isUserLoading || isCheckingOnboarding) {
    // You can render a loading spinner here
    return <div>Loading...</div>;
  }
  
  if (isOnboarding) {
    return <OnboardingPage />;
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
