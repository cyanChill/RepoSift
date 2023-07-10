import Provider from "@/components/Provider";
import Navbar from "./_components/navbar";
import Header from "./_components/header";
import Footer from "./_components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <body className="flex flex-col bg-bkg text-black">
      <Header />
      <Provider>
        <Navbar />
        <div>{children}</div>
        <Footer />
      </Provider>
    </body>
  );
}
