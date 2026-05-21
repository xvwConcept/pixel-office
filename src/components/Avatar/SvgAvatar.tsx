// SVG pixel-art avatars — 16×16 logical grid, rendered crisp at any size.
// Ported from the OfficeView design handoff (sprites.jsx + tokens.js).

import type { AvailabilityStatus } from '@/lib/types';

// ---- pixel helper ---------------------------------------------------
const px = (
  x: number, y: number, fill: string, key: string,
  w = 1, h = 1, opacity = 1,
) => (
  <rect key={key} x={x} y={y} width={w} height={h}
        fill={fill} opacity={opacity} shapeRendering="crispEdges" />
);

// ---- avatar presets (4 neutral people) ------------------------------
export interface PersonDef {
  shirt: string;
  hair:  string;
  skin:  string;
  style: HairStyle;
  acc:   Accessory;
}

type HairStyle = 'short' | 'long' | 'bun' | 'ponytail' | 'curly' | 'buzz' | 'bald' | 'cap';
type Accessory  = 'none' | 'glasses' | 'headphones' | 'earring';

export const AVATAR_PRESETS: PersonDef[] = [
  { shirt: '#4a7cd8', hair: '#1a1410', skin: '#d4a37a', style: 'short',    acc: 'none'    },
  { shirt: '#4ab87a', hair: '#a8633a', skin: '#f0d4ad', style: 'long',     acc: 'none'    },
  { shirt: '#d8a44a', hair: '#2a1a14', skin: '#b8845e', style: 'buzz',     acc: 'glasses' },
  { shirt: '#4ad8c4', hair: '#3a2a1f', skin: '#e8c39a', style: 'curly',    acc: 'none'    },
];

// ---- status color map -----------------------------------------------
const STATUS_COLOR: Partial<Record<AvailabilityStatus, string>> = {
  available: '#5cbf60',
  break:     '#e8a44c',
  call:      '#d84a4a',
  meeting:   '#d84a4a',
  vacation:  '#8a8590',
  absent:    '#8a8590',
};

// ---- sub-layers -----------------------------------------------------
function HairLayer({ style, hair }: { style: HairStyle; hair: string }) {
  switch (style) {
    case 'short': return (<>
      {px(4, 2, hair, 'ht', 8, 1)} {px(4, 1, hair, 'hu', 8, 1)}
      {px(5, 0, hair, 'hc', 6, 1)} {px(4, 3, hair, 'hl', 1, 1)}
      {px(11,3, hair, 'hr', 1, 1)}
    </>);
    case 'long': return (<>
      {px(4, 2, hair, 'ht', 8, 1)} {px(4, 1, hair, 'hu', 8, 1)}
      {px(5, 0, hair, 'hc', 6, 1)} {px(3, 3, hair, 'sl', 1, 5)}
      {px(12,3, hair, 'sr', 1, 5)} {px(4, 6, hair, 'sb1', 1, 1)}
      {px(11,6, hair, 'sb2', 1, 1)}
    </>);
    case 'bun': return (<>
      {px(4, 2, hair, 'ht', 8, 1)} {px(4, 1, hair, 'hu', 8, 1)}
      {px(5, 0, hair, 'hc', 6, 1)} {px(7, -1, hair, 'bu', 2, 1)}
      {px(6, 0, hair, 'bd', 4, 1)} {px(4, 3, hair, 'hl', 1, 1)}
      {px(11,3, hair, 'hr', 1, 1)}
    </>);
    case 'ponytail': return (<>
      {px(4, 2, hair, 'ht', 8, 1)} {px(4, 1, hair, 'hu', 8, 1)}
      {px(5, 0, hair, 'hc', 6, 1)} {px(12,3, hair, 'pt1', 2, 1)}
      {px(13,4, hair, 'pt2', 2, 2)} {px(4, 3, hair, 'hl', 1, 1)}
    </>);
    case 'curly': return (<>
      {px(4, 2, hair, 'ht', 8, 1)} {px(3, 1, hair, 'h1', 1, 2)}
      {px(5, 0, hair, 'h2', 2, 1)} {px(8, 0, hair, 'h3', 2, 1)}
      {px(12,1, hair, 'h4', 1, 2)} {px(11,0, hair, 'h5', 1, 1)}
      {px(4, 0, hair, 'h6', 1, 1)} {px(3, 3, hair, 'hl', 1, 1)}
      {px(12,3, hair, 'hr', 1, 1)}
    </>);
    case 'buzz': return (<>
      {px(5, 2, hair, 'ht', 6, 1)} {px(5, 1, hair, 'hu', 6, 1, 0.6)}
    </>);
    case 'bald': return (<>
      {px(5, 2, hair, 'hl', 6, 1, 0.4)}
    </>);
    case 'cap': return (<>
      {px(4, 1, '#2a2530', 'cap1', 8, 2)} {px(5, 0, '#2a2530', 'cap2', 6, 1)}
      {px(3, 2, '#2a2530', 'brim', 10, 1)} {px(7, 1, hair, 'lg', 1, 1, 0.8)}
    </>);
    default: return null;
  }
}

