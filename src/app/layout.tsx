import "@/styles/globals.css";
import { Providers } from "@/components/Providers";
import NavbarComponent from "@/components/Navbar";
import { Toaster } from "@/components/ui/Toaster";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased !px-4">
        <Providers>
          <NavbarComponent />
          {children}
          {/* <ProgressBar
            height="4px"
            color="#fffd00"
            options={{ showSpinner: false }}
            shallowRouting
          /> */}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
