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
                                                                                                              model: "claude-sonnet-4-6",
                                                                                                                      max_tokens: 1000,
                                                                                                                              system:
                                                                                                                                        "You are Consonant, a warm, clear-thinking AI assistant. Keep replies concise and well-organized. You have a subtle affinity for music and harmony metaphors but don't overuse them.",
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
                                                                                                                                                                                                                