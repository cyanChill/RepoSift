import { z } from "zod";

export const PROVIDERS_ENUM = z.enum(["github", "gitlab", "bitbucket"]);
export type AuthProviders = z.infer<typeof PROVIDERS_ENUM>;

export const OPT_NONNEG_INT = z.coerce
  .number()
  .int()
  .min(0, { message: "⚠️ Must be a non-negative integer." })
  .optional();

/**
 * @description Gives a Zod transform() function to turn a JSON.stringify() array to an array.
 * @param label Zod field name.
 * @param maxNum Max number of items in array.
 */
export const arrayTransform = (label: string, maxNum: number) => {
  return (val: string, ctx: z.RefinementCtx) => {
    if (!val) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) throw Error();
    } catch {
      ctx.addIssue({
        code: "invalid_type",
        path: [label.toLowerCase()],
        expected: "array",
        received: "string",
        message: `${label} is not an array.`,
      });
      return z.NEVER;
    }

    const safeArr = parsed.map((arrVal) =>
      encodeURIComponent(String(arrVal).trim())
    );
    if (safeArr.length > maxNum) {
      ctx.addIssue({
        code: "too_big",
        path: [label.toLowerCase()],
        maximum: maxNum,
        type: "array",
        inclusive: true,
        exact: false,
        message: `There can be at most ${maxNum} ${label.toLowerCase()}.`,
      });
      return z.NEVER;
    }

    return safeArr;
  };
};

type regexTestProps = {
  regexBase: string;
  label: string;
  errorMsg: string;
};

/**
 * @description Gives a Zod transform() function to turn test a string against a regex.
 * @param param0.regexBase The string form of a Regex.
 * @param param0.label Zod field name.
 * @param param0.errorMsg Error message if Regex fails to be matched.
 */
export const regexTest = ({ regexBase, label, errorMsg }: regexTestProps) => {
  return (val: string, ctx: z.RefinementCtx) => {
    const match = val.match(new RegExp(regexBase));
    // Either match is null or 1st entry isn't whole string
    if (!match || match[0] !== val) {
      ctx.addIssue({ code: "custom", path: [label], message: errorMsg });
      return z.NEVER;
    }
    return val;
  };
};
