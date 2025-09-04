const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `
  You are an code reviewer.

Review the provided code and give a clear, structured, and concise review.

In your response:

Use bullet points for issues and improvements.

Keep explanations short and focused (no long essays).

Provide corrected code snippets only where needed.

Cover:

Bugs or potential runtime issues

Readability & maintainability improvements

Performance optimizations (if relevant)

Security concerns (if relevant)

Best practices & clean code suggestions

End with a short summary of the most important changes.

Keep the review professional, constructive, and easy to read — like a code review comment on GitHub/PR.

    `,
});

async function generateContent(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = generateContent;
