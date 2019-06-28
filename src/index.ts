import * as PIXI from 'pixi.js';
import { ReelType, onClickFunction } from './types';
// import * as d3 from 'd3-ease';
import play from './play';
import { reelSpinSound, landingSound } from './sounds';
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  BTN_SIZE,
  REELS_AMOUNT,
  SYMBOLS_AMOUNT,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  REEL_WIDTH,
  SYMBOL_SIZE,
  BASE_SPEED
} from './config';

// const getSprite = (width: number, height: number, x: number, y: number, onClick: onClickFunction) => {

// }

// Aliases
const { Application, Sprite, Container } = PIXI;

const loader = new PIXI.Loader();

const imgPaths = [
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
];

/**
 * Utility function which returns a random symbol sprite
 * @param mask { PIXI.Graphics }  Mask for viewport
 * @return Sprite of the random symbol
 */
const getRandomSprite = (mask: PIXI.Graphics): PIXI.Sprite => {
  // Make textures from symbols
  const symbolsTextures = imgPaths
    .filter(path => /.*\\symbols\\.*/.test(path))
    .map(path => loader.resources[path].texture);

  // Get random array index
  const textureIndex = Math.floor(Math.random() * symbolsTextures.length);

  // Return sprite for random texture
  const sprite = new Sprite(symbolsTextures[textureIndex]);
  sprite.mask = mask;
  // Adjusting symbol size
  sprite.scale.x = sprite.scale.y = Math.min(280 / sprite.width, 200 / sprite.height);
  // Centering symbol inside the area;
  sprite.x = (280 - sprite.width) / 2;
  // sprite.y = (200 - sprite.height) / 2;

  return sprite;
};

// +++++++++++++++++++++++++++++
const getRectangle = (x: number, y: number) => {
  const graphics = new PIXI.Graphics();
  graphics.lineStyle(4, 0xff3300, 1).drawRect(0, 0, 280, 200);

  return graphics;
};

//++++++++++++++++++++++++++++++

// Variables
const allReels: ReelType[] = [];

//Create a Pixi Application
const app = new Application({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

loader.add(imgPaths).load(setup);

function setup() {
  // Create a mask for viewport
  const graphics = new PIXI.Graphics();
  graphics
    .beginFill(0xffffff)
    .drawRect(46, 50, 1490, 834)
    .endFill();
  app.stage.addChild(graphics);

  //Background setup
  const background = new Sprite(
    loader.resources['assets\\img\\winningFrameBackground.jpg'].texture
  );
  const backgroundContainer = new Container();

  // Fill all stage by background sprite
  new Array(Math.ceil(SCREEN_WIDTH / background.width)).fill(null).forEach((_, xIndex) => {
    new Array(Math.ceil(SCREEN_HEIGHT / background.height)).fill(null).forEach((_, yIndex) => {
      const back = new Sprite(loader.resources['assets\\img\\winningFrameBackground.jpg'].texture);
      back.x = xIndex * back.width;
      back.y = yIndex * back.height;
      backgroundContainer.addChild(back);
    });
  });

  app.stage.addChild(backgroundContainer);

  // Create reels containers
  new Array(REELS_AMOUNT).fill(null).forEach((_, reelIndex) => {
    const reelContainer = new Container();
    reelContainer.y = MARGIN_VERTICAL;
    reelContainer.x = MARGIN_HORIZONTAL + REEL_WIDTH * reelIndex;

    // Create reel
    const reel: ReelType = {
      container: reelContainer,
      symbols: [],
      rect: [],
      easing: () => 0
    };
    allReels.push(reel);

    // Populate reels by symbols
    new Array(SYMBOLS_AMOUNT).fill(null).forEach((_, symbolIndex) => {
      const symbol = getRandomSprite(graphics);
      symbol.y = symbolIndex * SYMBOL_SIZE - SYMBOL_SIZE;
      reel.symbols.push(symbol);
      reelContainer.addChild(symbol);

      // For debug purpose ========
      const rect = new PIXI.Graphics();
      rect.lineStyle(3, 0xff3300, 1).drawRect(0, symbolIndex * SYMBOL_SIZE - SYMBOL_SIZE, 280, 200);
      reel.rect.push(rect);
      reelContainer.addChild(rect);
      // For debug purpose ==========
    });

    app.stage.addChild(reelContainer);

    // OverLay setup
    const overlay = new Sprite(loader.resources['assets\\img\\slotOverlay.png'].texture);
    // overlay.x = 50;
    overlay.width = SCREEN_WIDTH;
    overlay.height = SCREEN_HEIGHT;
    app.stage.addChild(overlay);

    // Play button setup
    const button = new Sprite(loader.resources['assets\\img\\btn_spin_normal.png'].texture);
    button.interactive = true;
    button.width = BTN_SIZE;
    button.height = BTN_SIZE;
    button.position.set(SCREEN_WIDTH - BTN_SIZE, SCREEN_HEIGHT - BTN_SIZE);
    button.cursor = 'pointer';
    button.addListener('pointerdown', () => {
      reelSpinSound.play();
      play(allReels);
    });
    app.stage.addChild(button);
  });

  //Start the game
  app.ticker.add(delta => {
    allReels.forEach(reel => {
      const dy = reel.easing();

      reel.symbols.forEach(symbol => {
        symbol.y += dy * BASE_SPEED;

        // Delete out of screen symbols and add new symbols
        if (symbol.y > SYMBOL_SIZE * 5) {
          const newSymbol = getRandomSprite(graphics);
          newSymbol.y = -SYMBOL_SIZE;
          reel.container.addChild(newSymbol);
          reel.container.removeChild(symbol);

          // Update symbols array
          reel.symbols.unshift(newSymbol);
          reel.symbols.pop();
        }
      });
      // For debug purpose ========
      reel.rect.forEach(re => {
        re.y += dy * BASE_SPEED;
        console.log(re.y);
        if (re.y > SYMBOL_SIZE * 5) {
          const rect = new PIXI.Graphics();
          rect.lineStyle(3, 0xff3300, 1).drawRect(0, -SYMBOL_SIZE, 280, 200);
          reel.container.addChild(rect);
          reel.container.removeChild(re);

          // Update symbols array
          reel.rect.unshift(rect);
          reel.rect.pop();
        }
      });
      // For debug purpose ==========
    });
  });
}
