import { useState, useEffect } from 'react';
import { Brain, RefreshCw, Download, Sparkles } from 'lucide-react';
import { useGemini } from '../hooks/useGemini';

const DocumentSummary = ({ documentData }) => {
  const [summary, setSummary] = useState('');
  const { generateSummary, loading, error } = useGemini();

  useEffect(() => {
    if (documentData?.text && !summary) {
      handleGenerateSummary();
    }
  }, [documentData]);

  const handleGenerateSummary = async () => {
    if (!documentData?.text) return;

    try {
      const generatedSummary = await generateSummary(documentData.text);
      setSummary(generatedSummary);
    } catch (err) {
      console.error('Error generating summary:', err);
    }
  };

  const handleDownload = () => {
    const content = `Document Summary: ${documentData?.fileName}\n\n${summary}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentData?.fileName || 'document'}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!documentData) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No Document Uploaded</h3>
        <p className="text-muted-foreground">Upload a PDF to generate an AI summary</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-secondary" />
            AI Document Summary
          </h2>
          <p className="text-muted-foreground mt-1">
            Key insights from {documentData.fileName}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
          
          {summary && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Document Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="font-medium text-sm text-muted-foreground mb-1">Document</h4>
          <p className="font-semibold truncate" title={documentData.fileName}>
            {documentData.fileName}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="font-medium text-sm text-muted-foreground mb-1">Pages Analyzed</h4>
          <p className="font-semibold">{documentData.pages}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="font-medium text-sm text-muted-foreground mb-1">Word Count</h4>
          <p className="font-semibold">{documentData.text?.split(' ').length || 0}</p>
        </div>
      </div>

      {/* Summary Content */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="font-medium mb-2">Generating Summary...</h3>
            <p className="text-muted-foreground">AI is analyzing your document</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="font-medium text-destructive mb-2">Summary Generation Failed</h3>
            <p className="text-destructive/80 text-sm mb-4">{error}</p>
            <button
              onClick={handleGenerateSummary}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : summary ? (
          <div className="p-6">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed">
                {summary}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">Ready to Generate Summary</h3>
            <p className="text-muted-foreground mb-4">Click the generate button to create an AI summary</p>
            <button
              onClick={handleGenerateSummary}
              className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Generate Summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSummary;