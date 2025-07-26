import { Brain, BookOpen, MessageSquare, Target } from 'lucide-react';

const Layout = ({ children, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'upload', label: 'Upload', icon: BookOpen },
    { id: 'summary', label: 'Summary', icon: Brain },
    { id: 'chat', label: 'Study Chat', icon: MessageSquare },
    { id: 'plan', label: 'Study Plan', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  EduAI Study Buddy
                </h1>
                <p className="text-sm text-muted-foreground">AI-Powered Learning Assistant</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 bg-card/50 backdrop-blur-sm p-2 rounded-xl border border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;