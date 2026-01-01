import { describe, expect, it } from 'vitest';
import type { Giterator } from './index.js';
import { giterator } from './index.js';

describe('Giterator', () => {
  describe('basic iteration', () => {
    it('yields commits as an async generator', async () => {
      const commits = [];
      for await (const commit of giterator('.', {
        tokenNames: ['commitHash'],
      })) {
        commits.push(commit);
        if (commits.length >= 2) break;
      }

      expect(commits).toEqual([
        { commitHash: expect.any(String) },
        { commitHash: expect.any(String) },
      ]);
    });

    it('respects tokenNames selection', async () => {
      const commits = [];
      for await (const commit of giterator('.', {
        tokenNames: ['commitHash', 'subject'],
      })) {
        commits.push(commit);
        if (commits.length >= 1) break;
      }

      expect(commits).toEqual([
        { commitHash: expect.any(String), subject: expect.any(String) },
      ]);
    });

    it('fetches all token names when none specified', async () => {
      const commits = [];
      for await (const commit of giterator('.', {})) {
        commits.push(commit);
        if (commits.length >= 1) break;
      }

      expect(commits).toEqual([
        {
          authorDate: expect.any(String),
          authorDateRelative: expect.any(String),
          authorEmail: expect.any(String),
          authorName: expect.any(String),
          body: expect.any(String),
          commitHash: expect.any(String),
          commitNotes: expect.any(String),
          committerDate: expect.any(String),
          committerDateRelative: expect.any(String),
          committerEmail: expect.any(String),
          committerName: expect.any(String),
          parentHashes: expect.any(String),
          reflogIdentityEmail: expect.any(String),
          reflogIdentityName: expect.any(String),
          reflogSelector: expect.any(String),
          reflogSubject: expect.any(String),
          refNames: expect.any(String),
          sanitizedSubjectLine: expect.any(String),
          subject: expect.any(String),
          treeHash: expect.any(String),
        },
      ]);
    });
  });

  describe('pagination', () => {
    it('respects pageSize parameter', async () => {
      const commits = [];

      for await (const commit of giterator('.', {
        tokenNames: ['commitHash'],
        pageSize: 2,
      })) {
        commits.push(commit);
      }

      expect(commits.length).toBeGreaterThan(0);
      commits.forEach((commit) => {
        expect(commit).toEqual({ commitHash: expect.any(String) });
      });
    });

    it('handles pageSize of 1', async () => {
      const commits = [];
      for await (const commit of giterator('.', {
        tokenNames: ['commitHash'],
        pageSize: 1,
      })) {
        commits.push(commit);
        if (commits.length >= 3) break;
      }

      expect(commits).toEqual([
        { commitHash: expect.any(String) },
        { commitHash: expect.any(String) },
        { commitHash: expect.any(String) },
      ]);
    });
  });

  describe('skipMerges option', () => {
    it('excludes merge commits when skipMerges is true', async () => {
      const withMerges = [];
      const withoutMerges = [];

      for await (const commit of giterator('.', {
        tokenNames: ['parentHashes'],
        skipMerges: false,
      })) {
        withMerges.push(commit);
      }

      for await (const commit of giterator('.', {
        tokenNames: ['parentHashes'],
        skipMerges: true,
      })) {
        withoutMerges.push(commit);
      }

      expect(withoutMerges.length).toBeLessThanOrEqual(withMerges.length);
    });
  });

  describe('known commits', () => {
    it('retrieves the oldest commit in history', async () => {
      const oldestHash = '66e2cec474b4a2942df3d32d15a3de383e4bedb6';
      const commits = [];

      for await (const commit of giterator('.', {
        tokenNames: ['commitHash', 'subject', 'authorName', 'authorEmail'],
      })) {
        commits.push(commit);
      }

      expect(commits).toHaveProperty(String(commits.length - 1), {
        commitHash: oldestHash,
        subject: 'feat(git-log): read git log through a generator',
        authorName: 'Jamie Mason',
        authorEmail: 'jamie@foldleft.io',
      });
    });

    it('retrieves commits with valid data types and formats', async () => {
      const commits = [];
      for await (const commit of giterator('.', {
        tokenNames: ['commitHash', 'authorDate', 'subject'],
      })) {
        commits.push(commit);
        if (commits.length >= 1) break;
      }

      expect(commits).toEqual([
        {
          commitHash: expect.stringMatching(/^[0-9a-f]{40}$/),
          subject: expect.any(String),
          authorDate: expect.any(String),
        },
      ]);

      const dateStr = commits[0].authorDate;
      if (dateStr) {
        expect(() => new Date(dateStr)).not.toThrow();
      }
    });
  });

  describe('dependency injection', () => {
    it('uses custom spawn function when provided', async () => {
      let spawnWasCalled = false;
      const customSpawn: Giterator.Options['spawn'] = () => {
        spawnWasCalled = true;
        const EventEmitter = require('node:events');
        const emitter = new EventEmitter.EventEmitter();
        setTimeout(() => emitter.emit('close'), 0);
        emitter.stdout = null;
        emitter.stderr = null;
        return emitter;
      };

      for await (const _commit of giterator('.', {
        tokenNames: ['commitHash'],
        spawn: customSpawn,
      })) {
        break;
      }

      expect(spawnWasCalled).toBe(true);
    });
  });
});
