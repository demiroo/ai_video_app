import { Audio, Img, makeScene2D, Txt, View2D, Rect, Video } from "@revideo/2d";
import {
  all,
  createRef,
  waitFor,
  useScene,
  Reference,
  createSignal,
  chain,
  cos,
  slideTransition,
  Direction,
  tween,
  easeInOutCubic,
  easeInElastic,
  map,
  easeInBounce,
  easeInOutBack,
  easeOutBounce,
  zoomOutTransition,
  BBox,
  zoomInTransition,
  fadeTransition,
  Vector2,
} from "@revideo/core";
import {filmBurnTransition} from '../transitions/filmBurnTransition';
import {glitchTransition} from '../transitions/glitchTransition';
import {motionBlurTransition} from '../transitions/motionBlurTransition';
import {vintageTransition} from '../transitions/vintageTransition'; 
import { pixelateTransition } from "../transitions/pixelateTransition";

interface ContentSettings {
  fontSize: number;
  fontColor: string;
  fontWeight: number;
  fontFamily: string;
  textAlign: "center" | "left";
  borderColor?: string;
  borderWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
}

interface IntroOutro {
  text: string;
  audioUrl: string;
  backgroundImage: string;
  duration: number;
  contentSettings: ContentSettings;
}

interface QuizQuestion {
  question: {
    text: string;
    questionAudioUrl: string;
    contentSettings: ContentSettings;
  };
  options: {
    optionData: string[];
    optionsAudioUrl: string;
    contentSettings: ContentSettings;
  };
  answer: {
    text: string;
    answerAudioUrl: string;
    contentSettings: ContentSettings;
  };
  backgroundImage: string;
  questionDuration: number;
  optionsDuration: number;
  answerDuration: number;
  questionAudioTime: number;
  optionsAudioTime: number;
  answerAudioTime: number;
  totalDuration: number;
}

interface Quiz {
  topic: {
    text: string;
    contentSettings: ContentSettings;
  };
  intro: IntroOutro;
  outro: IntroOutro;
  quizzes: QuizQuestion[];
  totalDuration: number;
}

export default makeScene2D(function* (view) {
  const quiz = useScene().variables.get("quiz", {})() as Quiz;

  // const backgroundAudioRef = createRef<Audio>();
  const topicRef = createRef<Txt>();
  const backgroundRef = createRef<Img>();
  // yield view.add(
  //   <>
  //   <Audio
  //     src={"https://revideo-example-assets.s3.amazonaws.com/chill-beat-2.mp3"}
  //     play={true}
  //     volume={0.05}
  //     ref={backgroundAudioRef}
  //   />
    
  //   </>
  // );

  

  yield view.add(
    <Txt
      fontSize={0}
      fontWeight={quiz.topic.contentSettings.fontWeight}
      fontFamily={quiz.topic.contentSettings.fontFamily}
      fill={quiz.topic.contentSettings.fontColor}
      zIndex={2}
      ref={topicRef}
      position={[0, -(1920 / 2 - 100)]}
      opacity={0}
    >
      {`${quiz.topic.text.toUpperCase()} QUIZ`}
    </Txt>
  );

  // yield* all(
  //   tween(0.5, (value) => {
  //     topicRef().fontSize(map(70, 100, easeOutBounce(value)));
  //     topicRef().opacity(map(0, 1, easeInOutCubic(value)))
  //   }),
  // );

  yield* animateTopic(topicRef,0.5);

  yield* chain(
    createIntroOutro(
      view,
      quiz.intro
    ),
    
    createScene(view, quiz),
    createIntroOutro(
      view,
      quiz.outro
    )  
  );

  // backgroundAudioRef().remove();
});

function animateTopic(textRef: Reference<Txt>, duration: number) {
  return all(
    tween(duration, (value) => {
      textRef().scale(map(0, 1, easeOutBounce(value)))
      textRef().opacity(1)
    }),
  );
}

