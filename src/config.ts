/**
 * Image slots. Each is a filename under public/photos/ (e.g. 'crest.png').
 * Set to the real file when the photo exists; null renders a styled placeholder.
 */
export const images = {
  /** The goat-and-clubs family crest - hero, nav and footer mark. */
  crest: null as string | null,
  /** The Ruthven Cup Tankard - trophies section. */
  tankard: null as string | null,
  /** The Phallus Trophy - trophies section. */
  phallus: null as string | null,
  /** Photo strip of the family cloth; replaces the CSS tartan bands when set. */
  cloth: null as string | null,
};

export const motto = 'Deid schaw';
export const established = 2021;
