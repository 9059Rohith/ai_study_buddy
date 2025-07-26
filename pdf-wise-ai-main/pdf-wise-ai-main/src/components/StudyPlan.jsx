import { useState, useEffect } from 'react';
import { Target, Clock, CheckCircle, Circle, RefreshCw, Calendar } from 'lucide-react';
import { useGemini } from '../hooks/useGemini';
import { useLocalStorage } from '../hooks/useLocalStorage';

const StudyPlan = ({ documentData }) => {
  const [studyPlan, setStudyPlan] = useState('');
  const [completedTasks, setCompletedTasks] = useLocalStorage('studyPlan_completed', []);
  const { generateStudyPlan, loading, error } = useGemini();

  useEffect(() => {
    if (documentData?.text && !studyPlan) {
      handleGenerateStudyPlan();
    }
  }, [documentData]);

  const handleGenerateStudyPlan = async () => {
    if (!documentData?.text) return;

    try {
      const plan = await generateStudyPlan(documentData.text);
      setStudyPlan(plan);
    } catch (err) {
      console.error('Error generating study plan:', err);
    }
  };

  const parsePlanTasks = (planText) => {
    if (!planText) return [];
    
    const lines = planText.split('\n').filter(line => line.trim());
    const tasks = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.match(/^[\d\-\*\•]/) || trimmed.includes('Week') || trimmed.includes('Day') || trimmed.includes('Topic')) {
        tasks.push({
          id: index,
          text: trimmed.replace(/^[\d\-\*\•\s]+/, ''),
          completed: completedTasks.includes(index)
        });
      }
    });
    
    return tasks;
  };

  const toggleTaskCompletion = (taskId) => {
    const newCompleted = completedTasks.includes(taskId)
      ? completedTasks.filter(id => id !== taskId)
      : [...completedTasks, taskId];
    
    setCompletedTasks(newCompleted);
  };

  const tasks = parsePlanTasks(studyPlan);
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  if (!documentData) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No Document Uploaded</h3>
        <p className="text-muted-foreground">Upload a PDF to generate a personalized study plan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-accent" />
            Study Plan
          </h2>
          <p className="text-muted-foreground mt-1">
            Personalized learning roadmap for {documentData.fileName}
          </p>
        </div>
        
        <button
          onClick={handleGenerateStudyPlan}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Regenerate
        </button>
      </div>

      {/* Progress Overview */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Total Tasks</h4>
            <p className="font-semibold text-2xl">{tasks.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Completed</h4>
            <p className="font-semibold text-2xl">{completedTasks.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Progress</h4>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-2xl">{Math.round(completionRate)}%</p>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Study Plan Content */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="font-medium mb-2">Creating Study Plan...</h3>
            <p className="text-muted-foreground">AI is analyzing your document to create a personalized plan</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="font-medium text-destructive mb-2">Plan Generation Failed</h3>
            <p className="text-destructive/80 text-sm mb-4">{error}</p>
            <button
              onClick={handleGenerateStudyPlan}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : studyPlan ? (
          <div className="p-6">
            {tasks.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold">Interactive Study Tasks</h3>
                </div>
                
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-muted/30 ${
                      task.completed 
                        ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' 
                        : 'border-border'
                    }`}
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    <button className="mt-0.5">
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`leading-relaxed ${
                        task.completed 
                          ? 'line-through text-muted-foreground' 
                          : ''
                      }`}>
                        {task.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {studyPlan}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">Ready to Create Study Plan</h3>
            <p className="text-muted-foreground mb-4">Generate a personalized study plan based on your document</p>
            <button
              onClick={handleGenerateStudyPlan}
              className="px-6 py-3 bg-gradient-accent text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Generate Study Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlan;