import { ReelType } from './types';

function fn(sec: number) {
  let steps = 60 * sec * 0.2 * 5;
  return () => {
    steps -= 1;
    return steps > 0 ? steps / (60 * sec * 5) : 0;
  };
}

export default (allReels: ReelType[]) => {
  allReels.map((reel, reelIndex) => (reel.easing = fn(reelIndex)));
};
