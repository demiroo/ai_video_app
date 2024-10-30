import {ThreadGenerator, useTransition, Vector2} from '@revideo/core';

export function* motionBlurTransition(direction: Vector2, duration = 0.6, maxBlur = 20): ThreadGenerator {
  const blurAmount = Vector2.createSignal(Vector2.zero);
  const normalizedDirection = direction.normalized.scale(maxBlur);

  const endTransition = useTransition(
    ctx => {
      const {x, y} = blurAmount();
      ctx.filter = `blur(${Math.abs(x + y)}px)`;
      ctx.translate(x, y);
    },
    ctx => {
      const {x, y} = blurAmount();
      ctx.filter = `blur(${Math.abs(x + y)}px)`;
      ctx.translate(-x, -y);
    }
  );

  yield* blurAmount(normalizedDirection, duration / 2);
  yield* blurAmount(Vector2.zero, duration / 2);

  endTransition();
}