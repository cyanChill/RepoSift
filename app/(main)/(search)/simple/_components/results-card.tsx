"use client";
import type { CSSProperties } from "react";
import { useState } from "react";
import { FaGithub, FaGitlab, FaBitbucket, FaStar } from "react-icons/fa6";

import type { Results } from "./types";
import type { AuthProviders } from "@/lib/zod/utils";
import { cn, noop } from "@/lib/utils";
import Browser from "@/components/Browser";

type Props = {
  results: Results;
  refreshResults: () => void;
  isRefreshing: boolean;
};

export default function ResultsCard({
  results,
  refreshResults,
  isRefreshing,
}: Props) {
  const [currIdx, setCurrIdx] = useState(0);

  const getProviderIcon = (provider: AuthProviders) => {
    if (provider === "github") return <FaGithub />;
    else if (provider === "gitlab") return <FaGitlab />;
    else if (provider === "bitbucket") return <FaBitbucket />;
  };

  const getPrevResult = () => {
    currIdx !== 0 ? setCurrIdx((prev) => prev - 1) : null;
  };

  const getNextResult = () => {
    if (!results || results.error) return;
    if (currIdx === results.items.length - 1) {
      refreshResults(); // Fetch new results
      setCurrIdx(0);
    } else {
      if (!isRefreshing) setCurrIdx((prev) => prev + 1);
    }
  };

  if (isRefreshing) {
    return (
      <Browser className="h-full max-h-72 min-h-[12.5rem] bg-white">
        <Browser.Header className="bg-purple-200 px-4">
          <Browser.TrafficLights
            size={16}
            withSymbols
            withAction={false}
            disabled={true}
          />
          <Browser.SearchBar className="flex h-8 items-center text-base">
            {" "}
          </Browser.SearchBar>
        </Browser.Header>
        <Browser.Content className="p-2 md:p-4">
          <p className="mb-4 font-medium md:mb-2 md:text-2xl">
            Finding Your Repositories...
          </p>
          <p className="text-sm font-medium">
            <span className="font-bold underline">Note:</span> The{" "}
            <span className="font-semibold">{"(<)"}</span> and{" "}
            <span className="font-semibold">{"(>)"}</span> buttons in the header
            above will allow you to navigate through your search results.
          </p>
        </Browser.Content>
      </Browser>
    );
  }

  return (
    <Browser className="h-full max-h-72 min-h-[12.5rem] bg-white">
      <Browser.Header
        className={cn("px-4", {
          "bg-turquoise-200": !results || !results.error,
          "bg-red-300": !!results && results.error,
        })}
      >
        <Browser.TrafficLights
          size={16}
          withSymbols
          withAction
          redAction={noop}
          yellowAction={getPrevResult}
          greenAction={getNextResult}
          disabled={isRefreshing}
        />
        <Browser.SearchBar className="flex h-8 items-center text-base">
          {!!results && !results.error && getProviderIcon(results.provider)}
        </Browser.SearchBar>
      </Browser.Header>
      <Browser.Content className="p-2 md:p-4">
        {!results && (
          <>
            <p className="mb-1 font-medium md:mb-2 md:text-2xl">
              Start Your Search
            </p>
            <p className="mb-8 text-sm">
              Enter some criterias and click {'"Search"'} to get some results.
            </p>
            <p className="text-sm font-medium">
              <span className="font-bold underline">Note:</span> The{" "}
              <span className="font-semibold">{"(<)"}</span> and{" "}
              <span className="font-semibold">{"(>)"}</span> buttons in the
              header above will allow you to navigate through your search
              results.
            </p>
          </>
        )}
        {!!results && results.error && (
          <>
            <p className="mb-1 font-medium md:mb-2 md:text-2xl">
              Repositories Not Found
            </p>
            <p className="text-sm">
              Try updating your criterias and search again.
            </p>
          </>
        )}
        {!!results &&
          !results.error &&
          (() => {
            const currRepo = results.items[currIdx];
            return (
              <>
                <a
                  href={currRepo.html_url}
                  target="_blank"
                  className="mb-1 max-w-fit font-medium hocus:underline max-md:truncate md:mb-2 md:text-2xl"
                >
                  {currRepo.full_name}
                </a>
                <div
                  style={
                    {
                      "--bs-offset-x": "2px",
                      "--bs-offset-y": "2px",
                    } as CSSProperties
                  }
                  className="mb-1 flex text-xs font-medium md:mb-2"
                >
                  <p className="just-black flex w-fit items-center gap-2 border-2 bg-yellow-300 px-1 py-0.5 shadow-full">
                    <FaStar /> {currRepo.stargazers_count}
                  </p>
                  {currRepo.language && (
                    <p className="just-black flex w-fit items-center gap-2 border-2 border-l-0 bg-purple-300 px-1 py-0.5 shadow-full">
                      {currRepo.language}
                    </p>
                  )}
                </div>
                <p className="text-sm">
                  {currRepo.description || "No description."}
                </p>

                <p className="mt-auto self-end pt-4 text-xs">
                  Last Updated: {new Date(currRepo.updated_at).toLocaleString()}
                </p>
              </>
            );
          })()}
      </Browser.Content>
    </Browser>
  );
}
