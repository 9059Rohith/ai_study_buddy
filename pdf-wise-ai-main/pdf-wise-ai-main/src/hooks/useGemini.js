import { useState } from 'react';

const GEMINI_API_KEY = 'AIzaSyDBQyzqtAquY2ZUvUZoqYKP4uiJ63ih3JQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateContent = async (prompt, context = '') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: context ? `Context: ${context}\n\nQuery: ${prompt}` : prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
      
      setLoading(false);
      return generatedText;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const generateSummary = async (text) => {
    const prompt = `Summarize the following academic document in 3-5 clear bullet points, focusing on key concepts and main ideas:\n\n${text}`;
    return await generateContent(prompt);
  };

  const chatWithDocument = async (question, documentContext) => {
    const prompt = `You are a helpful study assistant. Based on the provided document context, answer the following question clearly and educationally. If the answer isn't in the context, say so and provide general guidance.\n\nQuestion: ${question}`;
    return await generateContent(prompt, documentContext);
  };

  const generateStudyPlan = async (content, preferences = {}) => {
    const prompt = `Create a structured study plan based on this document content. Include main topics, subtopics, and a suggested study timeline. Format as a clear, actionable plan with specific time estimates:\n\n${content}`;
    return await generateContent(prompt);
  };

  return { 
    generateContent, 
    generateSummary, 
    chatWithDocument, 
    generateStudyPlan, 
    loading, 
    error 
  };
};