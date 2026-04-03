import { CELL_X, CELL_Y, COLUMNS, GAP, ROWS } from "@/app/utils/constants";

export function keyLayout(index: number) {
  const column = index % COLUMNS;
  const row = Math.floor(index / COLUMNS);
  const x = (column - (COLUMNS - 1) / 2) * (CELL_X + GAP);
  const y = -((row - (ROWS - 1) / 2) * (CELL_Y + GAP));
  return [x, y] as const;
}
