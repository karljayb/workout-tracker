"use client";

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function UserMenu() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">Welcome, {user?.username}</span>
      <Button variant="ghost" size="sm" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}