import { marked } from "marked";

export const renderMarkdownToHtml = async (markdown: string): Promise<string> => {
  return await marked(markdown);
};

export const checkGrammarWithAPI = async (content: string) => {
  const response = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      text: content,
      language: "es" // o "en-US"
    })
  });

  if (!response.ok) {
    throw new Error("Error calling grammar API");
  }

  return response.json();
};
