import { z } from "zod";

import { LIMITS, PATTERNS } from "@/lib/utils/constants";
import { isNum } from "@/lib/utils/validation";
import {
  PROVIDERS_ENUM,
  OPT_NONNEG_INT,
  arrayTransform,
  regexTest,
} from "@/lib/zod/utils";

/** @description Schema for "Simple Search" feature. */
export const sSFilters = z
  .object({
    provider: PROVIDERS_ENUM,
    languages: z.coerce
      .string()
      .transform(arrayTransform("Languages", 5))
      .optional(),
    minStars: OPT_NONNEG_INT,
    maxStars: OPT_NONNEG_INT,
    limit: z.number().int().min(15).max(100).optional(),
  })
  .refine(
    ({ minStars, maxStars }) => {
      if (isNum(minStars) && isNum(maxStars)) return maxStars > minStars;
      return true;
    },
    { message: "Max stars must be greater than min stars." },
  );

/** @description Schema for "Indexed Search" feature. */
export const iSFilters = z
  .object({
    providers: z
      .enum(["github", "gitlab", "bitbucket"], {
        invalid_type_error:
          'The provider must be "github", "gitlab", or "bitbucket".',
      })
      .array()
      .max(3, { message: "There can be at most 3 providers selected." })
      .optional(),
    languages: z
      .string()
      .trim()
      .min(1, { message: "Languages must be at least 1 character long." })
      .array()
      .max(5, { message: "There can be at most 5 languages selected." })
      .optional(),
    primary_label: z
      .string()
      .trim()
      .min(1, { message: "Primary label must be at least 1 character long." })
      .optional(),
    labels: z
      .string()
      .trim()
      .min(1, { message: "Labels must be at least 1 character long." })
      .array()
      .max(5, { message: "There can be at most 5 labels selected." })
      .optional(),
    minStars: OPT_NONNEG_INT,
    maxStars: OPT_NONNEG_INT,
    page: OPT_NONNEG_INT,
    per_page: OPT_NONNEG_INT,
  })
  .refine(
    ({ minStars, maxStars }) => {
      if (isNum(minStars) && isNum(maxStars)) return maxStars > minStars;
      return true;
    },
    { message: "Max stars must be greater than min stars." },
  );

/** @description Schema for "Contribute Repository" feature. */
export const contributedRepo = z.object({
  provider: PROVIDERS_ENUM,
  author: z
    .string({
      required_error: "A repository author is required.",
      invalid_type_error: "A repository author must be a string.",
    })
    .trim()
    .min(1, {
      message: "A repository author must be at least 1 characters long.",
    })
    .max(LIMITS.GITHUB_USERNAME, {
      message: `A repository author must be at most ${LIMITS.GITHUB_USERNAME} characters long.`,
    })
    .transform(
      regexTest({
        regexBase: PATTERNS.GITHUB_USERNAME,
        label: "author",
        errorMsg:
          "A repository author can contain only alphanumeric characters and hyphens.",
      }),
    ),
  name: z
    .string({
      required_error: "A repository name is required.",
      invalid_type_error: "A repository name must be a string.",
    })
    .trim()
    .min(1, {
      message: "A repository name must be at least 1 characters long.",
    })
    .max(LIMITS.GITHUB_REPONAME, {
      message: `A repository name must be at most ${LIMITS.GITHUB_REPONAME} characters long.`,
    })
    .transform(
      regexTest({
        regexBase: PATTERNS.GITHUB_REPONAME,
        label: "name",
        errorMsg:
          "A repository name can contain only alphanumeric characters, periods, underscores, and hyphens.",
      }),
    ),
  primary_label: z
    .string({
      required_error: "A primary label is required.",
      invalid_type_error: "A primary label must be a string.",
    })
    .trim()
    .min(1, { message: "A primary label must be selected." }),
  labels: z.coerce.string().transform(arrayTransform("Labels", 5)).optional(),
});
export type ContributedRepo = z.infer<typeof contributedRepo>;

/** @description Schema for "Contribute Label" & "Admin Update Label" feature. */
export const contributeLabel = z
  .string({
    required_error: "A label is required.",
    invalid_type_error: "A label must be a string.",
  })
  .trim()
  .min(3, { message: "A label must be at least 3 characters long." })
  .max(LIMITS.LABEL, {
    message: `A label must be at most ${LIMITS.LABEL} characters long.`,
  })
  .transform(
    regexTest({
      regexBase: PATTERNS.LABEL,
      label: "label",
      errorMsg:
        "A label must contain only letters, periods, hyphens, and spaces.",
    }),
  );

/** @description Schema for "Update User Name" feature. */
export const newName = z
  .string({
    required_error: "A name is required.",
    invalid_type_error: "A name must be a string.",
  })
  .trim()
  .min(3, { message: "A name must be at least 3 characters long." })
  .max(LIMITS.NAME, {
    message: `A name must be at most ${LIMITS.NAME} characters long.`,
  });

/** @description Schema for "Update User Handle" feature. */
export const newHandle = z
  .string({
    required_error: "A handle is required.",
    invalid_type_error: "A handle must be a string.",
  })
  .trim()
  .min(4, { message: "A handle must be at least 4 characters long." })
  .max(LIMITS.HANDLE, {
    message: `A handle must be at most ${LIMITS.HANDLE} characters long.`,
  })
  .transform(
    regexTest({
      regexBase: PATTERNS.HANDLE,
      label: "handle",
      errorMsg:
        "A handle can contain only alphanumeric characters, numbers, and underscores.",
    }),
  );

/** @description Schema for "Profile Image Source" feature. */
export const newImgSrc = PROVIDERS_ENUM;

/** @description Schema for "Report" feature. */
export const newReport = z.object({
  title: z
    .string({
      required_error: "A title is required.",
      invalid_type_error: "A title must be a string.",
    })
    .trim()
    .min(1, { message: "A title must be non-empty." })
    .max(100, { message: "A title can be at most 100 characters long." }),
  description: z
    .string({
      required_error: "A description is required.",
      invalid_type_error: "A description must be a string.",
    })
    .trim()
    .min(1, { message: "A description must be non-empty." })
    .max(1000, {
      message: "A description can be at most 1000 characters long.",
    }),
});

/** @description Schema for "Admin Repository Management" feature. */
export const updatedRepoInfo = z.object({
  primary_label: z
    .string({
      required_error: "A primary label is required.",
      invalid_type_error: "A primary label must be a string.",
    })
    .trim()
    .min(1, { message: "A primary label must be selected." }),
  labels: z.coerce.string().transform(arrayTransform("Labels", 5)).optional(),
  maintainLink: z.string().trim().min(1).optional(),
});
