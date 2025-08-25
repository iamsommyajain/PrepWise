import { getRandomInterviewCover } from "@/lib/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from '@/firebase/admin';

export async function GET() {
  return Response.json({
    success: true,
    data: "Thank You!"
  }, { status: 200 });
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const prompt = `
      Prepare questions for a job interview. 
      The job role is ${role}. 
      The job experience level is ${level}. 
      The tech stack used in the job is ${techstack}. 
      The number of questions to be generated is ${amount}. 
      The focus between behavioural and technical questions should lean towards: ${type}. 
      Please return only the questions without any additional text. 
      The questions are going to be read by a voice assistant so do not use "/" or "*" or any other characters which might break the voice assistant. 
      Return the questions in the following format : ["Question 1", "Question 2", "Question 3", ... "Question N"].
      Thank you!
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();  
    text = text.replace(/```json|```/g, "").trim();

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: JSON.parse(text),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });

  } catch (error:any) {
    console.error(error);
    return Response.json({ success: false, error:error.message }, { status: 500 });
  }
}
