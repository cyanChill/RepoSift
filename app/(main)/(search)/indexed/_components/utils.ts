/**
 * @description Interface containing all the avaliable filters.
 */
export interface FilterParams {
  providers?: string[];
  languages?: string[];
  primary_label?: string;
  labels?: string[];
  minStars?: string;
  maxStars?: string;
  page?: string;
  per_page?: string;
}
