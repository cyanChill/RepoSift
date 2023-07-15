"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { AiFillCaretDown } from "react-icons/ai";

import useAuth from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/useBreakpoint";
import { useExitOutRef } from "@/hooks/useExitOutRef";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const [ref] = useExitOutRef<HTMLDivElement>(() => setIsOpen(false));

  useEffect(() => {
    setIsOpen(false);
  }, [isMobile, pathname]);

  return (
    <div className="sticky top-0 z-nav w-full border-y-3 border-black bg-orange-400">
      <div className="relative mx-auto flex max-w-appContent items-center gap-3 bg-orange-400 text-lg font-medium md:text-xl">
        <Link href="/" className="ml-2 mr-auto">
          <Image
            src="/assets/icons/logo-full.svg"
            alt=""
            width="144"
            height="38"
            priority
          />
        </Link>

        {!isMobile && (
          <nav className="hidden self-stretch md:flex md:gap-6">
            <NavOptions />
          </nav>
        )}

        <SignInBtn />

        <div ref={ref}>
          <button
            className="shrink-0 py-4 pr-2 md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <Image
              src={`/assets/icons/${isOpen ? "close.svg" : "menu-bars.svg"}`}
              alt=""
              width="24"
              height="24"
              className="h-6 w-6"
            />
          </button>

          {isMobile && (
            <div className="absolute bottom-0 left-0 z-[-1] w-full translate-y-full">
              <Transition
                show={isOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95 -translate-y-1/4"
                enterTo="transform opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100 translate-y-0"
                leaveTo="transform opacity-0 scale-95 -translate-y-1/4"
              >
                <nav className="flex origin-top flex-col gap-4 border-y-3 border-black bg-white p-8 text-2xl">
                  <NavOptions />
                </nav>
              </Transition>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const NavOptions = () => {
  const { isAuth, isAdmin } = useAuth();

  return (
    <>
      <SearchBtn />
      <Link href="/contribute" className="hocus-underline my-auto w-min">
        Contribute
      </Link>
      {isAuth && (
        <>
          <Link href="/profile" className="hocus-underline my-auto w-min">
            Profile
          </Link>
          <Link href="/misc" className="hocus-underline my-auto w-min">
            Misc.
          </Link>
        </>
      )}
      {isAdmin && (
        <Link href="/admin" className="hocus-underline my-auto w-min">
          Admin
        </Link>
      )}
    </>
  );
};

const SearchBtn = () => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <div className="flex flex-col gap-4">
      <p className="flex items-center">
        Search <AiFillCaretDown />
      </p>
      <Link href="/simple" className="hocus-underline ml-2 w-min">
        Simple
      </Link>
      <Link href="/indexed" className="hocus-underline ml-2 w-min">
        Indexed
      </Link>
    </div>
  ) : (
    <Menu as="div" className="relative py-3">
      <Menu.Button className="inline-flex items-center">
        Search <AiFillCaretDown />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute bottom-0 right-0 origin-top translate-y-full border-3 border-black bg-white px-6 py-2">
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/simple"
                className={`link-underline inline-block ${
                  active ? "link-underline-active" : ""
                }`}
              >
                Simple
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/indexed"
                className={`link-underline inline-block ${
                  active ? "link-underline-active" : ""
                }`}
              >
                Indexed
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const SignInBtn = () => {
  const pathname = usePathname();
  const { isLoading, isAuth } = useAuth();

  if (isLoading) return null;

  return (
    <>
      {isAuth ? (
        <button
          onClick={() => void signOut()}
          className="btn just-black md:btn-strip whitespace-pre bg-p-green-400 py-1 md:border-x-3 md:px-6 md:py-3 md:hover:bg-p-green-600"
        >
          Sign Out
        </button>
      ) : (
        <Link
          href={`/join?callbackUrl=${encodeURIComponent(pathname)}`}
          className="btn just-black md:btn-strip bg-p-green-400 py-1 md:border-x-3 md:px-6 md:py-3 md:hover:bg-p-green-600"
        >
          Join
        </Link>
      )}
    </>
  );
};
