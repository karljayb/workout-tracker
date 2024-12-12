"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to Workout Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => login()} 
            className="w-full flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}