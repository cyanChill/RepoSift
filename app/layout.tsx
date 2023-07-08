import "./globals.css";
import localFont from "next/font/local";

const ClashDisplay = localFont({
  src: "./ClashDisplay-Variable.ttf",
});

export const metadata = {
  title: "RepoSift",
  description: "Better repository indexing and searching.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ClashDisplay.className}>
      {children}
    </html>
  );
}
