import { useId } from "react";

/**
 * Bright's sunburst, drawn as plain shapes in `currentColor` so a struck medal
 * can carry it in one metal.
 *
 * Proportions measured off the brand mark: seven square-ended rays of equal
 * length at 30° steps — the outer two lie flat along the base — radiating from
 * a point half a ray-width above the base line, with a half-circle cut out of
 * the base where they meet. Everything is clipped at the base line.
 *
 * Box: 70 wide, 38 tall. Ray width 6, ray length 35, cut-out radius 7.8.
 */
export const BRIGHT_MARK_BOX = { x: 0, y: 0, width: 70 };

const W = 6;
const L = 35;
const BASE = 38;
const CX = 35;
const CY = BASE - W / 2;
const HOLE = 1.3 * W;

export function BrightMarkShapes() {
  // A mask per instance: the medal strikes this twice, and a page holds three medals.
  const mask = `bright-mark-${useId().replace(/:/g, "")}`;
  return (
    <g>
      <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="78" height={BASE + 4}>
        <rect x="-4" y="-4" width="78" height={BASE + 4} fill="white" />
        <circle cx={CX} cy={BASE} r={HOLE} fill="black" />
      </mask>
      <g mask={`url(#${mask})`} stroke="currentColor" strokeWidth={W} strokeLinecap="butt" fill="none">
        {[0, 30, 60, 90, 120, 150, 180].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return <line key={deg} x1={CX} y1={CY} x2={CX + Math.cos(a) * L} y2={CY - Math.sin(a) * L} />;
        })}
      </g>
    </g>
  );
}
