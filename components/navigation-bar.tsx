"use server";

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { signOutAction } from "@/app/actions";

export default async function NavigationBar() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    return (
        <nav className="flex items-center w-full justify-between p-4 bg-background">
            <div className="flex items-center">
                <Link href="/" className="text-xl font-bold">
                    Awesome SaaS
                </Link>
            </div>
            <div className="flex items-center gap-4">
                {!error && 
                <div className="flex items-center gap-4">
                    <Button asChild>
                        <Link href="/dashboard" className="text-lg font-semibold">
                            Dashboard
                        </Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <UserCircle className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href="/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <form action={signOutAction}>
                                    <button className="flex items-center">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign Out
                                    </button>
                                </form>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                }
                {error &&
                <div className="flex items-center gap-4">
                    <Button asChild>
                        <Link href="/sign-in" className="text-xl font-bold">
                            Login
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/sign-up" className="text-xl font-bold">
                            Sign Up
                        </Link>
                    </Button>
                </div>
                }
            </div>
        </nav>
    )
}