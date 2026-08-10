import { computeCard, type HoleScore } from './stableford';
import type { ScoreRow } from './scores';

export interface Course {
  name: string;
  par: number[];
  strokeIndex?: number[];
}

export interface LeaderboardEntry {
  slug: string;
  /** 1-based position; tied players share one. */
  position: number;
  totalPoints: number;
  totalStrokes: number | null;
  front9Points: number | null;
  back9Points: number | null;
  /** Per-hole detail, null when the row only carried a points total. */
  card: HoleScore[] | null;
}

export function buildLeaderboard(rows: ScoreRow[], course: Course | null): LeaderboardEntry[] {
  const entries = rows.map((row): Omit<LeaderboardEntry, 'position'> => {
    const hasStrokes = row.strokes.some((s) => s !== null);
    if (hasStrokes && course) {
      const card = computeCard(row.strokes, course.par, {
        handicap: row.handicap,
        strokeIndex: course.strokeIndex,
      });
      return {
        slug: row.name,
        totalPoints: row.points ?? card.totalPoints,
        totalStrokes: card.totalStrokes,
        front9Points: card.front9Points,
        back9Points: card.back9Points,
        card: card.holes,
      };
    }
    if (row.points === undefined) {
      throw new Error(
        `Score row for "${row.name}" has ${hasStrokes ? 'strokes but no course to score them against' : 'neither strokes nor a points total'}`,
      );
    }
    return {
      slug: row.name,
      totalPoints: row.points,
      totalStrokes: null,
      front9Points: null,
      back9Points: null,
      card: null,
    };
  });

  entries.sort((a, b) => b.totalPoints - a.totalPoints);
  let lastPoints = NaN;
  let lastPosition = 0;
  return entries.map((entry, i) => {
    const position = entry.totalPoints === lastPoints ? lastPosition : i + 1;
    lastPoints = entry.totalPoints;
    lastPosition = position;
    return { ...entry, position };
  });
}
