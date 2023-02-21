import { getConfig } from './lib/get-config';
import { getNextCommits } from './lib/get-next-commits';
import type { tokensByName } from './lib/tokens-by-name';

export namespace Giterator {
  /**
   * A property name of './src/lib/tokens-by-name'
   */
  export type TokenName = keyof typeof tokensByName;

  /**
   * Data returned from Git for each Commit, the keys are the `tokenNames` you
   * provided.
   */
  export type Commit = Partial<Record<TokenName, string>>;

  export interface Options {
    /**
     * Optional array of strings reducing the data required from each git
     * commit. This will improve performance vs the default of fetching all.
     */
    tokenNames: TokenName[];
    /**
     * How many commits at a time to fetch from `git log`, tune this for
     * performance. The generator will always yield one commit at a time,
     * regardless of the page size being used in the background.
     *
     * @default 20
     */
    pageSize: number;
    /**
     * Whether to exclude merge commits from being returned.
     *
     * @default true
     */
    skipMerges: boolean;
  }
}

export async function* giterator(
  directory: string,
  options: Partial<Giterator.Options>,
) {
  let pageNumber = 1;
  const config = getConfig(options);
  let commits = await getNextCommits(directory, pageNumber, config);

  while (commits.length > 0) {
    for (const commit of commits) yield commit;
    pageNumber++;
    commits = await getNextCommits(directory, pageNumber, config);
  }
}
