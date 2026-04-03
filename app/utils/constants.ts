import { characters } from "@/app/utils/calc/characters";

export const BODY_W = 5;
export const BODY_H = 6.5;
export const BODY_D = 0.6;
export const ROTATE_SPEED = 0.008;
export const DRAG_THRESHOLD_PX = 6;
export const RETURN_SMOOTH = 3;
export const MAX_TILT = 360;

// COLORS
export const COLOR_DISPLAY = "#FAD4D4";
export const COLOR_FACE = "#F47C7C";
export const COLOR_BACK_INSET = "#D46B6B";
export const COLOR_KEY = "#EF9F9F";
export const COLOR_KEY_TEXT = "#FFF2F2";

// CHARACTERS
export const COLUMNS = 4;
export const ROWS = characters.length / COLUMNS;

export const DISPLAY_W = BODY_W * 0.88;
export const DISPLAY_H = 0.9;
export const DISPLAY_Y = 2.07;

export const KEY_THICKNESS = 0.14;
export const GAP = 0.1;

export const CELL_X = (DISPLAY_W - 0.2 - (COLUMNS - 1) * GAP) / COLUMNS;
export const CELL_Y = 0.55;

export const KEY_Y_OFFSET = DISPLAY_Y - DISPLAY_H / 2 - 1.9 - CELL_Y / 2;

export const DISPLAY_DEPTH = 0.15;
export const DISPLAY_FACE_Z = DISPLAY_DEPTH / 2 + 0.005;
export const DISPLAY_PAD = 0.06;
// Visible text width = display width minus padding on each side
export const CLIP_W = DISPLAY_W - DISPLAY_PAD * 2;
export const CLIP_H = DISPLAY_H * 0.85;

export const BACK_DETAIL_W = DISPLAY_W * 0.7;
export const BACK_DETAIL_H = DISPLAY_H * 1.1;
export const BACK_DETAIL_D = 0.5;
export const BACK_DEATIL_Z = -0.06;
export const BACK_FACE_Z = -BODY_D / 2 + 0.03; // slightly inside from rear outer surface
export const BACK_EPSILON = 0.008;
