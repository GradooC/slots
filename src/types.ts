import * as PIXI from 'pixi.js';

interface EasingFunction {
  (): number
}

export interface onClickFunction {
  (): void
}

export interface ReelType {
  container: PIXI.Container;
  symbols: PIXI.Sprite[];
  easing: EasingFunction;
  rect: PIXI.Graphics[];
}