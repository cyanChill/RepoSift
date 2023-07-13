import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import Browser from "@/components/Browser";
import MarqueeX from "@/components/MarqueeX";

const DUMMY_LABELS = ["Projects", "Front End", "Back End"];
const DUMMY_LANGS = ["TypeScript", "HTML", "Ruby on Rails"];

const COLOR_SET_1 = ["#7dd3fc", "#facc15", "#60ff46"];
const COLOR_SET_2 = ["#3cc7be", "#b494e9", "#ff9fea"];

export default function HomePage() {
  return (
    <main className="flex flex-col">
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

      {/* 2nd Section */}
      <div className="split-layout">
        <div className="split-content-left bg-yellow-400">
          <div className="split-section-content grid grid-cols-2 gap-4">
            <Image
              src="/assets/icons/github.svg"
              alt=""
              width={128}
              height={128}
              className="just-black col-span-2 h-24 w-24 justify-self-center border-3 bg-white p-3 shadow-full md:h-32 md:w-32"
            />
            <Image
              src="/assets/icons/gitlab-colored.svg"
              alt=""
              width={128}
              height={128}
              className="just-black h-24 w-24 justify-self-end border-3 bg-white p-3 shadow-full md:h-32 md:w-32"
            />
            <Image
              src="/assets/icons/bitbucket-colored.svg"
              alt=""
              width={128}
              height={128}
              className="just-black h-24 w-24 border-3 bg-white p-3 shadow-full md:h-32 md:w-32"
            />
          </div>
        </div>
        <div className="split-content-right bg-red-300">
          <div className="split-section-content w-fit md:text-xl">
            <h2 className="text-4xl font-medium md:text-6xl">
              Seamless integration.
            </h2>
            <p className="my-4 md:my-8">
              Easily join RepoSift by using your GitHub credentials.
            </p>
            <p className="my-4 md:my-8">
              Support for Bitbucket and GitLab coming in a future update.
            </p>
            <Link
              href="/join"
              className="btn just-black mx-auto block w-fit bg-p-green-400 px-8 font-medium md:mx-0"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>

      {/* 3rd Section */}
      <MarqueeX>
        <p>Indexing better, one repository at a time.</p>
      </MarqueeX>

      {/* 4th Section */}
      <div className="flex justify-center p-5 md:p-20">
        <div className="grid max-w-appContent place-items-center gap-4 text-lg md:grid-cols-[repeat(2,max-content)] md:text-2xl">
          <div>
            <p className="mb-4 max-w-[14ch] text-2xl font-medium md:mb-8 md:text-5xl">
              Indexing better, one repository at a time.
            </p>
            <Link
              href="/indexed"
              className="btn just-black mx-auto block w-fit bg-white px-8 font-medium"
            >
              Start Searching
            </Link>
          </div>
          <Image
            src="/assets/icons/indexing.svg"
            alt=""
            width={190}
            height={261}
            className="h-40 w-auto max-md:row-start-1 md:h-48"
          />
        </div>
      </div>

      {/* 5th Section */}
      <div className="border-t-3 border-black bg-green-300 p-5">
        <p className="mx-auto max-w-appContent text-center text-2xl md:text-5xl">
          Users of RepoSift are really into these kinds of repositories:
        </p>
      </div>
      <div className="split-layout">
        <div className="split-content-left bg-purple-300">
          <div className="split-section-content">
            <RepoStats type="Labels" data={DUMMY_LABELS} colors={COLOR_SET_1} />
          </div>
        </div>
        <div className="split-content-right bg-orange-300">
          <div className="split-section-content">
            <RepoStats
              type="Languages"
              data={DUMMY_LANGS}
              colors={COLOR_SET_2}
            />
          </div>
        </div>
      </div>

      {/* 6th Section */}
      <div className="relative flex items-center justify-center overflow-hidden bg-[#ca4141]">
        <Image
          src="/assets/vector.svg"
          alt=""
          width={360}
          height={360}
          className="absolute left-0 top-0 h-auto w-[50vw] min-w-[360px] origin-center -translate-x-1/2 -translate-y-1/2 animate-rotate"
        />
        <div className="flex max-w-appContent flex-col items-center justify-center px-4 py-48 md:px-10 md:py-64">
          <p className="mb-8 max-w-[14ch] text-center text-4xl font-semibold text-white md:text-7xl">
            Start Contributing Today!
          </p>
          <Link
            href="/contribute"
            className="btn just-black block w-fit bg-white px-12 text-lg font-medium md:px-16 md:text-2xl"
          >
            Contribute
          </Link>
        </div>
        <Image
          src="/assets/vector.svg"
          alt=""
          width={360}
          height={360}
          className="absolute bottom-0 right-0 h-auto w-[50vw] min-w-[360px] origin-center translate-x-1/2 translate-y-1/2 animate-rotate"
        />
      </div>
    </main>
  );
}

type RepoStatsProps = { type: string; data: string[]; colors: string[] };

const RepoStats = ({ type, data, colors }: RepoStatsProps) => {
  const POSITION = [
    "ml-[2.5%]",
    "ml-[7.5%] mt-[-7.5%]",
    "ml-[12.5%] mt-[-7.5%]",
  ];

  return (
    <>
      <p className="text-lg md:text-xl">↓ {type}</p>
      <div className="mt-8">
        {data.map((val, idx) => {
          return (
            <div
              key={val}
              style={{ "--clr": colors[idx] } as CSSProperties}
              className="isolate"
            >
              <div
                className={cn(
                  "relative flex min-h-[108px] w-[80%] justify-between gap-2 border border-black bg-white p-2 text-lg font-medium md:text-2xl",
                  "before:absolute before:-left-2 before:top-2 before:z-[-1] before:h-full before:w-full before:border before:border-black before:bg-[var(--clr)]",
                  POSITION[idx]
                )}
              >
                <div className="max-w-[calc(100%-56px)]">{val}</div>
                <p className="flex h-9 w-9 items-center justify-center rounded-full border border-black bg-[var(--clr)] p-1">
                  {idx + 1}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
