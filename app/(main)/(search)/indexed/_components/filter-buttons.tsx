"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Transition } from "@headlessui/react";
import { FaCogs } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { formDataToObj } from "@/lib/utils/mutate";
import { searchParamsToObj, toURLQS } from "@/lib/utils/url";

import type { Option } from "@/components/form/utils";
import SearchForm from "./search-form";

type Props = {
  labels: { primary: Option[]; regular: Option[] };
  languages: Option[];
};

export default function FilterButtons({ labels, languages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [modalActive, setModalActive] = useState(false);
  const [isPending, startTransition] = useTransition();

  /*
    TODO: Eventually add the "Sort" button
      - It'll be made with our <Select /> element
  */

  function updateFilters(formData: FormData) {
    const cleanedData = formDataToObj(formData) as { [x: string]: string };
    // Now we need to update our URL with this new search params
    // updateURL("indexed", toURLQS(cleanedData));
    router.push(`/indexed?${toURLQS(cleanedData)}`);
    setModalActive(false);
  }

  const searchParamsObj = searchParamsToObj(searchParams);

  return (
    <>
      <section className="text-lg">
        <button
          onClick={() => setModalActive(true)}
          className="btn just-black flex items-center gap-2 bg-white py-0"
        >
          <FaCogs /> Filters
        </button>
      </section>

      {/* Filter Menu Modal */}
      <Transition
        as="section"
        show={modalActive}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 -translate-x-1/4"
        enterTo="transform opacity-100 translate-x-0"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 translate-x-0"
        leaveTo="transform opacity-0 -translate-x-1/4"
        className="fixed left-0 top-0 z-modal h-screen w-full overflow-y-auto border-r-3 border-black bg-white p-4 md:max-w-xl"
      >
        <header className="mb-8 flex items-center gap-4 text-2xl font-medium md:text-4xl">
          <FaCogs />
          <h2>Filters</h2>
          <button
            onClick={() => setModalActive(false)}
            className="ml-auto transition duration-300 hover:text-black/75"
          >
            <FaXmark />
          </button>
        </header>

        <SearchForm
          labels={labels}
          languages={languages}
          values={searchParamsObj}
          action={(data) => startTransition(() => updateFilters(data))}
          disabled={isPending}
        />
      </Transition>

      {/* Backdrop Blur */}
      <Transition
        as="div"
        show={modalActive}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
        className="fixed left-0 top-0 z-[125] h-screen w-screen bg-black/50 backdrop-blur-sm"
        onClick={() => setModalActive(false)}
      />
    </>
  );
}
