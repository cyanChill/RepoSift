import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

import Provider from "@/components/Provider";
import Navbar from "./_components/navbar";
import Header from "./_components/header";
import Footer from "./_components/footer";
import ScrollTop from "./_components/scrollTop";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <body className="flex flex-col bg-bkg text-black">
      <ScrollTop />

      <Header />
      <Provider>
        <Navbar />
        {children}
      </Provider>
      <Footer />

      <Toaster position="bottom-center" />
      <Analytics />
    </body>
  );
}