function AccessoryLayer({ acc }: { acc: Accessory }) {
  if (acc === 'glasses') return (<>
    {px(5, 4, '#1a1410', 'gl', 1, 1)} {px(10,4, '#1a1410', 'gr', 1, 1)}
    {px(6, 4, '#1a1410', 'gb', 4, 1, 0.55)}
  </>);
  if (acc === 'headphones') return (<>
    {px(4, 0, '#1a1410', 'hb1', 8, 1)} {px(5,-1, '#1a1410', 'hb2', 6, 1)}
    {px(3, 3, '#1a1410', 'el', 1, 2)}  {px(12,3, '#1a1410', 'er', 1, 2)}
  </>);
  if (acc === 'earring') return (<>
    {px(4, 5, '#e8c44c', 'ee', 1, 1)}
  </>);
  return null;
}

// ---- main avatar ----------------------------------------------------
interface AvatarSpriteProps {
  person: PersonDef;
  status?: AvailabilityStatus | null;
  size?: number;
}

export function AvatarSprite({ person, status, size = 48 }: AvatarSpriteProps) {
  const { shirt, hair, skin, style, acc } = person;
  const isAbsent   = status === 'absent';
  const statusColor = status ? (STATUS_COLOR[status] ?? null) : null;

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated', display: 'block', overflow: 'visible' }}
    >
      <g opacity={isAbsent ? 0.45 : 1}>
        {/* face */}
        {px(5, 3, skin, 'hd', 6, 3)}
        {px(4, 4, skin, 'el', 1, 1)}
        {px(11,4, skin, 'er', 1, 1)}
        {px(5, 5, '#00000022', 'fs', 6, 1)}

        <HairLayer style={style} hair={hair} />
        <AccessoryLayer acc={acc} />

        {/* neck */}
        {px(7, 6, skin, 'nk', 2, 1)}

        {/* shirt */}
        {px(3, 7,  shirt,       'sh', 10, 5)}
        {px(3, 7,  '#00000033', 'ss', 10, 1)}
        {px(3, 11, '#00000033', 'sb', 10, 1)}
        {/* arms */}
        {px(3, 8,  skin, 'al', 1, 2)}
        {px(12, 8, skin, 'ar', 1, 2)}

        {/* status badge (top-right corner) */}
        {statusColor && (
          <g>
            {px(12, 0, '#14121a',   'sbg',  4, 4)}
            {px(13, 0, '#14121a',   'sb1',  1, 1)}
            {px(15, 0, '#14121a',   'sb2',  1, 1)}
            {px(12, 1, statusColor, 'sd',   4, 2)}
            {px(13, 0, statusColor, 'sd2',  2, 4)}
            {px(13, 1, '#ffffff',   'shl',  1, 1, 0.9)}
          </g>
        )}
      </g>
    </svg>
  );
}
