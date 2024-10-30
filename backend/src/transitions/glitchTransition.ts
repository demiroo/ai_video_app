import {ThreadGenerator, useScene, useTransition, Vector2, Random} from '@revideo/core';

export function* glitchTransition(duration = 0.6): ThreadGenerator {
  const scene = useScene();
  const size = scene.getSize();
  const glitchIntensity = Vector2.createSignal(Vector2.zero);
  const random = new Random(Date.now()); // Use current timestamp as seed

  const endTransition = useTransition(
    ctx => {
      for (let i = 0; i < 10; i++) {
        const y = random.nextInt(0, size.height);
        const height = random.nextInt(5, 20);
        const offset = random.nextInt(-20, 20) * glitchIntensity().x;
        ctx.drawImage(
          ctx.canvas,
          0, y, size.width, height,
          offset, y, size.width, height
        );
      }
    },
    ctx => {
      ctx.globalAlpha = 1 - glitchIntensity().y;
    }
  );

  for (let i = 0; i < 5; i++) {
    yield* glitchIntensity(new Vector2(1, 0), duration / 10);
    yield* glitchIntensity(Vector2.zero, duration / 10);
  }

  yield* glitchIntensity(new Vector2(0, 1), duration / 2);

  endTransition();
}