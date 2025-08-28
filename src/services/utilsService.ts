import { marked } from "marked";

const obtainLanguageCode = (language?: string):string => {
  const defaultLangueage = "es"
  if(!language) return defaultLangueage
  else if(language.toUpperCase()==="SPANISH") return "es"
  else if(language.toUpperCase()==="ENGLISH") return "en-US"
  else return defaultLangueage
}

export const renderMarkdownToHtml = async (markdown: string): Promise<string> => {
  return await marked(markdown);
};

export const checkGrammarWithAPI = async (content: string, language?: string) => {
  const grammarLanguageCode = obtainLanguageCode(language);

  // consideration: change fetch for axios
  const response = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      text: content,
      language: grammarLanguageCode
    })
  });

  if (!response.ok) {
    throw new Error("Error calling grammar API");
  }

  return response.json();
};
