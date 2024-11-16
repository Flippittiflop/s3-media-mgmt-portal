'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <User className="h-6 w-6" />
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </Button>
      </div>
    </header>
  );
}