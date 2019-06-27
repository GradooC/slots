import * as PIXI from 'pixi.js';
import { ReelType } from "./types";
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  BTN_SIZE,
  REELS_AMOUNT,
  SYMBOLS_AMOUNT,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  REEL_WIDTH,
  SYMBOL_SIZE
} from './config';

// Aliases
const {
  Application,
  Sprite,
  Container
} = PIXI;

const loader = new PIXI.Loader;

const getRandomSprite = (): PIXI.Sprite => {
  const symbolsTextures = [
    loader.resources['assets\\img\\symbols\\01.png'].texture,
    loader.resources['assets\\img\\symbols\\02.png'].texture,
    loader.resources['assets\\img\\symbols\\03.png'].texture,
    loader.resources['assets\\img\\symbols\\04.png'].texture,
    loader.resources['assets\\img\\symbols\\05.png'].texture,
    loader.resources['assets\\img\\symbols\\06.png'].texture,
    loader.resources['assets\\img\\symbols\\07.png'].texture,
    loader.resources['assets\\img\\symbols\\08.png'].texture,
    loader.resources['assets\\img\\symbols\\09.png'].texture,
    loader.resources['assets\\img\\symbols\\10.png'].texture,
    loader.resources['assets\\img\\symbols\\11.png'].texture,
    loader.resources['assets\\img\\symbols\\12.png'].texture,
    loader.resources['assets\\img\\symbols\\13.png'].texture
  ];

  // Get random array index
  const textureIndex = Math.floor(Math.random() * symbolsTextures.length);

  return new Sprite(symbolsTextures[textureIndex]);
};

// Variables
const allReels: ReelType[] = [];

//Create a Pixi Application
const app = new Application({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

loader
  .add([
    'assets\\img\\slotOverlay.png',
    'assets\\img\\winningFrameBackground.jpg',
    'assets\\img\\btn_spin_pressed.png',
    'assets\\img\\btn_spin_normal.png',
    'assets\\img\\btn_spin_hover.png',
    'assets\\img\\btn_spin_disable.png',
    'assets\\img\\symbols\\01.png',
    'assets\\img\\symbols\\02.png',
    'assets\\img\\symbols\\03.png',
    'assets\\img\\symbols\\04.png',
    'assets\\img\\symbols\\05.png',
    'assets\\img\\symbols\\06.png',
    'assets\\img\\symbols\\07.png',
    'assets\\img\\symbols\\08.png',
    'assets\\img\\symbols\\09.png',
    'assets\\img\\symbols\\10.png',
    'assets\\img\\symbols\\11.png',
    'assets\\img\\symbols\\12.png',
    'assets\\img\\symbols\\13.png'
  ])
  .load(setup);

function setup() {
  //Background setup
  const background = new Sprite(loader.resources['assets\\img\\winningFrameBackground.jpg'].texture);
  background.width = SCREEN_WIDTH;
  background.height = SCREEN_HEIGHT;
  app.stage.addChild(background);

  // OverLay setup
  const overlay = new Sprite(loader.resources['assets\\img\\slotOverlay.png'].texture);
  overlay.width = SCREEN_WIDTH;
  overlay.height = SCREEN_HEIGHT;
  app.stage.addChild(overlay);

  // Play button setup
  const button = new Sprite(loader.resources['assets\\img\\btn_spin_normal.png'].texture);
  button.interactive = true;
  button.width = BTN_SIZE;
  button.height = BTN_SIZE;
  button.position.set(SCREEN_WIDTH - BTN_SIZE, SCREEN_HEIGHT - BTN_SIZE);
  button.addListener('pointerdown', () => {
    console.log('click')
  });
  app.stage.addChild(button);


  // Create reels
  new Array(REELS_AMOUNT).fill(null).forEach((_, reelIndex) => {
    const reelContainer = new Container();
    reelContainer.y = MARGIN_VERTICAL;
    reelContainer.x = MARGIN_HORIZONTAL + REEL_WIDTH * reelIndex;

    const reel: ReelType = {
      container: reelContainer,
      symbols: []
    };
    allReels.push(reel);

    // Populate reels by symbols
    new Array(SYMBOLS_AMOUNT).fill(null).forEach((_, symbolIndex) => {
      const symbol = getRandomSprite();
      symbol.y = symbolIndex * SYMBOL_SIZE - SYMBOL_SIZE;
      reel.symbols.push(symbol);
      reelContainer.addChild(symbol);
    });

    app.stage.addChild(reelContainer);
  });
}
