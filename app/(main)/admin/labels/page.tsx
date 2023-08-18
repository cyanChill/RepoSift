import { db } from "@/db";
import type { LabelWithUser } from "@/db/schema/main";

import type { PageProps } from "@/lib/types";
import { firstStrParam } from "@/lib/utils/url";
import { BaseForm, ManageLabelForm } from "../_components/forms";

export const metadata = {
  title: "RepoSift | Manage Labels",
};

export default async function AdminLabelsPage({ searchParams }: PageProps) {
  const { label: unsafeLabel } = searchParams;
  const rawLabel = firstStrParam(unsafeLabel);

  let label: LabelWithUser | undefined;
  if (rawLabel) {
    label = await db.query.labels.findFirst({
      where: (fields, { and, eq, or }) =>
        and(
          eq(fields.type, "regular"),
          or(eq(fields.name, rawLabel), eq(fields.display, rawLabel)),
        ),
      with: { user: true },
    });
  }

  return (
    <main className="mx-auto w-full max-w-appContent-1/2 p-3 py-5 md:py-20">
      <p className="md:text-lg">
        In this menu, you can search for {`"regular"`} labels and do the
        following:
      </p>
      <ul className="mb-4 ml-8 list-disc text-sm md:mb-8 md:text-base">
        <li>
          Update the label name (which will be reflected on the repositories
          that use it).
        </li>
        <li>Delete a {`"regular"`} label.</li>
      </ul>
      <hr className="my-4 h-px border-0 bg-black md:my-8" />

      <BaseForm
        variant="labels"
        fieldName="label"
        placeholder="Enter a label name to get started"
        initVal={rawLabel}
      />

      {rawLabel && !label && (
        <p className="px-2  font-medium text-error">
          Error: Label not found or {"isn't"} modifiable.
        </p>
      )}

      {label && (
        <section className="mt-8 flex flex-col gap-4 px-2">
          <ManageLabelForm key={label.name} label={label} />
        </section>
      )}
    </main>
  );
}
