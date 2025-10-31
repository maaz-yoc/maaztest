
import React, { useState, useCallback } from 'react';
import { RepoInput } from './components/RepoInput';
import { GuideDisplay } from './components/GuideDisplay';
import { GithubIcon } from './components/icons/GithubIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { generateDeploymentGuide } from './services/geminiService';
import type { DeploymentGuide } from './types';

const App: React.FC = () => {
  const [guide, setGuide] = useState<DeploymentGuide | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateGuide = useCallback(async (repoUrl: string) => {
    setIsLoading(true);
    setError(null);
    setGuide(null);

    try {
      const generatedGuide = await generateDeploymentGuide(repoUrl);
      setGuide(generatedGuide);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <GithubIcon className="w-10 h-10 text-slate-400" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              GitHub Pages Deployment Helper
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto flex items-center justify-center gap-2">
            Generate a personalized deployment guide for your Vite project
            <SparklesIcon className="w-5 h-5 text-yellow-400" />
          </p>
        </header>

        <main>
          <RepoInput onGenerate={handleGenerateGuide} isLoading={isLoading} />
          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {isLoading && (
            <div className="mt-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              <p className="mt-4 text-slate-400">Generating your guide with Gemini... this might take a moment.</p>
            </div>
          )}

          {guide && !isLoading && (
            <div className="mt-8">
              <GuideDisplay guide={guide} />
            </div>
          )}
          
          {!guide && !isLoading && !error && (
            <div className="mt-12 text-center p-8 border-2 border-dashed border-slate-700 rounded-lg">
              <p className="text-slate-500">
                Enter your GitHub repository URL above to get started.
              </p>
            </div>
          )}
        </main>

        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Powered by React, Tailwind CSS, and the Google Gemini API.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
