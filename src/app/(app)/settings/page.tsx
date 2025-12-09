import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-4 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
        <SettingsIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <CardHeader>
          <CardTitle>Settings Page Coming Soon</CardTitle>
          <CardDescription>
            Manage your profile, study preferences, and notification settings here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You'll be able to update your name, subjects, preferred study times, and more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
