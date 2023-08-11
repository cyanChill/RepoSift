/**
 * @description An array of the enabled & disabled providers.
 * @returns An array.
 */
export const avaliableProviders = [
  { name: "GitHub", value: "github" },
  { name: "GitLab", value: "gitlab", disabled: true },
  { name: "Bitbucket", value: "bitbucket", disabled: true },
];

/**
 * @description An array of the avaliable providers as strings instead of objects.
 * @returns An array.
 */
export const providersVal = ["github", "gitlab", "bitbucket"];

/**
 * @description An object containing the character limit of values.
 * @returns An object.
 */
export const LIMITS = {
  GITHUB_USERNAME: 39,
  GITHUB_REPONAME: 100,
  LABEL: 25,
  NAME: 50,
  HANDLE: 30,
};

/**
 * @description An object containing the patterns/regex for values.
 * @returns An object.
 */
export const PATTERNS = {
  GITHUB_USERNAME: `[A-Za-z0-9\\-]{1,${LIMITS.GITHUB_USERNAME}}`,
  GITHUB_REPONAME: `[\\w.\\-]{1,${LIMITS.GITHUB_REPONAME}}`,
  LABEL: `[A-Za-z.\\-\\s]{3,${LIMITS.LABEL}}`,
  NAME: `.{3,${LIMITS.NAME}}`,
  HANDLE: `\\w{4,${LIMITS.HANDLE}}`,
};
