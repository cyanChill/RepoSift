import Provider from "@/components/Provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <body className="bg-slate-950 text-white">
      <Provider>
        <div>{children}</div>
      </Provider>
    </body>
  );
}
