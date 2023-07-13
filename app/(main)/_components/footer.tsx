"use client";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";

import useAuth from "@/hooks/useAuth";

export default function Footer() {
  const { isAuth } = useAuth();

  return (
    <footer className="flex grow bg-black text-white">
      <div className="mx-auto grid h-min w-full max-w-appContent gap-y-8 px-8 py-12 md:grid-cols-[70%_auto]">
        <Link
          href="/"
          className="w-fit text-4xl font-semibold uppercase md:col-span-2"
        >
          RepoSift
        </Link>
        <p className="max-w-[20ch] text-lg font-medium md:text-2xl">
          Better Repository Indexing and Searching.
        </p>

        <ul className="w-fit md:text-lg">
          <li>
            <Link href="/simple" className="hover:underline">
              Simple Search
            </Link>
          </li>
          <li>
            <Link href="/indexed" className="hover:underline">
              Indexed Search
            </Link>
          </li>
          {isAuth && (
            <li>
              <Link href="/contribute" className="hover:underline">
                Contribute
              </Link>
            </li>
          )}
        </ul>

        <a
          href="https://github.com/cyanChill/RepoSift"
          target="_blank"
          referrerPolicy="no-referrer"
          className="flex items-center hover:underline"
        >
          <FaGithub className="mr-2" /> &copy; cyanChill, 2023
        </a>
      </div>
    </footer>
  );
}
