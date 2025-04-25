import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import React, { PropsWithChildren } from 'react';

interface AuthContextProviderProps {
  session?: Session | null;
}

export function AuthContextProvider({ children, session }: PropsWithChildren<AuthContextProviderProps>) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
