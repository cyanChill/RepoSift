"use client";
import type { CSSProperties } from "react";
import { useState, useRef, useTransition } from "react";
import { FaGithub, FaGitlab, FaBitbucket, FaStar } from "react-icons/fa6";

import { simpleSearch } from "@/server-actions/simple-search";
import { type AuthProviders } from "@/lib/zod/types";
import { type GitHubRepo } from "@/lib/zod/schema";
import { cn, formDataToObj, removeEmptyProperties } from "@/lib/utils";
import { noop } from "@/lib/noop";
import { Select } from "@/components/form/input";
import { MinMaxRange, MultiText } from "@/components/form/custom";
import Browser from "@/components/Browser";

type Results =
  | undefined
  | { error: true }
  | { error: false; provider: AuthProviders; items: GitHubRepo[] };

export default function SSClientPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [currIdx, setCurrIdx] = useState(0);
  const [results, setResults] = useState<Results>(undefined);
  const [isPending, startTransition] = useTransition();

  async function queueSearch(formData: FormData) {
    const cleanedData = removeEmptyProperties(formDataToObj(formData));
    try {
      const data = await simpleSearch(cleanedData);
      if (!data) throw new Error("Something unexpected occurred.");
      setCurrIdx(0);
      setResults({ error: false, ...data });
    } catch (err) {
      setResults({ error: true });
    }
  }

  const getProviderIcon = (provider: AuthProviders) => {
    if (provider === "github") return <FaGithub />;
    else if (provider === "gitlab") return <FaGitlab />;
    else if (provider === "bitbucket") return <FaBitbucket />;
  };

  const getPrevRes = () => {
    currIdx !== 0 ? setCurrIdx((prev) => prev - 1) : null;
  };

  const getNextRes = () => {
    if (!results || results.error) return;
    if (currIdx === results.items.length - 1) {
      if (formRef.current) formRef.current.requestSubmit(); // Fetch new results
    } else {
      if (!isPending) setCurrIdx((prev) => prev + 1);
    }
  };

  return (
    <div className="grid gap-4 p-3 py-5 md:grid-cols-2 md:py-20">
      {/* Simple Search Form */}
      <form
        id="simple-search-form"
        ref={formRef}
        action={(data) => startTransition(() => queueSearch(data))}
      >
        <fieldset disabled={isPending}>
          <Select
            name="provider"
            label="Search Provider"
            options={[
              { name: "GitHub", value: "github" },
              { name: "GitLab", value: "gitlab", disabled: true },
              { name: "Bitbucket", value: "bitbucket", disabled: true },
            ]}
          />
          <MultiText name="languages" label="Languages" max={5} />
          <MinMaxRange name="Stars" label="Stars" />

          <div className="flex justify-end gap-2 font-medium md:text-lg">
            <button
              type="reset"
              className="btn just-black rounded-none bg-white py-1.5"
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn just-black rounded-none bg-violet-700 py-1.5 text-white"
            >
              Search
            </button>
          </div>
        </fieldset>
      </form>

      {/* Result Card */}
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
            yellowAction={getPrevRes}
            greenAction={getNextRes}
            disabled={isPending}
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
                    Last Updated:{" "}
                    {new Date(currRepo.updated_at).toLocaleString()}
                  </p>
                </>
              );
            })()}
        </Browser.Content>
      </Browser>
    </div>
  );
}
