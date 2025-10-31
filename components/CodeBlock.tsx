
import React, { useState, useEffect } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface CodeBlockProps {
  fileName: string;
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ fileName, code, language }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
    });
  };

  return (
    <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden shadow-md">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 border-b border-slate-800">
        <span className="text-sm font-medium text-slate-400">{fileName}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200"
        >
          <ClipboardIcon className="w-4 h-4" />
          {isCopied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre><code className={`language-${language} text-sm`}>{code}</code></pre>
      </div>
    </div>
  );
};
