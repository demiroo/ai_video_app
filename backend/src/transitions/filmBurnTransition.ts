import { Rect } from "@revideo/2d";
import {
    ThreadGenerator,
    useTransition,
    useScene,
    Vector2,
    createSignal,
    all,
    linear,
    waitFor,
    Direction
  } from '@revideo/core';
import { Color } from '@revideo/core/lib/types/Color';
  
  
  export function* filmBurnTransition(duration = 0.6): ThreadGenerator {
    const scene = useScene();
    const size = scene.getSize();
    const burnColor = createSignal(new Color('#ff4500'));
    const burnIntensity = createSignal(0);

    const endTransition = useTransition(
      ctx => {
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = burnColor().alpha(burnIntensity()).toString();
        ctx.fillRect(0, 0, size.width, size.height);
      },
      ctx => {
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = burnColor().alpha(1 - burnIntensity()).toString();
        ctx.fillRect(0, 0, size.width, size.height);
      }
    );

    yield* burnIntensity(1, duration / 2);
    yield* burnIntensity(0, duration / 2);

    endTransition();
  }

  
