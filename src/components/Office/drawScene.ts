import * as PIXI from 'pixi.js';
import { ZONES } from '@/lib/zones.config';

// One "art pixel" = P × P canvas pixels
const P = 4;

// ─── Colour palette (matches reference: dark navy furniture, red chairs, blue-grey floors) ───
const C = {
  // Canvas background
  BG: 0x0d1020,
  // Floors
  FLOOR: 0x9ab8c4,
  FLOOR_ALT: 0x88a4b0,
  FLOOR_SHADOW: 0x7090a0,
  // Walls
  WALL: 0x1e2444,
  WALL_TOP: 0x141830,
  WALL_ACCENT: 0x2a3060,
  // Desks
  DESK_TOP: 0x4a5275,
  DESK_SIDE: 0x363a58,
  DESK_FRONT: 0x3a3e5a,
  DESK_LEG: 0x2e3250,
  // Monitors
  MON_BODY: 0x222232,
  MON_SCREEN: 0x08101e,
  MON_GLOW: 0x2058a8,
  MON_BRIGHT: 0x48a0e8,
  MON_LINE2: 0x306888,
  MON_STAND: 0x1a1a28,
  // Keyboards
  KBD: 0x363452,
  KBD_KEY: 0x28284a,
  // Chairs (dark red/maroon like reference)
  CHAIR_BACK: 0x821818,
  CHAIR_SEAT: 0x6c1414,
  CHAIR_ARM: 0x5a1010,
  CHAIR_POST: 0x282838,
  CHAIR_WHEEL: 0x1c1c28,
  // Filing cabinets (dark grey)
  CAB: 0x353a52,
  CAB_EDGE: 0x262a3c,
  CAB_HANDLE: 0x686e7e,
  // Plant
  POT: 0x7a4214,
  POT_RIM: 0x9a5820,
  SOIL: 0x3c2810,
  LEAF_D: 0x145a14,
  LEAF_M: 0x1e7a1e,
  LEAF_L: 0x28a028,
  // Wall decorations
  CORK: 0xd4a840,
  CORK_FRAME: 0x7a6030,
  NOTE_Y: 0xffe880,
  NOTE_B: 0xb0d8f0,
  NOTE_O: 0xffe0a0,
  NOTE_G: 0xb8f0b0,
  PAPER: 0xd4d8e4,
  CHART_1: 0x4060b0,
  CHART_2: 0x30a060,
  CHART_3: 0xb04040,
  CHART_4: 0x8060b0,
  // Meeting room
  TABLE: 0x4a5275,
  TABLE_EDGE: 0x363a58,
  TABLE_SHINE: 0x5a628a,
  WB: 0xd0d4e0,
  WB_FRAME: 0x485070,
  WB_LINE: 0xa0a8b8,
  WB_MARK: 0x5060a0,
  // Shared zone
  SHARED_BG: 0x252838,
  SHARED_WALL: 0x1c2030,
  // Vending machine (burgundy, like reference top-right)
  VM: 0x7a1a2a,
  VM_D: 0x5a1018,
  VM_L: 0x9a2838,
  VM_GLASS: 0x28405e,
  VM_GLASS_L: 0x38587a,
  VM_R: 0xd03030,
  VM_G: 0x30b030,
  VM_B: 0x3030d0,
  VM_Y: 0xd0a030,
  VM_PANEL: 0x1a1a28,
  VM_BTN: 0x38c038,
  VM_SLOT: 0x080810,
  VM_LIGHT: 0xf0f060,
  // Globe
  OCEAN: 0x1a5898,
  LAND: 0x2a6a2a,
  OCEAN_L: 0x4090d0,
  GLOBE_AXIS: 0x908888,
  GLOBE_STAND: 0x8a6a18,
  GLOBE_BASE: 0x6a4e10,
  GLOBE_SHINE: 0xffffff,
  // Exit door
  DOOR_FRAME: 0x3c2810,
  DOOR_BODY: 0x6a4820,
  DOOR_PANEL: 0x563c14,
  DOOR_HANDLE: 0xc0a030,
  EXIT_SIGN: 0x20c820,
  EXIT_SIGN_BG: 0x104010,
  // Between zones
  GAP: 0x151828,
};

// Draw a filled rectangle (shorthand)
function r(
  g: PIXI.Graphics,
  x: number, y: number,
  w: number, h: number,
  color: number,
  alpha = 1,
): void {
  g.beginFill(color, alpha);
  g.drawRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  g.endFill();
}

