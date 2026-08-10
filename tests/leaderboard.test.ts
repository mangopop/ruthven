import { describe, expect, it } from 'vitest';
import { buildLeaderboard, type Course } from '../src/lib/leaderboard';
import type { ScoreRow } from '../src/lib/scores';

const COURSE: Course = { name: 'Test Links', par: Array(18).fill(4) };

function row(name: string, gross: number, extra: Partial<ScoreRow> = {}): ScoreRow {
  return { name, strokes: Array(18).fill(gross), ...extra };
}

describe('buildLeaderboard', () => {
  it('sorts by points descending', () => {
    const board = buildLeaderboard([row('bogey', 5), row('par', 4)], COURSE);
    expect(board.map((e) => e.slug)).toEqual(['par', 'bogey']);
    expect(board[0]!.totalPoints).toBe(36);
    expect(board[1]!.totalPoints).toBe(18);
  });

  it('gives tied players a shared position and skips the next', () => {
    const board = buildLeaderboard([row('a', 4), row('b', 4), row('c', 5)], COURSE);
    expect(board.map((e) => e.position)).toEqual([1, 1, 3]);
  });

  it('prefers a pre-computed points total over the calculated one', () => {
    const board = buildLeaderboard([row('a', 4, { points: 40 })], COURSE);
    expect(board[0]!.totalPoints).toBe(40);
    expect(board[0]!.card).not.toBeNull();
  });

  it('accepts a points-only row with no course', () => {
    const board = buildLeaderboard([{ name: 'a', strokes: Array(18).fill(null), points: 33 }], null);
    expect(board[0]!.totalPoints).toBe(33);
    expect(board[0]!.card).toBeNull();
    expect(board[0]!.totalStrokes).toBeNull();
  });

  it('rejects strokes without a course', () => {
    expect(() => buildLeaderboard([row('a', 4)], null)).toThrow(/no course/);
  });

  it('rejects a row with neither strokes nor points', () => {
    expect(() => buildLeaderboard([{ name: 'a', strokes: Array(18).fill(null) }], COURSE)).toThrow(
      /neither strokes nor a points total/,
    );
  });
});
