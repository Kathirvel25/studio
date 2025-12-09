"use client"

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CreditCard, LogOut, Settings, User } from "lucide-react";

export function UserNav() {
    const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
                {userAvatar ? (
                    <Image 
                        src={userAvatar.imageUrl} 
                        alt={userAvatar.description} 
                        width={36} 
                        height={36} 
                        data-ai-hint={userAvatar.imageHint}
                        className="rounded-full"
                    />
                ) : (
                    <AvatarFallback>JD</AvatarFallback>
                )}
            </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Jane Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                jane.doe@example.com
                </p>
            </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/settings">
                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/billing">
                <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    );
}