// ─── Floor ────────────────────────────────────────────────────────────────────

function drawFloor(g: PIXI.Graphics, x: number, y: number, w: number, h: number): void {
  r(g, x, y, w, h, C.FLOOR);
  // Horizontal tile lines every 8 art px (32 canvas px)
  for (let ty = y + 2 * P; ty < y + h; ty += 8 * P) {
    r(g, x, ty, w, P, C.FLOOR_ALT, 0.6);
    r(g, x, ty + P, w, P, C.FLOOR_SHADOW, 0.15);
  }
  // Vertical tile lines
  for (let tx = x + 8 * P; tx < x + w; tx += 8 * P) {
    r(g, tx, y, P / 2, h, C.FLOOR_ALT, 0.3);
  }
}

// ─── Desk + monitor + chair ───────────────────────────────────────────────────

function drawMonitor(g: PIXI.Graphics, x: number, y: number): void {
  // Body (14 art px wide, 12 art px tall)
  r(g, x,       y,        14 * P, 12 * P, C.MON_BODY);
  // Screen
  r(g, x + P,   y + P,    12 * P, 9 * P,  C.MON_SCREEN);
  // Screen glow
  r(g, x + P,   y + P,    12 * P, 9 * P,  C.MON_GLOW,   0.35);
  // Content lines on screen
  r(g, x + 2*P, y + 2*P,  7 * P,  P,      C.MON_BRIGHT, 0.9);
  r(g, x + 2*P, y + 4*P,  5 * P,  P,      C.MON_LINE2,  0.7);
  r(g, x + 2*P, y + 6*P,  8 * P,  P,      C.MON_LINE2,  0.5);
  r(g, x + 2*P, y + 8*P,  4 * P,  P,      C.MON_BRIGHT, 0.4);
  // Stand neck
  r(g, x + 5*P, y + 12*P, 4 * P,  2 * P,  C.MON_STAND);
  // Stand base
  r(g, x + 3*P, y + 14*P, 8 * P,  P,      C.MON_STAND);
}

function drawDesk(g: PIXI.Graphics, x: number, y: number): void {
  const W = 30 * P; // desk width: 30 art px
  // Desktop surface
  r(g, x,       y,           W,      2 * P,  C.DESK_TOP);
  // Front face
  r(g, x,       y + 2 * P,   W,      3 * P,  C.DESK_FRONT);
  // Left/right edge rails
  r(g, x,       y,           P,      5 * P,  C.DESK_SIDE);
  r(g, x + W - P, y,         P,      5 * P,  C.DESK_SIDE);
  // Legs (2)
  r(g, x + 2*P, y + 5 * P,  2 * P,  5 * P,  C.DESK_LEG);
  r(g, x + W - 4*P, y + 5*P, 2*P,   5 * P,  C.DESK_LEG);
  // Keyboard on desk surface
  r(g, x + 8*P, y - P,       12*P,   2 * P,  C.KBD);
  r(g, x + 9*P, y - P,       10*P,   P,      C.KBD_KEY);
  // Monitor (centered above desk)
  drawMonitor(g, x + 8 * P, y - 16 * P);
}

function drawChair(g: PIXI.Graphics, x: number, y: number): void {
  // Back
  r(g, x + 4*P, y,           6 * P,  9 * P,  C.CHAIR_BACK);
  r(g, x + 5*P, y + P,       4 * P,  7 * P,  C.CHAIR_ARM);
  // Seat
  r(g, x,       y + 9 * P,   14*P,   4 * P,  C.CHAIR_SEAT);
  r(g, x + P,   y + 9 * P,   12*P,   3 * P,  C.CHAIR_BACK);
  // Center post
  r(g, x + 5*P, y + 13*P,    4 * P,  4 * P,  C.CHAIR_POST);
  // Base star
  r(g, x,       y + 17*P,    14*P,   2 * P,  C.CHAIR_POST);
  r(g, x + 4*P, y + 15*P,    6 * P,  4 * P,  C.CHAIR_POST);
  // Wheels
  r(g, x,       y + 18*P,    2 * P,  2 * P,  C.CHAIR_WHEEL);
  r(g, x + 12*P, y + 18*P,   2 * P,  2 * P,  C.CHAIR_WHEEL);
  r(g, x + 6*P, y + 18*P,    2 * P,  2 * P,  C.CHAIR_WHEEL);
}

function drawDeskSetup(g: PIXI.Graphics, x: number, y: number): void {
  drawChair(g, x + 8 * P,  y + 8 * P);
  drawDesk(g,  x,           y);
}

