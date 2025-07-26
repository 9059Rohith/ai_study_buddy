import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { usePDFExtractor } from '../hooks/usePDFExtractor';

const FileUploader = ({ onFileProcessed }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { extractText, extracting, progress, error } = usePDFExtractor();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    // Validate file size
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('File size must be less than 50MB.');
      return;
    }

    try {
      setUploadedFile(file);
      
      // Handle different file types
      let result;
      if (file.type === 'application/pdf') {
        result = await extractText(file);
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        result = {
          text: text,
          pages: 1,
          fileName: file.name
        };
      } else {
        // Try to extract text anyway - many file types can be read as text
        try {
          const text = await file.text();
          result = {
            text: text,
            pages: 1,
            fileName: file.name
          };
        } catch {
          alert('Unsupported file format. Please upload PDF or text files.');
          return;
        }
      }
      
      onFileProcessed(result);
    } catch (err) {
      console.error('Error processing file:', err);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-border hover:border-primary/50 hover:bg-muted/30'
        } ${extracting ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !extracting && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.doc,.docx,*"
          onChange={handleFileInput}
          className="hidden"
          disabled={extracting}
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={`w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center ${
              dragActive ? 'scale-110' : ''
            } transition-transform duration-300`}>
              <Upload className="w-8 h-8 text-white" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Upload Your Document</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your document here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Maximum file size: 50MB • Supports PDF, TXT, DOC, and more
            </p>
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {extracting && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div>
              <h4 className="font-medium">Processing Document...</h4>
              <p className="text-sm text-muted-foreground">Processing your document</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Success */}
      {uploadedFile && !extracting && !error && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-800 dark:text-green-400 mb-1">
                File Uploaded Successfully
              </h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><FileText className="w-4 h-4 inline mr-1" />{uploadedFile.name}</p>
                <p>Size: {formatFileSize(uploadedFile.size)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-destructive mb-1">Upload Failed</h4>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;