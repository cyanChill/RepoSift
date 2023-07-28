import Link from "next/link";
import Image from "next/image";

import Browser from "@/components/Browser";

type Props = {
  variant: "repository" | "label";
};

export default function SuccessWindow({ variant }: Props) {
  return (
    <Browser className="w-full max-w-3xl bg-white">
      <Browser.Header className="bg-gray-200 px-4">
        <Browser.TrafficLights withAction={false} />
        <Browser.SearchBar className="border-0">
          <Image src="/assets/icons/logo.svg" alt="" height={25} width={25} />
        </Browser.SearchBar>
      </Browser.Header>
      <Browser.Content className="p-4 md:p-16 md:px-12">
        <h2 className="text-center text-lg font-medium md:text-3xl">
          Congratulations, you successfully contributed a {variant} to RepoSift.
        </h2>
        <p className="mt-4 text-center md:mt-8 md:text-xl">
          This contribution will be added to your profile.
        </p>

        <Link
          href="/contribute"
          className="btn just-black mt-8 self-center rounded-none bg-yellow-400 px-6 py-2 text-center font-medium md:px-12 md:text-lg"
        >
          Contribute More
        </Link>
      </Browser.Content>
    </Browser>
  );
}
