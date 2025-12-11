
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { BellRing, Loader2, User } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  picture: z.any().optional(),
});

const notificationsFormSchema = z.object({
  notifications: z.boolean().default(false),
  reminderTime: z.string().optional(),
});

export default function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      picture: undefined,
    },
  });

  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      notifications: true,
      reminderTime: "09:00",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.displayName || "",
      });
    }
  }, [user, profileForm]);


  async function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
    if (!user) {
      toast({ variant: "destructive", title: "You must be logged in." });
      return;
    }
    setIsProfileLoading(true);

    try {
      let photoURL = user.photoURL;
      const pictureFile = data.picture?.[0];
      
      if (pictureFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `profile-pictures/${user.uid}`);
        await uploadBytes(storageRef, pictureFile);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName: data.name,
        photoURL: photoURL,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Could not update profile. Please try again.",
      });
    } finally {
      setIsProfileLoading(false);
    }
  }

  function onNotificationsSubmit(data: z.infer<typeof notificationsFormSchema>) {
    setIsNotificationsLoading(true);
    // Simulate async operation
    setTimeout(() => {
      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated.",
      });
      console.log(data);
      setIsNotificationsLoading(false);
    }, 1000);
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account and notification settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-8"
            >
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} disabled={isProfileLoading} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="picture"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        {...fieldProps} 
                        onChange={event => {
                          onChange(event.target.files);
                        }} 
                        accept="image/*"
                        disabled={isProfileLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a new profile picture.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isProfileLoading}>
                {isProfileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage your notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...notificationsForm}>
            <form
              onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}
              className="space-y-8"
            >
              <FormField
                control={notificationsForm.control}
                name="notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Enable Notifications
                      </FormLabel>
                      <FormDescription>
                        Receive reminders to study based on your schedule.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isNotificationsLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={notificationsForm.control}
                name="reminderTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Reminder Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        className="w-[180px]"
                        {...field}
                        disabled={!notificationsForm.watch("notifications") || isNotificationsLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Set the time you want to receive your daily study reminder.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isNotificationsLoading}>
                {isNotificationsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
