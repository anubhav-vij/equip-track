
"use client";

import { UserCog, User } from 'lucide-react';
import type { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


type UserRoleSwitcherProps = {
  role: UserRole;
  setRole: (role: UserRole) => void;
};

export function UserRoleSwitcher({ role, setRole }: UserRoleSwitcherProps) {
  const toggleRole = () => {
    setRole(role === 'admin' ? 'user' : 'admin');
  };

  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleRole}>
                    {role === 'admin' ? <UserCog className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    <span className="sr-only">Toggle Role</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Switch to {role === 'admin' ? 'User' : 'Admin'} view</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}
