## Task 1: Code generate_image function

### API for Image Generation:

The image generations endpoint allows you to create an original image given a text prompt. When using **DALL·E 3**, images can have a size of **1024x1024**, **1024x1792**, or **1792x1024** pixels.

### Example:
```javascript
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: "a white siamese cat",
  n: 1,
  size: "1024x1024",
});
image_url = response.data[0].url;
```


## Task 2: Code generate_audio function

### API for Audio Generation:
The speech endpoint takes in three key inputs: the model, the text that should be turned into audio, and the voice to be used for the audio generation. A simple request would look like the following:

### Example:
```javascript
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const speechFile = path.resolve("./speech.mp3");

const mp3 = await openai.audio.speech.create({
  model: "tts-1",
  input: "Hello, how are you?",
  voice: "alloy",
});
const buffer = Buffer.from(await mp3.arrayBuffer());
await fs.promises.writeFile(speechFile, buffer);
```

## Task 3: Code generate_quiz function
The function for quiz generation by choosing a random topic and follow the data structure in `src/data_structure.txt`.
Since this process will take a long time, we need to implement a queue system to keep the process running and return the 
the intermediate results to frontend as the process continues. We can use `bull` to implement the queue system. And we can use `bull-board` to visualize the queue system. This function uses the above two functions to generate the quiz.


### Current Directory Structure:
```bash
.
├── README.md
├── ToDo.md
├── instructions.md
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── generate-audio
│   │   │   │   └── route.ts
│   │   │   ├── generate-image
│   │   │   │   └── route.ts
│   │   │   ├── quiz
│   │   │   │   └── route.ts
│   │   │   └── render
│   │   │       └── route.ts
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── fonts
│   │   │   ├── GeistMonoVF.woff
│   │   │   └── GeistVF.woff
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── AudioControl.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── BackgroundImageControl.tsx
│   │   ├── BackgroundStyleSelector.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── ContentSettings.tsx
│   │   ├── FontSelector.tsx
│   │   ├── Header.tsx
│   │   ├── HookSelector.jsx
│   │   ├── IntroOutroSection.tsx
│   │   ├── IntroOutroSectionWrapper.tsx
│   │   ├── QuizControls.tsx
│   │   ├── QuizPreview.tsx
│   │   ├── QuizQuestions.jsx
│   │   ├── QuizQuestions.tsx
│   │   ├── TabSelector.tsx
│   │   └── TopicInput.tsx
│   ├── data_structure.txt
│   ├── hooks
│   │   └── useQuizData.ts
│   ├── metadata.json
│   ├── metadata1.json
│   ├── metadatanew.json
│   ├── types
│   │   └── quizTypes.ts
│   └── utils
│       ├── quizUtils.ts
│       └── videoExport.ts
├── tailwind.config.ts
└── tsconfig.json
```
Note: OPENAI_API_KEY should be set in .env file.




