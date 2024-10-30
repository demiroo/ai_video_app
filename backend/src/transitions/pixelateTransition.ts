import {ThreadGenerator, useScene, useTransition, Vector2} from '@revideo/core';

export function* pixelateTransition(duration = 0.6): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const pixelSize = Vector2.createSignal(1);

  const endTransition = useTransition(
    ctx => {
      const scale = pixelSize().x;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        ctx.canvas,
        0, 0, size.width / scale, size.height / scale,
        0, 0, size.width, size.height
      );
    },
    ctx => {
      ctx.globalAlpha = 1 - (pixelSize().x - 1) / 19;
    }
  );

  yield* pixelSize(new Vector2(20, 20), duration / 2);
  yield* pixelSize(new Vector2(1, 1), duration / 2);

  endTransition();
}