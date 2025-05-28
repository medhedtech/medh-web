"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Code, Link2, Image as ImageIcon, Quote, Heading, Undo, Redo, Eye, Edit3, HelpCircle } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import clsx from 'clsx';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  minHeight?: string;
  readOnly?: boolean;
  showToolbar?: boolean;
  showPreviewToggle?: boolean;
  onBlur?: () => void;
  className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write something...',
  height = '400px',
  minHeight = '200px',
  readOnly = false,
  showToolbar = true,
  showPreviewToggle = true,
  onBlur,
  className = '',
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{ start: number; end: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Track changes for undo/redo
  useEffect(() => {
    if (value !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(value);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [value]);

  // Focus the textarea when needed
  useEffect(() => {
    if (cursorPosition && textareaRef.current && !showPreview) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(cursorPosition.start, cursorPosition.end);
      setCursorPosition(null);
    }
  }, [cursorPosition, showPreview]);

  // Handle toolbar button clicks
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    if (showPreview || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // Handle special case for lists - we need to check if there's a newline before
    let insertText = '';
    if ((prefix === '- ' || prefix === '1. ') && start > 0 && value[start - 1] !== '\n') {
      insertText = '\n' + prefix + selectedText + suffix;
    } else {
      insertText = prefix + selectedText + suffix;
    }
    
    const newValue = value.substring(0, start) + insertText + value.substring(end);
    onChange(newValue);
    
    // Set cursor position for after the update
    setCursorPosition({
      start: start + prefix.length,
      end: start + prefix.length + selectedText.length,
    });
  };

  const handleBold = () => insertMarkdown('**', '**');
  const handleItalic = () => insertMarkdown('*', '*');
  const handleUnorderedList = () => insertMarkdown('- ');
  const handleOrderedList = () => insertMarkdown('1. ');
  const handleCode = () => insertMarkdown('`', '`');
  const handleCodeBlock = () => insertMarkdown('```\n', '\n```');
  const handleQuote = () => insertMarkdown('> ');
  const handleHeading = () => insertMarkdown('## ');
  
  const handleLink = () => {
    const selectedText = getSelectedText();
    const linkText = selectedText || 'link text';
    insertMarkdown(`[${linkText}](`, ')');
  };
  
  const handleImage = () => {
    const selectedText = getSelectedText();
    const altText = selectedText || 'image description';
    insertMarkdown(`![${altText}](`, ')');
  };

  const getSelectedText = (): string => {
    if (!textareaRef.current) return '';
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    return value.substring(start, end);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onChange(history[historyIndex - 1]);
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onChange(history[historyIndex + 1]);
    }
  };

  return (
    <div className={clsx("rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800", className)}>
      {showToolbar && (
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800/80 flex-wrap gap-1">
          <button 
            onClick={handleBold}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Bold"
            disabled={showPreview}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button 
            onClick={handleItalic}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Italic"
            disabled={showPreview}
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="h-4 border-r border-gray-300 dark:border-gray-600 mx-0.5"></div>
          <button 
            onClick={handleHeading}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Heading"
            disabled={showPreview}
          >
            <Heading className="w-4 h-4" />
          </button>
          <button 
            onClick={handleUnorderedList}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Bullet List"
            disabled={showPreview}
          >
            <List className="w-4 h-4" />
          </button>
          <button 
            onClick={handleOrderedList}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Numbered List"
            disabled={showPreview}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <div className="h-4 border-r border-gray-300 dark:border-gray-600 mx-0.5"></div>
          <button 
            onClick={handleCode}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Inline Code"
            disabled={showPreview}
          >
            <Code className="w-4 h-4" />
          </button>
          <button 
            onClick={handleCodeBlock}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Code Block"
            disabled={showPreview}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
          </button>
          <button 
            onClick={handleQuote}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Quote"
            disabled={showPreview}
          >
            <Quote className="w-4 h-4" />
          </button>
          <div className="h-4 border-r border-gray-300 dark:border-gray-600 mx-0.5"></div>
          <button 
            onClick={handleLink}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Link"
            disabled={showPreview}
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleImage}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Image"
            disabled={showPreview}
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <div className="h-4 border-r border-gray-300 dark:border-gray-600 mx-0.5"></div>
          <button 
            onClick={handleUndo}
            className={`p-1.5 rounded transition-colors ${
              historyIndex > 0 && !showPreview
                ? 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                : 'text-gray-400 dark:text-gray-600 cursor-default'
            }`}
            title="Undo"
            disabled={historyIndex === 0 || showPreview}
          >
            <Undo className="w-4 h-4" />
          </button>
          <button 
            onClick={handleRedo}
            className={`p-1.5 rounded transition-colors ${
              historyIndex < history.length - 1 && !showPreview
                ? 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                : 'text-gray-400 dark:text-gray-600 cursor-default'
            }`}
            title="Redo"
            disabled={historyIndex === history.length - 1 || showPreview}
          >
            <Redo className="w-4 h-4" />
          </button>
          
          <div className="flex-1"></div>
          
          <button 
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            title="Markdown Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          
          {showPreviewToggle && (
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className={`p-1.5 rounded flex items-center gap-1 transition-colors ${
                showPreview 
                  ? 'bg-primaryColor/10 text-primaryColor'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title={showPreview ? "Edit" : "Preview"}
            >
              {showPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-xs font-medium hidden sm:inline-block">
                {showPreview ? "Edit" : "Preview"}
              </span>
            </button>
          )}
        </div>
      )}
      
      <div className="relative" style={{ height, minHeight }}>
        {showPreview ? (
          <div 
            className="prose dark:prose-invert prose-sm sm:prose-base max-w-none p-4 h-full overflow-auto"
            style={{ minHeight }}
          >
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(value)) }} />
            ) : (
              <div className="text-gray-400 italic">No content to preview</div>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 border-none focus:ring-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none font-mono text-sm leading-relaxed"
            style={{ minHeight }}
            readOnly={readOnly}
            onBlur={onBlur}
          />
        )}
      </div>
      
      {/* Markdown Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Markdown Cheatsheet</h3>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                &times;
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Basic Formatting</h4>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">**Bold Text**</p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">*Italic Text*</p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">## Heading</p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">[Link Text](https://example.com)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Lists & Quotes</h4>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">- Bullet point</p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">1. Numbered item</p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{'>'} Quote block</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Code</h4>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">`inline code`</p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">```<br/>code block<br/>```</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Media</h4>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">![Alt text](image-url.jpg)</p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">---<br/>Horizontal line</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">For more extensive Markdown syntax, check out the <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer" className="text-primaryColor hover:underline">Markdown Guide</a>.</p>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button 
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor; 