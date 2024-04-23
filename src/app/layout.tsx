import "@/styles/globals.css";
import { Providers } from "@/components/Providers";
import NavbarComponent from "@/components/Navbar";
import { Toaster } from "@/components/ui/Toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased px-4">
        <Providers>
          <NavbarComponent />
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
