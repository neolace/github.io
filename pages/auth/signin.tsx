import { GetServerSidePropsContext } from 'next';
import { getProviders, signIn } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';

interface SignInProps {
  providers: Record<string, {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
  }>;
}

export default function SignIn({ providers }: SignInProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {Object.values(providers).map((provider) => (
            <div key={provider.name} className="text-center">
              <button
                onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
