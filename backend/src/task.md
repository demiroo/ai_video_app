# Transitions | Revideo
_Note: These docs were adopted from the original [Motion Canvas](https://motioncanvas.io/docs/) docs_

Transitions allow you to customize the way scenes transition from one into another. A transition is an animation performed at the beginning of the scene. It can modify the context of both the current and the previous scene.

Before we start[​](#before-we-start "Direct link to Before we start")
---------------------------------------------------------------------

Make sure your project contains at least two scenes. In this example, we've prepared firstScene.tsx and secondScene.tsx, and configured our project to display one after the other. We'll be setting up our transitions in the second scene.

Make sure to put something different in both scenes to easier see the transitions.

my-animation/
└─ src/
   ├─ scenes/
   │  ├─ firstScene.tsx
   │  └─ secondScene.tsx
   └─ project.ts




Pre-made transitions[​](#pre-made-transitions "Direct link to Pre-made transitions")
------------------------------------------------------------------------------------

Motion Canvas comes with a set of common transitions in a form of easy-to-use generators. To use them, yield* the transition generator at the beginning of the new scene:

src/scenes/secondScene.tsx

export default makeScene2D(function* (view) {
  // set up the scene:
  view.add(/* your nodes here */);

  // perform a slide transition to the left:
  yield* slideTransition(Direction.Left);

  // proceed with the animation
  yield* waitFor(3);
});




[View source code](https://github.com/revideo/revideo/blob/main/packages/examples/src/scenes/transitions-second.tsx)

caution

Make sure to add nodes to the view before yielding the transition generator. Otherwise, your scene will remain empty until the transition ends.

All available transitions are listed below:

### slideTransition[​](#slidetransition "Direct link to slidetransition")

Perform a transition that slides the scene in the given direction.

#### Parameters

*   [direction](#slideTransition-slideTransition-direction): [Direction](https://docs.re.video/api/core/types/Direction)
    
    The direction in which to slide.
    
*   [duration](#slideTransition-slideTransition-duration)?: number
    
    The duration of the transition.
    

* * *

### zoomInTransition[​](#zoomintransition "Direct link to zoomintransition")

Perform a transition that zooms in on a given area of the scene.

#### Parameters

*   [area](#zoomInTransition-zoomInTransition-area): [BBox](https://docs.re.video/api/core/types/BBox)
    
    The area on which to zoom in.
    
*   [duration](#zoomInTransition-zoomInTransition-duration): number = 0.6
    
    The duration of the transition.
    

* * *

### zoomOutTransition[​](#zoomouttransition "Direct link to zoomouttransition")

Perform a transition that zooms out from a given area of the scene.

#### Parameters

*   [area](#zoomOutTransition-zoomOutTransition-area): [BBox](https://docs.re.video/api/core/types/BBox)
    
    The area from which to zoom out.
    
*   [duration](#zoomOutTransition-zoomOutTransition-duration): number = 0.6
    
    The duration of the transition.
    

* * *

### fadeTransition[​](#fadetransition "Direct link to fadetransition")

Perform a transition that fades between the scenes.

#### Parameters

*   [duration](#fadeTransition-fadeTransition-duration): number = 0.6
    
    The duration of the transition.
    

* * *

Custom transitions[​](#custom-transitions "Direct link to Custom transitions")
------------------------------------------------------------------------------

You can use the [useTransition](https://docs.re.video/api/core/transitions#useTransition) function to implement custom transitions. It allows you to specify two callbacks that will modify the contexts of the current and previous scene respectively. The value it returns is a callback that you need to call once you finish the transition.

The transition template looks as follows:

// set up the transition
const endTransition = useTransition(
  currentContext => {
    // modify the context of the current scene
  },
  previousContext => {
    // modify the context of the previous scene
  },
);

// perform animations

// finish the transition
endTransition();




Here's how you could implement a simple slide transition:

export function* slideTransition(
  direction: Direction = Direction.Top,
  duration = 0.6,
): ThreadGenerator {
  const size = useScene().getSize();
  const position = size.getOriginOffset(direction).scale(2);
  const previousPosition = Vector2.createSignal();
  const currentPosition = Vector2.createSignal(position);

  // set up the transition
  const endTransition = useTransition(
    // modify the context of the current scene
    ctx => ctx.translate(currentPosition.x(), currentPosition.y()),
    // modify the context of the previous scene
    ctx => ctx.translate(previousPosition.x(), previousPosition.y()),
  );

  // perform animations
  yield* all(
    previousPosition(position.scale(-1), duration),
    currentPosition(Vector2.zero, duration),
  );

  // finish the transition
  endTransition();
}




Animate when transitioning[​](#animate-when-transitioning "Direct link to Animate when transitioning")
------------------------------------------------------------------------------------------------------

By default, Motion Canvas will transition to the next scene once the generator of the current scene has reached the end. In this case, the scene will freeze for the duration of the transition. You can use the [finishScene](https://docs.re.video/api/core/utils#finishScene) function to trigger the transition early, allowing the animation to continue while transitioning:

export default makeScene2D(function* (view) {
  yield* animationOne();
  // trigger the transition early:
  finishScene();
  // continue animating:
  yield* animationTwo();
});


use information above lets create more transition effect for list below:
1. Film Burn: Film burn transitions add a dose of nostalgia and artistic flair to your content. It's like taking a trip back in time to the good ol’ days of old-school film cameras. The effect simulates the look of film overheating and burning, creating a warm, organic light leak that blends one scene into the next. It's not just a transition; it's a style statement.

2. Motion BlurMotion: Blur transitions are where each scene glides into the next with a soft blur. It’s a versatile transition style that works for soft dream sequences as well as fast-paced action scenes. The Motion Blur effect creates continuity, making it perfect for when you are looking for a dynamic yet smooth flow.
3. Glitch Effect: Imagine a scene that suddenly distorts, jitters, and scrambles – only to reveal the next scene in a burst of digital chaos. That's the Glitch Effect for you. It's like, just for a moment, you’re getting a glimpse of a cool, digital dimension. This effect is perfect when you want your videos to be bold, disruptive, and eye-catching.

4. Pixelate: Pixelate transitions are all about the pixelation. It’s like taking a photo and then zooming in on it, only to find that the image is made up of tiny squares. This effect is perfect when you want your videos to be bold, disruptive, and eye-catching.

5. Vintage Transitions: Vintage transitions are all about the nostalgia. It’s like taking a trip back in time to the good ol’ days of old-school film cameras. The effect simulates the look of film overheating and burning, creating a warm, organic light leak that blends one scene into the next. It's not just a transition; it's a style statement.