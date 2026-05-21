import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { PixiContext } from '@/contexts/PixiContext';
import { ZONES } from '@/lib/zones.config';
import { drawOfficeScene } from './drawScene';

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;
const BG_COLOR = 0x0d1020;

function isDebugMode(): boolean {
  return new URLSearchParams(window.location.search).get('debug') === 'true';
}

interface OfficeProps {
  children?: React.ReactNode;
  onCanvasClick?: (x: number, y: number) => void;
}

export function Office({ children, onCanvasClick }: OfficeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [app, setApp] = useState<PIXI.Application | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const pixiApp = new PIXI.Application({
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: BG_COLOR,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(pixiApp.view as HTMLCanvasElement);

    // Draw pixel art office scene
    drawOfficeScene(pixiApp.stage);

    // Debug overlay
    if (isDebugMode()) {
      for (const zone of ZONES) {
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0xffff00, 0.3);
        overlay.lineStyle(2, 0xffff00, 0.8);
        overlay.drawRect(zone.x, zone.y, zone.width, zone.height);
        overlay.endFill();
        pixiApp.stage.addChild(overlay);

        const debugLabel = new PIXI.Text(zone.id, {
          fontFamily: 'monospace',
          fontSize: 10,
          fill: 0xffff00,
        });
        debugLabel.x = zone.x + 4;
        debugLabel.y = zone.y + zone.height - 16;
        pixiApp.stage.addChild(debugLabel);
      }
    }

    // Click handler for avatar movement
    pixiApp.stage.interactive = true;
    pixiApp.stage.hitArea = new PIXI.Rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    pixiApp.stage.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
      const local = e.getLocalPosition(pixiApp.stage);
      onCanvasClick?.(local.x, local.y);
    });

    setApp(pixiApp);

    return () => {
      pixiApp.destroy(true, { children: true });
    };
    // onCanvasClick intentionally excluded — attach via ref pattern below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update click handler without recreating the app
  const onClickRef = useRef(onCanvasClick);
  useEffect(() => {
    onClickRef.current = onCanvasClick;
  }, [onCanvasClick]);

  useEffect(() => {
    if (!app) return;
    const handler = (e: PIXI.FederatedPointerEvent) => {
      const local = e.getLocalPosition(app.stage);
      onClickRef.current?.(local.x, local.y);
    };
    app.stage.removeAllListeners('pointerdown');
    app.stage.on('pointerdown', handler);
  }, [app]);

  return (
    <PixiContext.Provider value={app}>
      <div
        style={{ position: 'relative', width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        className="select-none"
      >
        <div ref={containerRef} style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }} />
        {children}
      </div>
    </PixiContext.Provider>
  );
}
