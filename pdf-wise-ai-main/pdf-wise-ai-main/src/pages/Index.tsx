import { useState } from 'react';
import Layout from '../components/Layout';
import FileUploader from '../components/FileUploader';
import DocumentSummary from '../components/DocumentSummary';
import ChatInterface from '../components/ChatInterface';
import StudyPlan from '../components/StudyPlan';
import { useLocalStorage } from '../hooks/useLocalStorage';
import heroImage from '../assets/hero-image.jpg';
import { BookOpen, Brain, MessageSquare, Target } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [documentData, setDocumentData] = useLocalStorage('currentDocument', null);

  const handleFileProcessed = (data) => {
    setDocumentData(data);
    setActiveTab('summary');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return <FileUploader onFileProcessed={handleFileProcessed} />;
      case 'summary':
        return <DocumentSummary documentData={documentData} />;
      case 'chat':
        return <ChatInterface documentData={documentData} />;
      case 'plan':
        return <StudyPlan documentData={documentData} />;
      default:
        return <FileUploader onFileProcessed={handleFileProcessed} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Hero Section - Only show when no document is uploaded */}
      {!documentData && activeTab === 'upload' && (
        <div className="mb-12 relative overflow-hidden rounded-2xl">
          <div className="relative">
            <img 
              src={heroImage} 
              alt="AI-powered learning" 
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
            <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Transform Your Study Experience
                </h1>
                <p className="text-xl md:text-2xl opacity-90 mb-6">
                  Upload your PDFs and let AI create summaries, answer questions, and build personalized study plans
                </p>
                <div className="flex flex-wrap justify-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>PDF Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    <span>AI Summaries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Interactive Chat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <span>Study Plans</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {renderTabContent()}
      </div>
    </Layout>
  );
};

export default Index;
