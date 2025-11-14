
import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 my-4">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-700/50">
        <span className="text-xs font-mono text-indigo-300 uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="bg-gray-600 hover:bg-gray-500 text-white text-xs font-semibold py-1 px-2 rounded-md transition-colors duration-200"
        >
          {copied ? '¡Copiado!' : 'Copiar'}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className={`language-${language}`}>{code.trim()}</code>
      </pre>
    </div>
  );
};
