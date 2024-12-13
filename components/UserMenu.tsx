import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function UserMenu() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">
        Welcome, {user?.username}
      </span>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={logout}
        className="gap-2 hover:bg-secondary"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}