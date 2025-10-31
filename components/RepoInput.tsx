
import React, { useState } from 'react';

interface RepoInputProps {
  onGenerate: (repoUrl: string) => void;
  isLoading: boolean;
}

export const RepoInput: React.FC<RepoInputProps> = ({ onGenerate, isLoading }) => {
  // Pre-fill with an example URL to guide the user
  const [repoUrl, setRepoUrl] = useState('https://github.com/your-name/gh-pages-deployment-helper');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim() && !isLoading) {
      onGenerate(repoUrl);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit}>
        <label htmlFor="repo-url" className="block text-sm font-medium text-slate-300 mb-2">
          GitHub Repository URL
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            id="repo-url"
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="e.g., https://github.com/your-name/your-repo"
            className="flex-grow bg-slate-900 border border-slate-600 rounded-md px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !repoUrl.trim()}
            className="w-full sm:w-auto flex items-center justify-center bg-cyan-600 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Guide'
            )}
          </button>
        </div>
      </form>
      <p className="text-xs text-slate-500 mt-4 text-center">
        Enter your repository URL, or click "Generate Guide" with the example above to see how to deploy this app!
      </p>
    </div>
  );
};
