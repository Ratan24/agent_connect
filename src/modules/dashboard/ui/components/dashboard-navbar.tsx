"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandList,
} from "@/components/ui/command";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { DashboardCommand } from "./dashboard-command";

export const DashboardNavbar = () => {
    const { state, toggleSidebar, isMobile } = useSidebar();
    const [isOpen, setIsOpen] = useState(false);
    const [commandOpen, setCommandOpen] = useState(false);

    // Effect to listen for keyboard shortcuts (⌘K or Ctrl+K)
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <DashboardCommand open={commandOpen} setOpen={setCommandOpen}/>
            <nav className="flex items-center px-4 gap-x-2 border-b bg-background py-3">
                <Button
                    className="size-9 p-0"
                    variant="outline"
                    onClick={toggleSidebar}
                >
                    {state === "collapsed" || isMobile ? (
                        <PanelLeftIcon className="size-5" />
                    ) : (
                        <PanelLeftCloseIcon className="size-5" />
                    )}
                </Button>
                <Button
                    className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground"
                    variant="outline"
                    size="sm"
                    onClick={() => setCommandOpen((open) => !open)} // Opens the command dialog
                >
                    <SearchIcon className="size-4 mr-2" /> 
                    <span className="text-sm">Search</span>
                    {/* FIX: Corrected typo "in;line-flex" to "inline-flex" */}
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>
            </nav>
            {/* ADDED: The command dialog component */}
            <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {/* You can add CommandGroup and CommandItem here later */}
                </CommandList>
            </CommandDialog>
        </>
    );
};