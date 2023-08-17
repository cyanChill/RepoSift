import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "RepoSift | Admin",
};

export default function AdminPage() {
  const navClass = "reverse-btn my-2 !w-full text-start font-medium";

  return (
    <main className="mx-auto w-full max-w-appContent-1/2 p-3 py-5 md:py-20">
      <p className="md:text-lg">Select what action you want to take:</p>
      <ul className="mb-4 ml-8 list-disc text-sm md:mb-8 md:text-base">
        <li>
          <span className="font-medium">[Manage Users]</span> gives you the
          ability to ban or unban a user.
        </li>
        <li>
          <span className="font-medium">[Manage Labels]</span> gives you the
          ability to rename or delete a{" "}
          <span className="font-semibold">regular</span> label.
        </li>
        <li>
          <span className="font-medium">[Manage Repositories]</span> gives you
          the ability to update its primary and regular labels, along with
          assigning it a {`"maintain link"`} if {"it's"} labeled as{" "}
          {`"Abandoned"`}.
        </li>
        <li>
          <span className="font-medium">[View Reports]</span> gives you the
          ability to see the reports submitted by the users.
        </li>
        <li>
          <span className="font-medium">[View Logs]</span> gives you the ability
          to see the actions made by admins.
        </li>
      </ul>
      <hr className="my-4 h-px border-0 bg-black md:my-8" />

      <nav className="flex flex-col">
        <Link href="/admin/users" className={cn(navClass)}>
          Manage Users
        </Link>
        <Link href="/admin/labels" className={cn(navClass)}>
          Manage Labels
        </Link>
        <Link href="/admin/repositories" className={cn(navClass)}>
          Manage Repositories
        </Link>
        <Link href="/admin/reports" className={cn(navClass)}>
          View Reports
        </Link>
        <Link href="/admin/logs" className={cn(navClass)}>
          View Logs
        </Link>
      </nav>
    </main>
  );
}
