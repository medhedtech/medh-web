"use client";

import React, { forwardRef, useEffect, useState, useRef } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Link, Image, Code } from "lucide-react";

// Enhanced loading component
const EditorLoading = () => (
  <div className="h-[300px] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
      <span className="text-sm">Loading editor...</span>
    </div>
  </div>
);

interface ISimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  theme?: string;
  modules?: any;
  preserveWhitespace?: boolean;
  onFocus?: () => void;
}

// Simple Rich Text Editor Component (React 18 Compatible)
const SimpleRichTextEditor = forwardRef<HTMLTextAreaElement, ISimpleEditorProps>(
  ({ value, onChange, placeholder, className, onFocus }, ref) => {
    const [isMounted, setIsMounted] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isDark, setIsDark] = useState(true);
    const [internalValue, setInternalValue] = useState(value || '');

    useEffect(() => {
      setIsMounted(true);
      // Detect theme from document or use default
      const theme = document.documentElement.classList.contains('dark') || 
                   document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDark(theme);
    }, []);

    // Update internal value when prop changes (important for AI content updates)
    useEffect(() => {
      if (value !== internalValue) {
        console.log('NoSSRQuill: Value prop changed from', internalValue.length, 'to', value.length, 'chars');
        setInternalValue(value || '');
        
        // Force textarea to update if it exists
        if (textareaRef.current) {
          textareaRef.current.value = value || '';
        }
      }
    }, [value, internalValue]);

    // Don't render anything on the server or before mounting
    if (!isMounted) {
      return <EditorLoading />;
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange(newValue);
    };

    const insertText = (before: string, after: string = '') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = internalValue.substring(start, end);
      const newText = internalValue.substring(0, start) + before + selectedText + after + internalValue.substring(end);
      
      setInternalValue(newText);
      onChange(newText);
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
      }, 0);
    };

    const toolbarButtons = [
      { icon: Bold, action: () => insertText('**', '**'), title: 'Bold' },
      { icon: Italic, action: () => insertText('*', '*'), title: 'Italic' },
      { icon: Underline, action: () => insertText('<u>', '</u>'), title: 'Underline' },
      { icon: List, action: () => insertText('\n- '), title: 'Bullet List' },
      { icon: ListOrdered, action: () => insertText('\n1. '), title: 'Numbered List' },
      { icon: Link, action: () => insertText('[', '](url)'), title: 'Link' },
      { icon: Image, action: () => insertText('![alt text](', ')'), title: 'Image' },
      { icon: Code, action: () => insertText('`', '`'), title: 'Code' },
    ];

    return (
      <div className={`simple-editor-wrapper ${className || ''}`}>
        {/* Toolbar */}
        <div className={`flex items-center gap-1 p-2 border-b rounded-t-xl ${
          isDark 
            ? 'bg-white/5 border-white/10' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          {toolbarButtons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={button.action}
                title={button.title}
                className={`p-2 rounded-md transition-colors hover:scale-105 ${
                  isDark 
                    ? 'hover:bg-white/10 text-gray-300 hover:text-white' 
                    : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent size={16} />
              </button>
            );
          })}
        </div>

        {/* Text Area */}
        <textarea
          ref={(node) => {
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            if (textareaRef) {
              textareaRef.current = node;
            }
          }}
          value={internalValue}
          onChange={handleChange}
          onFocus={onFocus}
          placeholder={placeholder || "Start writing your content here..."}
          className={`w-full min-h-[300px] p-4 border-0 rounded-b-xl resize-none focus:outline-none ${
            isDark 
              ? 'bg-white/5 text-white placeholder:text-gray-500' 
              : 'bg-white text-gray-900 placeholder:text-gray-400'
          }`}
          style={{ 
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            lineHeight: '1.6'
          }}
        />

        {/* Helper Text */}
        <div className={`px-4 py-2 text-xs rounded-b-xl ${
          isDark 
            ? 'bg-white/5 text-gray-400 border-t border-white/10' 
            : 'bg-gray-50 text-gray-500 border-t border-gray-200'
        }`}>
          <span>Supports Markdown: **bold**, *italic*, `code`, [links](url), ![images](url) | Current: {internalValue.length} chars</span>
        </div>
      </div>
    );
  }
);

SimpleRichTextEditor.displayName = 'SimpleRichTextEditor';

// Main NoSSRQuill component that uses the simple editor
const NoSSRQuill = forwardRef<HTMLTextAreaElement, ISimpleEditorProps>((props, ref) => {
  return <SimpleRichTextEditor {...props} ref={ref} />;
});

NoSSRQuill.displayName = 'NoSSRQuill';

export default NoSSRQuill; 