// ─── Filing cabinet ───────────────────────────────────────────────────────────

function drawCabinet(g: PIXI.Graphics, x: number, y: number, drawers = 3): void {
  const W = 12 * P, DH = 7 * P;
  const H = drawers * DH + 2 * P;
  // Body
  r(g, x,       y,     W,     H,     C.CAB);
  r(g, x,       y,     P,     H,     C.CAB_EDGE);
  r(g, x + W-P, y,     P,     H,     C.CAB_EDGE);
  r(g, x,       y,     W,     P,     C.CAB_EDGE);
  // Drawers
  for (let i = 0; i < drawers; i++) {
    const dy = y + P + i * DH;
    r(g, x + P,   dy,          W - 2*P, DH - P,  C.CAB_EDGE);
    r(g, x + P,   dy,          W - 2*P, DH - 2*P, C.CAB);
    // Handle
    r(g, x + 4*P, dy + 2*P,    4 * P,   2 * P,   C.CAB_HANDLE);
    r(g, x + 5*P, dy + 2*P,    2 * P,   P,       C.CAB);
  }
}

// ─── Plant ────────────────────────────────────────────────────────────────────

function drawPlant(g: PIXI.Graphics, x: number, y: number): void {
  // Pot
  r(g, x + 3*P, y + 12*P,  6 * P,  6 * P,  C.POT);
  r(g, x + 2*P, y + 12*P,  8 * P,  P,      C.POT_RIM);
  r(g, x + 3*P, y + 17*P,  6 * P,  P,      C.SOIL);
  // Stem
  r(g, x + 5*P, y + 6*P,   2 * P,  6 * P,  C.LEAF_D);
  // Leaves cluster
  r(g, x + 2*P, y + 2*P,   8 * P,  6 * P,  C.LEAF_M);
  r(g, x,       y + 4*P,   4 * P,  4 * P,  C.LEAF_D);
  r(g, x + 8*P, y + 4*P,   4 * P,  4 * P,  C.LEAF_D);
  r(g, x + 3*P, y,          6 * P,  4 * P,  C.LEAF_L);
  r(g, x + P,   y + P,      4 * P,  4 * P,  C.LEAF_M);
  r(g, x + 7*P, y + P,      4 * P,  4 * P,  C.LEAF_M);
}

// ─── Noticeboard ─────────────────────────────────────────────────────────────

function drawNoticeboard(g: PIXI.Graphics, x: number, y: number): void {
  // Frame
  r(g, x,       y,     16*P, 12*P, C.CORK_FRAME);
  // Cork surface
  r(g, x + P,   y + P, 14*P, 10*P, C.CORK);
  // Sticky notes
  const notes = [
    { nx: 1, ny: 1, c: C.NOTE_Y }, { nx: 8, ny: 1, c: C.NOTE_B },
    { nx: 1, ny: 6, c: C.NOTE_O }, { nx: 8, ny: 6, c: C.NOTE_G },
  ];
  for (const { nx, ny, c } of notes) {
    r(g, x + (nx+1)*P, y + (ny+1)*P, 5*P, 3*P, c);
    r(g, x + (nx+2)*P, y + (ny+2)*P, 3*P, P, 0x606060, 0.25);
  }
}

function drawChartPoster(g: PIXI.Graphics, x: number, y: number): void {
  // Frame
  r(g, x,       y,     13*P, 14*P, C.CAB_EDGE);
  // Paper
  r(g, x + P,   y + P, 11*P, 12*P, C.PAPER);
  // Bar chart
  const bars: [number, number][] = [[2, 3], [4, 5], [6, 9], [8, 7], [10, 5]];
  const cols = [C.CHART_1, C.CHART_2, C.CHART_3, C.CHART_4, C.CHART_1];
  for (let i = 0; i < bars.length; i++) {
    const [bx, bh] = bars[i];
    r(g, x + bx*P, y + (13-bh)*P, 2*P, bh*P, cols[i]);
  }
  // Baseline
  r(g, x + P, y + 12*P, 11*P, P, C.CAB_EDGE);
}

// ─── Meeting room ─────────────────────────────────────────────────────────────

