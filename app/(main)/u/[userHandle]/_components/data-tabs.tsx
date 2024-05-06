"use client";
import Link from "next/link";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { VscLinkExternal } from "react-icons/vsc";

import type { SelectLabel, SelectBaseRepository } from "@/db/schema/main";
import { cn } from "@/lib/utils";
import { getProviderIcon } from "@/app/(main)/_components/utils";

type Props = {
  labels: Omit<SelectLabel, "type" | "userId">[];
  repositories: Omit<
    SelectBaseRepository,
    "stars" | "maintainLink" | "_primaryLabel" | "userId" | "lastUpdated"
  >[];
};

export default function DataTabs({ labels, repositories }: Props) {
  return (
    <TabGroup as="section" className="w-full min-w-0 justify-self-start">
      <TabList className="card mb-2 flex w-min gap-1 rounded-md p-1 py-0.5 font-medium">
        {["Repositories", "Labels"].map((tab) => (
          <Tab
            key={tab}
            className={({ selected }) =>
              cn("rounded-md border-black px-2 py-0.5 transition", {
                "border bg-yellow-400": selected,
              })
            }
          >
            {tab}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="card w-full p-0">
        {/* Repositories Tab Panel */}
        <TabPanel>
          {repositories.length === 0 && (
            <p className="p-2 font-medium">
              No repositories have been indexed.
            </p>
          )}
          {repositories.map((repo) => (
            <Link
              key={repo._pk}
              href={`/repository/${repo.type}/${repo.id}`}
              className="flex items-center gap-1 border-b-3 border-black p-2 transition last:border-b-0 hover:bg-gray-100"
            >
              <div className="w-full min-w-0">
                <p className="flex items-center gap-1 font-medium md:text-lg">
                  {getProviderIcon(repo.type)}{" "}
                  <span className="truncate">
                    {repo.author}/{repo.name}
                  </span>
                </p>
                <p className="line-clamp-3 text-sm md:text-base">
                  {repo.description ?? "No description."}
                </p>
              </div>

              <VscLinkExternal className="h-6 w-6" />
            </Link>
          ))}
        </TabPanel>
        {/* Labels Tab Panel */}
        <TabPanel className="p-2 text-sm font-medium">
          {labels.length === 0 && (
            <p className="text-base">No labels have been suggested.</p>
          )}
          <div className="flex flex-wrap border-l-2 border-black">
            {labels.map((lb) => (
              <p
                key={lb.name}
                className="card flex w-fit items-center gap-2 border-2 border-l-0 bg-purple-300 px-1 py-0.5"
              >
                {lb.display}
              </p>
            ))}
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
