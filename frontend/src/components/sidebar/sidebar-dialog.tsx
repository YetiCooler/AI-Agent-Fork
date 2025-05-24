'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { NavAgents } from '@/components/sidebar/nav-agents';
import { NavUserWithTeams } from '@/components/sidebar/nav-user-with-teams';
import { RyxenLogo } from '@/components/sidebar/ryxen-logo';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface SidebarDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SidebarDialog = ({ open, onOpenChange }: SidebarDialogProps) => {
    const [user, setUser] = useState<{
        name: string;
        email: string;
        avatar: string;
    }>({
        name: 'Loading...',
        email: 'loading@example.com',
        avatar: '',
    });

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getUser();

            if (data.user) {
                setUser({
                    name:
                        data.user.user_metadata?.name ||
                        data.user.email?.split('@')[0] ||
                        'User',
                    email: data.user.email || '',
                    avatar: data.user.user_metadata?.avatar_url || '',
                });
            }
        };

        fetchUserData();
    }, []);

    // Handle keyboard shortcuts (CMD+B) for consistency
    // useEffect(() => {
    //     const handleKeyDown = (event: KeyboardEvent) => {
    //         if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
    //             event.preventDefault();
    //             // We'll handle this in the parent page component
    //             // to ensure proper coordination between panels
    //             onOpenChange(!open);

    //             // Broadcast a custom event to notify other components
    //             window.dispatchEvent(
    //                 new CustomEvent('sidebar-left-toggled', {
    //                     detail: { expanded: !open },
    //                 }),
    //             );
    //         }
    //     };

    //     window.addEventListener('keydown', handleKeyDown);
    //     return () => window.removeEventListener('keydown', handleKeyDown);
    // }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* <DialogHeader>
                <DialogTitle>
                    <h1>Sidebar</h1>
                </DialogTitle>
            </DialogHeader> */}
            <DialogContent className="max-w-90vw w-5xl">
                <NavAgents />
            </DialogContent>
        </Dialog>
    )
}

export default SidebarDialog;