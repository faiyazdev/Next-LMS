import { Suspense } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Suspense fallback={<div>Loading auth...</div>}>
        {children}
      </Suspense>
    </div>
  );
}