function* createScene(view: View2D, quiz: Quiz) {

  const questions = quiz.quizzes;

  for (const question of questions) {

    yield* all(
      setSceneBackground(view, question.backgroundImage, question.totalDuration),
      chain(
        createQuestionSection(
        view,
        question.question.questionAudioUrl,
        question.question.text,
        question.backgroundImage,
        question.question.contentSettings
      ),
      createOptionsSection(
        view,
        question.options.optionsAudioUrl,
        question.options.optionData,
        question.backgroundImage,
        question.options.contentSettings
      ),
      displayVideo(
        view,
        "https://storage.googleapis.com/vidplus/media/others/countdown_1.webm",
        question.backgroundImage
      ),
      createAnswerSection(
        view,
        question.answer.answerAudioUrl,
        question.answer.text,
        question.backgroundImage,
        question.answer.contentSettings
      )
      
    )
  );
    
  }
}

function* displayVideo(view: View2D, videoUrl: string, background: string) {
  const videoRef = createRef<Video>();
  yield view.add(
    <>
      {/* <Img
        src={background}
        size={["100%", "100%"]}
        zIndex={0}
        opacity={0.4}
      /> */}
      <Video
        src={videoUrl}
        ref={videoRef}
        zIndex={2}
        play={true}
        height={"30%"}
      />
    </>
  );
  yield* waitFor(videoRef().getDuration());
  videoRef().remove();
}

function* createIntroOutro(view: View2D, section: IntroOutro) {
  const Audioref = createRef<Audio>();
  const textRef = createRef<Txt>();
  const backgroundRef = createRef<Img>();
  const backgroundSize = createSignal(["100%", "100%"]);



  yield view.add(
    
    <>
      <Rect
        width={"100%"}
        height={"100%"}
        fill={"black"}
        layout
        alignItems={"center"}
        justifyContent={"center"}
      ></Rect>
      <Audio src={section.audioUrl} ref={Audioref} play={true} volume={1} />

      <Img
        ref={backgroundRef}
        src={section.backgroundImage}
        size={["100%", "100%"]}
        // size={backgroundSize}
        zIndex={0}
        opacity={0.4}
      />
      <Txt
        fontSize={section.contentSettings.fontSize}
        fontWeight={section.contentSettings.fontWeight}
        fontFamily={section.contentSettings.fontFamily}
        textWrap={true}
        textAlign={section.contentSettings.textAlign}
        fill={section.contentSettings.fontColor}
        lineWidth={section.contentSettings.borderWidth}
        shadowBlur={section.contentSettings.shadowBlur}
        shadowColor={section.contentSettings.shadowColor}
        zIndex={2}
        stroke={section.contentSettings.borderColor}
        ref={textRef}
        opacity={0}
      >
        {section.text}
      </Txt>
    </>
  );


  
  yield* all(
    tween(0.5, (value) => {
      textRef().scale(map(0, 1, easeOutBounce(value)))
      textRef().opacity(1)
    }),
    // tween(Audioref().getDuration(), (value) => {
    //   backgroundRef().size(map(backgroundRef().height()*1.5, backgroundRef().width(), easeInOutCubic(value)))
    // }),
  );


  yield* waitFor(Audioref().getDuration());

  textRef().remove();
  // backgroundRef().remove();
  Audioref().remove();
}

function* createQuestionSection(view: View2D, audioUrl: string, text: string, background: string, contentSettings: ContentSettings) {
  const Audioref = createRef<Audio>();
  const textRef = createRef<Txt>();
  const backgroundRef = createRef<Img>();

  yield view.add(
    <>
    {/* <Rect
        width={"100%"}
        height={"100%"}
        fill={"black"}
        layout
        alignItems={"center"}
        justifyContent={"center"}
      ></Rect> */}
      <Audio src={audioUrl} ref={Audioref} play={true} volume={1} />
      {/* <Img
        ref={backgroundRef}
        src={background}
        size={["100%", "100%"]}
        zIndex={0}
        opacity={0.4}
      /> */}
      <Txt
        fontSize={contentSettings.fontSize}
        fontWeight={contentSettings.fontWeight}
        fontFamily={contentSettings.fontFamily}
        textWrap={true}
        textAlign={contentSettings.textAlign}
        fill={contentSettings.fontColor}
        lineWidth={contentSettings.borderWidth}
        shadowBlur={contentSettings.shadowBlur}
        shadowColor={contentSettings.shadowColor}
        zIndex={2}
        stroke={contentSettings.borderColor}
        ref={textRef}
        opacity={0}
      >
        {text}
      </Txt>
    </>
  );

  yield* animateTopic(textRef, 0.5);

  yield* waitFor(Audioref().getDuration());

  textRef().remove();
  // backgroundRef().remove();
  Audioref().remove();
}

