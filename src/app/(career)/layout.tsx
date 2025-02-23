import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";

export default function CareersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main>
      {children}
      </main>
      <Toaster />
    </>
  );
}
