import type { ChildProcessWithoutNullStreams } from 'child_process';
import { spawn } from 'child_process';
import type { Giterator } from '../..';
import { tokensByName } from '../tokens-by-name';

export function createTask(
  directory: string,
  pageNumber: number,
  { tokenNames, pageSize, skipMerges }: Giterator.Options,
): ChildProcessWithoutNullStreams {
  const skipAmount = pageNumber <= 1 ? 0 : pageSize * (pageNumber - 1);
  const nodes = tokenNames.map(
    (tokenName) => `<${tokenName}>${tokensByName[tokenName]}</${tokenName}>`,
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
