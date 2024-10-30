import OpenAI from "openai";
import { Job } from "bull";
import { quizQueue } from "./queueConfig";
import { generateImage } from "./imageGenerator";
import { generateAudio } from "./audioGenerator";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function processQuizJob(job: Job) {
  try {
    console.log(`Processing job ${job.id}`);
    const { topic, numberOfQuestions } = job.data;
    console.log('Job data:', job.data);
    console.log('Topic#:', topic, 'Number of Questions:', numberOfQuestions);
   
    
    // Step 1: Generate quiz content
    console.log('Generating quiz content');
    const quizContent = await generateQuizContent(topic, numberOfQuestions);
    await job.progress(25);

    // Step 2: Generate images for intro, outro, and questions
    console.log('Generating images');
    const quizWithImages = await generateQuizImages(quizContent);
    await job.progress(50);

    // Step 3: Generate audio for intro, outro, questions, and answers
    console.log('Generating audio');
    const finalQuiz = await generateQuizAudio(quizWithImages);
    await job.progress(75);

    // Step 4: Save the final result
    console.log('Saving final quiz result');
    await job.update({ result: finalQuiz });
    await job.progress(100);

    console.log('Quiz generation completed');
    return finalQuiz;
  } catch (error: unknown) {
    console.error("Error in quiz generation:", error);
    throw error;
  }
}

// Move the process handler outside of generateQuiz function
quizQueue.process(async (job) => {
  try {
    const result = await processQuizJob(job);
    await job.moveToCompleted(result);
  } catch (error) {
    await job.moveToFailed(error as Error);
  }
});

export async function generateQuiz(topic: string, numberOfQuestions: number): Promise<string> {
  console.log(`Generating quiz for topic: ${topic}`);
  const job = await quizQueue.add({ topic, numberOfQuestions }, {
    removeOnComplete: false,
    removeOnFail: false
  });
  console.log(`Job added to queue with ID: ${job.id}`);

  // Return the job ID immediately, converted to string
  return job.id.toString();
}

async function generateQuizContent(topic: string, numberOfQuestions: number = 1) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": "You are a helpful assistant that generates quiz content. Generate a quiz with multiple-choice questions, each having 4 options (A-D).\"  \n\nNote: response only in the follow JSON format and nothing else: {\n  \"quiz\": {\n    \"topic\": {\n      \"text\": \"\"\n    },\n    \"intro\": {\n      \"text\":\"\",\n      \"audioUrl\":\"\",\n      \"backgroundImage\":\"\"\n    },\n    \"outro\": {\n      \"text\":\"\",\n      \"audioUrl\":\"\",\n      \"backgroundImage\":\"\"\n    },\n    \"quizzes\": [\n      {\n        \"answer\": {\n          \"text\": \"\",\n          \"answerAudioUrl\":\"\"\n        },\n        \"backgroundImage\": \"\",\n        \"options\": {\n          \"optionData\": [],\n          \"optionsAudioUrl\":\"\"\n        },\n        \"question\": {\n          \"text\": \"\",\n          \"questionAudioUrl\": \"\"\n        }\n      }\n    ]\n  }\n}"
          }
        ]
      },
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": `Generate a quiz about ${topic} with ${numberOfQuestions} multiple-choice questions.`
          }
        ]
      }
    ],
    temperature: 0.5,
    max_tokens: 4095,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      "type": "json_object"
    },
  });

  const content = response.choices[0].message.content;
  
  if (!content) {
    throw new Error("No content returned from OpenAI");
  }

  try {
    const quizContent = JSON.parse(content);
    console.log("Parsed quiz content:", JSON.stringify(quizContent, null, 2));
    return quizContent;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.error("Problematic content:", content);
    throw new Error("Failed to parse quiz content as JSON");
  }
}

async function generateQuizImages(quizContent: any) {
  quizContent.quiz.intro.backgroundImage = await generateImage(quizContent.quiz.intro.text);
  quizContent.quiz.outro.backgroundImage = await generateImage(quizContent.quiz.outro.text);
  
  for (const question of quizContent.quiz.quizzes) {
    question.backgroundImage = await generateImage(question.question.text);
  }
  return quizContent;
}

async function generateQuizAudio(quizContent: any) {
  quizContent.quiz.intro.audioUrl = await generateAudio(quizContent.quiz.intro.text);
  quizContent.quiz.outro.audioUrl = await generateAudio(quizContent.quiz.outro.text);
  
  for (const question of quizContent.quiz.quizzes) {
    question.question.questionAudioUrl = await generateAudio(question.question.text);
    question.answer.answerAudioUrl = await generateAudio(question.answer.text);
    question.options.optionsAudioUrl = await generateAudio(question.options.optionData.join(". "));
  }
  return quizContent;
}