function* createOptionsSection(view: View2D, audioUrl: string, options: string[], background: string, contentSettings: ContentSettings) {
  const Audioref = createRef<Audio>();
  const textRef = createRef<Txt>();
  const backgroundRef = createRef<Img>();

  yield view.add(
    <>
    {/* <Rect
        width={"100%"}
        height={"100%"}
        fill={"black"}
        layout
        alignItems={"center"}
        justifyContent={"center"}
      ></Rect> */}
      <Audio src={audioUrl} ref={Audioref} play={true} volume={1} />
      {/* <Img
        ref={backgroundRef}
        src={background}
        size={["100%", "100%"]}
        zIndex={0}
        opacity={0.4}
      /> */}
      <Txt
        text={options.join("\n")}
        fontSize={contentSettings.fontSize}
        fontWeight={contentSettings.fontWeight}
        lineHeight={100}
        fontFamily={contentSettings.fontFamily}
        // textWrap={true}
        textAlign={contentSettings.textAlign}
        fill={contentSettings.fontColor}
        lineWidth={contentSettings.borderWidth}
        shadowBlur={contentSettings.shadowBlur}
        shadowColor={contentSettings.shadowColor}
        zIndex={2}
        stroke={contentSettings.borderColor}
        ref={textRef}
      />
    </>
  );

  yield* waitFor(Audioref().getDuration());

  textRef().remove();
  // backgroundRef().remove();
  Audioref().remove();
}

function* createAnswerSection(view: View2D, audioUrl: string, text: string, background: string, contentSettings: ContentSettings) {
  const Audioref = createRef<Audio>();
  const textRef = createRef<Txt>();
  const backgroundRef = createRef<Img>();

  yield view.add(
    <>
    {/* <Rect
        width={"100%"}
        height={"100%"}
        fill={"black"}
        layout
        alignItems={"center"}
        justifyContent={"center"}
      ></Rect> */}
      <Audio src={audioUrl} ref={Audioref} play={true} volume={1} />
      {/* <Img
        ref={backgroundRef}
        src={background}
        size={["100%", "100%"]}
        zIndex={0}
        opacity={0.4}
      /> */}
      <Txt
        fontSize={contentSettings.fontSize}
        fontWeight={contentSettings.fontWeight}
        fontFamily={contentSettings.fontFamily}
        textWrap={true}
        textAlign={contentSettings.textAlign}
        fill={contentSettings.fontColor}
        lineWidth={contentSettings.borderWidth}
        shadowBlur={contentSettings.shadowBlur}
        shadowColor={contentSettings.shadowColor}
        zIndex={2}
        stroke={contentSettings.borderColor}
        ref={textRef}
      >
        {text}
      </Txt>
    </>
  );

  yield* waitFor(Audioref().getDuration());

  textRef().remove();
  // backgroundRef().remove();
  Audioref().remove();
}


function* setSceneBackground(view: View2D,  background: string, duration: number) {

  const backgroundRef = createRef<Img>();
  yield view.add(
    <>
    <Rect
        width={"100%"}
        height={"100%"}
        fill={"black"}
        layout
        alignItems={"center"}
        justifyContent={"center"}
      ></Rect>
      <Img
        ref={backgroundRef}
        src={background}
        size={["100%", "100%"]}
        zIndex={0}
        opacity={0.4}
      />
      
    </>
  );
  
  // Define the area to zoom into (center of the image)
  const sceneWidth = 1920;
  const sceneHeight = 1080;
  const zoomWidth = sceneWidth * 3/4;
  const zoomHeight = sceneHeight * 3/4;
  const zoomArea = new BBox(
    -zoomWidth / 2,
    -zoomHeight / 2,
    zoomWidth,
    zoomHeight
  );

  yield* zoomOutTransition(new BBox(500, 500, 1920, 1080),0.5);
  // yield* pixelateTransition();

  yield* waitFor(duration+1);
  backgroundRef().remove();
}
