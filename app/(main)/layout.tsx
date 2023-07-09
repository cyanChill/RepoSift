import Provider from "@/components/Provider";
import Navbar from "./_components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <body className="bg-bkg text-black">
      <Provider>
        <Navbar />
        <div>{children}</div>
      </Provider>
    </body>
  );
}