function drawMeetingRoom(g: PIXI.Graphics, zx: number, zy: number, zw: number, _zh: number): void {
  // Whiteboard on back wall
  const wbx = zx + 8*P, wby = zy + 2*P;
  const wbw = zw - 16*P, wbh = 14*P;
  r(g, wbx - P,  wby - P,  wbw + 2*P, wbh + 2*P, C.WB_FRAME);
  r(g, wbx,      wby,       wbw,        wbh,       C.WB);
  for (let i = 0; i < 3; i++) {
    r(g, wbx + 2*P, wby + (3+i*4)*P, wbw - 4*P, P, C.WB_LINE);
  }
  r(g, wbx + 2*P, wby + 3*P, 12*P, P, C.WB_MARK, 0.7);
  r(g, wbx + 2*P, wby + 7*P, 20*P, P, C.WB_MARK, 0.5);

  // Conference table
  const tx = zx + 10*P, ty = zy + 20*P;
  const tw = zw - 20*P, th = 18*P;
  // Table top
  r(g, tx + 2*P, ty,        tw - 4*P, th,       C.TABLE);
  r(g, tx,       ty + 2*P,  tw,        th - 4*P, C.TABLE);
  // Table shine
  r(g, tx + 4*P, ty + 2*P,  tw - 8*P, 2*P,      C.TABLE_SHINE, 0.4);
  // Table edge/shadow
  r(g, tx + 2*P, ty + th - 2*P, tw - 4*P, 4*P,  C.TABLE_EDGE);
  // Table legs
  r(g, tx + 4*P, ty + th,   3*P, 5*P, C.TABLE_EDGE);
  r(g, tx + tw - 7*P, ty + th, 3*P, 5*P, C.TABLE_EDGE);

  // Chairs around table — top side (2 chairs)
  const chairSpacing = (tw - 8*P) / 2;
  for (let i = 0; i < 2; i++) {
    const cx = tx + 4*P + i * chairSpacing;
    drawChair(g, cx, ty - 22*P);
  }
  // Chairs — bottom side (2 chairs, flipped visually by adjusting y)
  for (let i = 0; i < 2; i++) {
    const cx = tx + 4*P + i * chairSpacing;
    // Just seat visible from behind for top-down feel
    r(g, cx,      ty + th + 2*P, 14*P, 4*P, C.CHAIR_SEAT);
    r(g, cx + P,  ty + th + 2*P, 12*P, 3*P, C.CHAIR_BACK);
    r(g, cx + 4*P, ty + th + 5*P, 6*P, 3*P, C.CHAIR_POST);
  }
}

// ─── Vending machine ─────────────────────────────────────────────────────────

function drawVendingMachine(g: PIXI.Graphics, x: number, y: number): void {
  const W = 13 * P, H = 25 * P;

  // Top light strip
  r(g, x,       y,       W,     P,      C.VM_LIGHT, 0.8);
  // Body
  r(g, x,       y + P,   W,     H - P,  C.VM);
  // Left/top shadow edges
  r(g, x,       y + P,   P,     H - P,  C.VM_D);
  r(g, x,       y + P,   W,     P,      C.VM_D);
  // Right highlight edge
  r(g, x + W-P, y + P,   P,     H - P,  C.VM_L, 0.5);

  // Glass display window
  const gx = x + 2*P, gy = y + 2*P, gw = W - 4*P, gh = 13*P;
  r(g, gx,      gy,      gw,    gh,     C.VM_GLASS);
  r(g, gx,      gy,      gw,    gh,     C.VM_GLASS_L, 0.2);
  // Reflection on glass
  r(g, gx,      gy,      P,     gh,     0xffffff, 0.07);

  // Items inside (3 rows × 2 cols)
  const itemColors = [C.VM_R, C.VM_G, C.VM_B, C.VM_Y, C.VM_R, C.VM_G];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      const ix = gx + P + col * ((gw - 2*P) / 2);
      const iy = gy + P + row * (4 * P);
      r(g, ix, iy, 4*P, 3*P, itemColors[row * 2 + col]);
    }
  }

  // Control panel area
  r(g, x + P, y + 16*P, W - 2*P, 7*P, C.VM_PANEL);
  // 4 selection buttons
  for (let i = 0; i < 4; i++) {
    r(g, x + 2*P + i * 3*P, y + 17*P, 2*P, 2*P, C.VM_BTN);
  }
  // Coin slot
  r(g, x + 4*P,  y + 20*P, 5*P, P, C.VM_SLOT);
  r(g, x + 5*P,  y + 19*P, 3*P, 3*P, C.VM_SLOT);

  // Dispensing tray at bottom
  r(g, x + P,   y + H - 5*P, W - 2*P, 4*P, C.VM_D);
  r(g, x + 2*P, y + H - 3*P, W - 4*P, 2*P, C.VM_SLOT);
}

