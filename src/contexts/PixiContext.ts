import { createContext, useContext } from 'react';
import type { Application } from 'pixi.js';

export const PixiContext = createContext<Application | null>(null);

export function usePixiApp(): Application | null {
  return useContext(PixiContext);
}
