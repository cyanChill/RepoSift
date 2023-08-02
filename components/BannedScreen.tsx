import Browser from "./Browser";

export default function BannedScreen({
  reason = "No reason provided.",
}: {
  reason?: string;
}) {
  return (
    <Browser className="h-full max-h-72 min-h-[15rem] w-full max-w-2xl bg-white">
      <Browser.Header className="bg-red-300 px-4">
        <Browser.TrafficLights size={16} withAction={false} />
        <Browser.SearchBar className="flex h-8 items-center text-base">
          {}
        </Browser.SearchBar>
      </Browser.Header>
      <Browser.Content className="p-2 md:p-4">
        <p className="mb-8 text-lg font-medium md:text-2xl">
          You have been banned from RepoSift and do not have access to this
          feature.
        </p>
        <p className="text-sm">
          <span className="font-medium">[Reason]</span> {reason}
        </p>
      </Browser.Content>
    </Browser>
  );
}