// ─── Globe ───────────────────────────────────────────────────────────────────

function drawGlobe(g: PIXI.Graphics, x: number, y: number): void {
  const cx = x + 15 * P;
  const cy = y + 11 * P;
  const R  = 9 * P; // globe radius in canvas px

  // Axis rod (through globe)
  r(g, cx - P/2, cy - R - 2*P, P, R * 2 + 4*P + 10*P, C.GLOBE_AXIS);

  // Globe body (circle)
  g.beginFill(C.OCEAN);
  g.drawCircle(cx, cy, R);
  g.endFill();

  // Land masses (pixel patches within circle bounds)
  g.beginFill(C.LAND);
  // "North America" — upper left
  g.drawRect(cx - 7*P, cy - 7*P, 5*P, 3*P);
  g.drawRect(cx - 8*P, cy - 5*P, 6*P, 4*P);
  // "Europe / Africa" — center right
  g.drawRect(cx + P,   cy - 6*P, 4*P, 5*P);
  g.drawRect(cx + 2*P, cy - P,   3*P, 6*P);
  // "Asia" — upper right
  g.drawRect(cx + 3*P, cy - 7*P, 5*P, 3*P);
  // "Australia" — lower right
  g.drawRect(cx + 3*P, cy + 4*P, 3*P, 2*P);
  // "South America" — center left
  g.drawRect(cx - 5*P, cy + 2*P, 3*P, 4*P);
  g.endFill();

  // Latitude lines (subtle)
  g.lineStyle(1, C.OCEAN_L, 0.3);
  for (let ly = cy - 6*P; ly <= cy + 6*P; ly += 3*P) {
    const hw = Math.sqrt(Math.max(0, R * R - (ly - cy) * (ly - cy)));
    if (hw > 0) {
      g.moveTo(cx - hw, ly);
      g.lineTo(cx + hw, ly);
    }
  }
  g.lineStyle(0);

  // Globe highlight (top-left shine)
  g.beginFill(C.GLOBE_SHINE, 0.12);
  g.drawCircle(cx - 4*P, cy - 5*P, 3*P);
  g.endFill();
  g.beginFill(C.GLOBE_SHINE, 0.06);
  g.drawCircle(cx - 4*P, cy - 5*P, 5*P);
  g.endFill();

  // Stand
  const sy = cy + R;
  r(g, cx - P,   sy,           2*P, 5*P, C.GLOBE_STAND);
  r(g, cx - 7*P, sy + 5*P,    14*P, 2*P, C.GLOBE_STAND);
  r(g, cx - 8*P, sy + 7*P,    16*P, 3*P, C.GLOBE_BASE);
}

// ─── Exit door ───────────────────────────────────────────────────────────────

