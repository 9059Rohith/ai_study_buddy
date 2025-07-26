import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker with compatible version
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const usePDFExtractor = () => {
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const extractText = async (file, maxPages = 10) => {
    setExtracting(true);
    setProgress(0);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const numPages = Math.min(pdf.numPages, maxPages);
      
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
        
        setProgress((pageNum / numPages) * 100);
      }

      setExtracting(false);
      return {
        text: fullText.trim(),
        pages: numPages,
        fileName: file.name
      };
    } catch (err) {
      setError('Could not process PDF - trying as text file...');
      
      // Fallback: try to read as text
      try {
        const text = await file.text();
        setExtracting(false);
        return {
          text: text || 'No text could be extracted from this file.',
          pages: 1,
          fileName: file.name
        };
      } catch {
        setError('Failed to extract text. Please try a different file.');
        setExtracting(false);
        throw new Error('File processing failed');
      }
    }
  };

  return { extractText, extracting, progress, error };
};