// src/modules/dashboard/ui/components/dashboard-user-button.tsx

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerTrigger
} from "@/components/ui/drawer";
import { authClient } from "@/lib/auth-client";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export const DashboardUserButton = () => {
    const router = useRouter();
    const { data, isPending } = authClient.useSession();
    const isMobile = useIsMobile();
    
    // --- Define actions that will be used by both layouts ---
    const onLogOut = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                },
            },
        });
    };

    // removed unused onBilling

    if (isPending || !data?.user) {
        return null;
    }

    // --- Mobile View using Drawer ---
    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                    {/* ... (Trigger content is the same, no changes here) ... */}
                    {data.user.image ? (
                        <Avatar className="size-9"><AvatarImage src={data.user.image} /></Avatar>
                    ) : (
                        <GeneratedAvatar seed={data.user.id} variant="initials" className="size-9" />
                    )}
                    <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                        <p className="text-sm w-full truncate">{data.user.name}</p>
                        <p className="text-xs truncate w-full">{data.user.email}</p>
                    </div>
                    <ChevronDownIcon className="size-4 shrink-0" />
                </DrawerTrigger>
                <DrawerContent className="bg-background">
                    <DrawerHeader>
                        <DrawerTitle>{data.user.name}</DrawerTitle>
                        <DrawerDescription>{data.user.email}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        {/* FIX: Added correct onClick handlers to mobile buttons */}
                        <Button variant="outline" className="w-full justify-start gap-x-2" onClick={() => authClient.customer.portal()}>
                            <CreditCardIcon className="size-4" />
                            Billing
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-x-2" onClick={onLogOut}>
                            <LogOutIcon className="size-4" />
                            Log Out
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
    }

    // --- Desktop View using DropdownMenu ---
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                 {/* ... (Trigger content is the same, no changes here) ... */}
                 {data.user.image ? (
                    <Avatar className="size-9"><AvatarImage src={data.user.image} /></Avatar>
                ) : (
                    <GeneratedAvatar seed={data.user.id} variant="initials" className="size-9 mr-3" />
                )}
                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-sm w-full truncate">{data.user.name}</p>
                    <p className="text-xs truncate w-full">{data.user.email}</p>
                </div>
                <ChevronDownIcon className="size-4 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-72 p-2">
                <div className="flex flex-col gap-1 p-2">
                    <span className="font-medium truncate">{data.user.name}</span>
                    <span className="text-sm font-normal text-muted-foreground truncate">{data.user.email}</span>
                </div>
                <DropdownMenuSeparator />
                {/* FIX: Added correct onClick handler to the Billing item */}
                <DropdownMenuItem className="cursor-pointer flex items-center justify-between" onClick={() => authClient.customer.portal()}>
                    Billing
                    <CreditCardIcon className="size-4" />
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center justify-between" onClick={onLogOut}>
                    Log Out
                    <LogOutIcon className="size-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};