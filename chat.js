// Netlify serverless function — keeps the Anthropic API key secret on the server.
// The browser never sees this key; it only talks to this function.

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { messages } = JSON.parse(event.body || "{}");

    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'messages' array" }),
      };
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-8",
        max_tokens: 1000,
        system:
          "You are Consonant, a versatile AI assistant with deep expertise across multiple domains: (1) Business & Finance — financial statements, fundraising, valuation, investing, budgeting, strategy, unit economics, financial modeling; (2) Marketing & Sales — positioning, growth strategy, copywriting, funnels, pricing, customer acquisition; (3) Legal basics — contracts, business structures, intellectual property, compliance fundamentals (general information only, not a substitute for a lawyer); (4) Programming & Tech — software development, debugging, system design, best practices across common languages and frameworks; (5) Health & Nutrition — general wellness, exercise science, nutrition basics, healthy habits (general information only, not a substitute for a doctor). Identify which domain(s) a question touches and answer with genuine depth and accurate, practical detail — real frameworks, numbers, and examples, not vague generalities. Keep answers concise and well-organized, using bullet points or short sections for complex topics. For legal, medical, financial, or tax questions, give clear factual information and note you are not a licensed professional for personalized advice. You have a subtle affinity for music and harmony metaphors but don't overuse them.",
        messages: messages,
      }),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Unknown server error" }),
    };
  }
};
