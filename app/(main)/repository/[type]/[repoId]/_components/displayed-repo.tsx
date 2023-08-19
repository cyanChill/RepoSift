"use client";
import { useRouter } from "next/navigation";

import type { IndexedRepo } from "@/server-actions/types";
import RepoCard from "@/components/RepoCard";

type Props = {
  repository: IndexedRepo;
};

export default function DisplayedRepo({ repository }: Props) {
  const router = useRouter();

  return <RepoCard result={repository} onClose={() => router.back()} />;
}
