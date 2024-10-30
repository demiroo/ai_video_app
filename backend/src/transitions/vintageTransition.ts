import {ThreadGenerator, useTransition, createSignal} from '@revideo/core';

export function* vintageTransition(duration = 0.6): ThreadGenerator {
  const sepiaIntensity = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.filter = `sepia(${sepiaIntensity() * 100}%)`;
    },
    ctx => {
      ctx.globalAlpha = 1 - sepiaIntensity();
    }
  );

  yield* sepiaIntensity(1, duration);

  endTransition();
}