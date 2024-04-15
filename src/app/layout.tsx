import "@/styles/globals.css";  
import {Providers} from "@/components/Providers";
import NavbarComponent from "@/components/Navbar";

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <NavbarComponent />
          {children}
        </Providers>
      </body>
    </html>
  );
}