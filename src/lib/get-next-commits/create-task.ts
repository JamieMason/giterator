import type { ChildProcessWithoutNullStreams } from 'node:child_process';
import type { Giterator } from '../../index.js';
import { tokensByName } from '../tokens-by-name.js';

export function createTask(
  directory: string,
  pageNumber: number,
  { tokenNames, pageSize, skipMerges, spawn }: Giterator.InternalOptions,
): ChildProcessWithoutNullStreams {
  const skipAmount = pageNumber <= 1 ? 0 : pageSize * (pageNumber - 1);
  const nodes = tokenNames.map(
    (tokenName: Giterator.TokenName) =>
      `<${tokenName}>${tokensByName[tokenName]}</${tokenName}>`,
  );
  return spawn(
    'git',
    [
      'log',
      `--pretty=format:<commit>${nodes.join('')}</commit>`,
      '--author-date-order',
      ...(skipMerges === true ? ['--no-merges'] : []),
      ...(pageSize > 0 ? ['--max-count', `${pageSize}`] : []),
      ...(pageNumber > 1 ? ['--skip', `${skipAmount}`] : []),
      '--',
      directory,
    ],
    { cwd: directory },
  );
}
