import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { db } from "@/db";
import type { LabelWithUser } from "@/db/schema/main";
import { authOptions } from "@/lib/auth";

import type { PageProps } from "@/lib/types";
import { firstStrParam } from "@/lib/utils/url";
import { BaseForm, ManageLabelForm } from "../_components/forms";

export const metadata = {
  title: "RepoSift | Manage Labels",
};

export default async function AdminLabelsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "owner"].includes(session.user.role)) {
    redirect("/");
  }

  const { label: unsafeLabel } = searchParams;
  const rawLabel = firstStrParam(unsafeLabel);

  let label: LabelWithUser | undefined;
  if (rawLabel) {
    label = await db.query.labels.findFirst({
      where: (fields, { and, eq, or, sql }) =>
        and(
          eq(fields.type, "regular"),
          or(
            eq(fields.name, rawLabel.toLowerCase()),
            sql`lower(${fields.display}) = ${rawLabel.toLowerCase()}`,
          ),
        ),
      with: { user: true },
    });
  }

  return (
    <main className="mx-auto w-full max-w-appContent-1/2 p-3 py-5 md:py-20">
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
