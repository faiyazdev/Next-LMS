export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main className="mx-auto px-4 sm:px-8 container">{children}</main>
    </div>
  );
}
