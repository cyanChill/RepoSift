export type PageProps = {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export type GenericObj = Record<string, unknown>;
export type VariableObj<T> = Record<string, T>;

/**
 * @description The typical function response when recieving an error.
 */
export type ErrorObj = { error: string | string[] };
/**
 * @description The typical function reponse when recieving no errors.
 */
export type SuccessObj<T> = { error?: undefined; data: T };
