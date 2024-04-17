import "@/styles/globals.css";  
import {Providers} from "@/components/Providers";
import NavbarComponent from "@/components/Navbar";

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased px-4">
        <Providers>
          <NavbarComponent />
          {children}
        </Providers>
      </body>
    </html>
  );
}