function drawExitDoor(g: PIXI.Graphics, x: number, y: number): void {
  const W = 16 * P, H = 28 * P;

  // Door frame
  r(g, x,       y,       W,     H + 4*P, C.DOOR_FRAME);
  // Door surface
  r(g, x + 2*P, y + P,   W - 4*P, H,    C.DOOR_BODY);

  // Upper panel
  r(g, x + 4*P, y + 3*P, W - 8*P, 9*P,  C.DOOR_PANEL);
  r(g, x + 5*P, y + 4*P, W - 10*P, 7*P, C.DOOR_BODY, 0.4);

  // Lower panel
  r(g, x + 4*P, y + 14*P, W - 8*P, 13*P, C.DOOR_PANEL);
  r(g, x + 5*P, y + 15*P, W - 10*P, 11*P, C.DOOR_BODY, 0.4);

  // Door handle
  r(g, x + W - 6*P, y + 14*P, 2*P, 5*P,  C.DOOR_HANDLE);
  r(g, x + W - 8*P, y + 14*P, 4*P, P,    C.DOOR_HANDLE);
  r(g, x + W - 6*P, y + 18*P, 3*P, P,    0x907818);

  // EXIT sign above door
  r(g, x + 2*P, y - 6*P, W - 4*P, 5*P,  C.EXIT_SIGN_BG);
  r(g, x + 3*P, y - 5*P, W - 6*P, 3*P,  C.EXIT_SIGN);
  // "E X I T" hint — 4 letter blocks
  for (let i = 0; i < 4; i++) {
    r(g, x + (3 + i*3)*P, y - 5*P, 2*P, 3*P, C.EXIT_SIGN_BG, 0.5);
  }
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function drawOfficeScene(stage: PIXI.Container): void {
  const g = new PIXI.Graphics();
  g.zIndex = 0;
  stage.sortableChildren = true;
  stage.addChildAt(g, 0);

  const mo = ZONES.find(z => z.id === 'main-office')!;
  const mr = ZONES.find(z => z.id === 'meeting-room')!;
  const cs = ZONES.find(z => z.id === 'coffee-station')!;
  const gv = ZONES.find(z => z.id === 'globe-vacation')!;
  const ed = ZONES.find(z => z.id === 'exit-door')!;

  // ── Canvas background ──────────────────────────────────────────────────────
  r(g, 0, 0, 1024, 768, C.BG);

  // ── Gap strip between rooms and shared zone ─────────────────────────────────
  r(g, 0, mo.y + mo.height, 1024, cs.y - (mo.y + mo.height), C.GAP);

  // ── Shared zone strip ──────────────────────────────────────────────────────
  r(g, 0, cs.y - 2*P, 1024, cs.height + 4*P + ed.height + 8*P, C.SHARED_BG);
  r(g, 0, cs.y - 2*P, 1024, 2*P, C.SHARED_WALL);

  // ── MAIN OFFICE ────────────────────────────────────────────────────────────
  // Floor
  drawFloor(g, mo.x, mo.y, mo.width, mo.height);

  // Back wall strip
  r(g, mo.x,     mo.y,          mo.width, 14*P, C.WALL);
  r(g, mo.x,     mo.y,          mo.width, P,    C.WALL_TOP);
  r(g, mo.x,     mo.y + 13*P,   mo.width, P,    C.WALL_ACCENT);

  // Wall decorations
  drawNoticeboard(g,  mo.x + 5*P,   mo.y + 2*P);
  drawChartPoster(g,  mo.x + 25*P,  mo.y + 2*P);
  drawNoticeboard(g,  mo.x + 42*P,  mo.y + 2*P);
  drawChartPoster(g,  mo.x + 62*P,  mo.y + 2*P);
  drawNoticeboard(g,  mo.x + 80*P,  mo.y + 2*P);
  drawChartPoster(g,  mo.x + 100*P, mo.y + 2*P);

  // Upper row — 3 desks
  drawDeskSetup(g, mo.x + 10*P,  mo.y + 22*P);
  drawDeskSetup(g, mo.x + 50*P,  mo.y + 22*P);
  drawDeskSetup(g, mo.x + 90*P,  mo.y + 22*P);

  // Lower row — 3 desks
  drawDeskSetup(g, mo.x + 10*P,  mo.y + 56*P);
  drawDeskSetup(g, mo.x + 50*P,  mo.y + 56*P);
  drawDeskSetup(g, mo.x + 90*P,  mo.y + 56*P);

  // Plant in corner
  drawPlant(g, mo.x + 116*P, mo.y + 68*P);

  // ── MEETING ROOM ───────────────────────────────────────────────────────────
  drawFloor(g, mr.x, mr.y, mr.width, mr.height);

  // Back wall strip
  r(g, mr.x,   mr.y,        mr.width, 14*P, C.WALL);
  r(g, mr.x,   mr.y,        mr.width, P,    C.WALL_TOP);
  r(g, mr.x,   mr.y + 13*P, mr.width, P,    C.WALL_ACCENT);

  drawMeetingRoom(g, mr.x, mr.y, mr.width, mr.height);

  // ── COFFEE STATION ─────────────────────────────────────────────────────────
  drawVendingMachine(g, cs.x + 2*P, cs.y + 2*P);
  // Second smaller machine / coffee maker
  r(g, cs.x + 18*P, cs.y + 10*P, 8*P,  14*P, C.CAB);
  r(g, cs.x + 19*P, cs.y + 11*P, 6*P,  5*P,  C.MON_SCREEN);
  r(g, cs.x + 20*P, cs.y + 12*P, 4*P,  3*P,  C.VM_R, 0.7);
  r(g, cs.x + 19*P, cs.y + 18*P, 6*P,  P,    C.VM_LIGHT, 0.5);

  // ── GLOBE VACATION ─────────────────────────────────────────────────────────
  drawGlobe(g, gv.x + 5*P, gv.y + 3*P);

  // ── EXIT DOOR ──────────────────────────────────────────────────────────────
  drawExitDoor(g, ed.x + 2*P, ed.y + 2*P);
}
