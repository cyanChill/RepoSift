import Image from "next/image";
import { FaMagnifyingGlass } from "react-icons/fa6";
import type { CSSProperties } from "react";

import Browser from "@/components/Browser";

export default function HomePage() {
  return (
    <>
      {/* 1st Section */}
      <div className="bg-blue-500 p-5 md:p-20">
        <Browser className="mx-auto max-w-appContent">
          <Browser.Header className="p-4">
            <Browser.TrafficLights size={20} withAction={false} />
          </Browser.Header>
          <Browser.Content className="grid grid-cols-[max-content_auto] items-center gap-4 px-4 py-4 md:px-8">
            <Image
              src="/assets/icons/logo.svg"
              alt=""
              width={50}
              height={50}
              className="h-8 w-8 md:h-12 md:w-12"
            />
            <Browser.SearchBar
              style={
                {
                  "--bs-offset-x": "4px",
                  "--bs-offset-y": "4px",
                } as CSSProperties
              }
              className="flex max-w-xl items-center justify-between justify-self-start rounded-full px-4 shadow-full md:text-3xl"
            >
              <p>How to find useful repositories?</p>
              <FaMagnifyingGlass />
            </Browser.SearchBar>

            <div className="col-start-2 my-8 flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-medium">Search</h2>
                <p className="mt-2">
                  Go through our database of{" "}
                  <span className="font-semibold">
                    indexed and labeled repositories provided by developers to
                    help people like YOU
                  </span>{" "}
                  with improved filtering capabilities compared to GitHub&apos;s
                  default search.
                </p>
                <p className="mt-2">
                  Alternatively, utilize our &quot;simple search&quot; to find
                  repositories directly from providers like GitHub (with more
                  limited capabilities).
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-medium">Contribute</h2>
                <p className="mt-2">
                  Help other developers by{" "}
                  <span className="font-semibold">
                    suggesting labels and indexing repositories for our database
                  </span>{" "}
                  that you find interesting, useful, or inspiring to others.
                </p>
              </div>
            </div>
          </Browser.Content>
        </Browser>
      </div>
    </>
  );
}
