"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import{
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";
import { DashboardTrial } from "./dashboard-trial";

const firstSection = [
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings",
    }, 
    {
        icon: BotIcon,
        label: "Agents",
        href: "/agents",
    }
]


const secondSection = [
    {
        icon: StarIcon,
        label: "Upgrade",
        href: "/upgrade",
    }, 
]

export const DashboardSidebar = () => {

    const pathname = usePathname();
    // const pathname = "/agents"; // for testing purposes 
    return (
        <Sidebar>
            <SidebarHeader className = "text-sodebar-accent-foreground">
                <Link href = "/" className="flex items-center gap-2 px-2 pt-2">
                    <Image src = "/logo.svg" alt = "Agent Connect" width = {36} height = {36} />
                    <p className = "text-2xl font-semibold">Agent Connect</p>

                 </Link>
            </SidebarHeader>
            <div className="px-4 py-2">
                <Separator className = "opacity-10 text-[#5D6B68]"/>
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item)=> (
                                <SidebarMenuItem key = {item.href}>
                                    <SidebarMenuButton 
                                    asChild
                                    className={cn(
                                        "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                        pathname === item.href && "bg-linear-to-r/oklch border-[#5D6D68]/10"
                                    )}
                                    isActive={pathname === item.href}
                                >
                                        <Link href = {item.href}>
                                            <item.icon className = "size-4" />
                                            <span className = "flex items-center gap-2">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <div className="px-4 py-2">
                <Separator className = "opacity-10 text-[#5D6B68]"/>
            </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondSection.map((item)=> (
                                <SidebarMenuItem key = {item.href}>
                                    <SidebarMenuButton 
                                    asChild
                                    className={cn(
                                        "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                        pathname === item.href && "bg-linear-to-r/oklch border-[#5D6D68]/10"
                                    )}
                                    isActive={pathname === item.href}
                                >
                                        <Link href = {item.href}>
                                            <item.icon className = "size-4" />
                                            <span className = "flex items-center gap-2">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="text-white">
                <DashboardTrial />
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    )
}