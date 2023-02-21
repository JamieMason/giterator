import type { Giterator } from '../..';
import { createTask } from './create-task';
import { parseOutput } from './parse-output';

export function getNextCommits(
  directory: string,
  pageNumber: number,
  options: Giterator.Options,
): Promise<Giterator.Commit[]> {
  return new Promise((resolve) => {
    let commits: Giterator.Commit[] = [];
    const task = createTask(directory, pageNumber, options);
    task.stderr?.setEncoding('utf8');
    task.stdout?.setEncoding('utf8');
    task.on('close', () => resolve(commits));
    task.stdout?.on('data', (output: string) => {
      commits = commits.concat(parseOutput(output, options.tokenNames));
    });
  });
}
