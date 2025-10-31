
import React from 'react';
import type { DeploymentGuide } from '../types';
import { CodeBlock } from './CodeBlock';
import { marked } from 'marked';

interface GuideDisplayProps {
  guide: DeploymentGuide;
}

// Basic markdown parsing for step descriptions
const parseMarkdown = (text: string) => {
    // A simple regex to find backticks and replace with code tags
    const html = marked.parse(text, { gfm: true, breaks: true });
    return { __html: html as string };
};


export const GuideDisplay: React.FC<GuideDisplayProps> = ({ guide }) => {
  return (
    <div className="space-y-10">
      <div id="step-1">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 border-b-2 border-slate-700 pb-2">Step 1: Update Your Vite Configuration</h2>
        <p className="text-slate-400 mb-4">
          Modify your <code className="bg-slate-700 text-sm px-1.5 py-1 rounded-md text-slate-300">{guide.viteConfig.fileName}</code> to include the <code className="bg-slate-700 text-sm px-1.5 py-1 rounded-md text-slate-300">base</code> property. This tells Vite where your project will be hosted on GitHub Pages.
        </p>
        <CodeBlock
          fileName={guide.viteConfig.fileName}
          code={guide.viteConfig.code}
          language="typescript"
        />
      </div>

      <div id="step-2">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 border-b-2 border-slate-700 pb-2">Step 2: Create a GitHub Actions Workflow</h2>
        <p className="text-slate-400 mb-4">
          Create a new file at the following path in your project: <code className="bg-slate-700 text-sm px-1.5 py-1 rounded-md text-slate-300">{guide.githubAction.filePath}</code>. This will automatically build and deploy your site whenever you push to your main branch.
        </p>
        <CodeBlock
          fileName={guide.githubAction.filePath}
          code={guide.githubAction.code}
          language="yaml"
        />
      </div>

      <div id="step-3">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 border-b-2 border-slate-700 pb-2">Step 3: Configure Repository Settings</h2>
        <p className="text-slate-400 mb-6">
          After pushing the new workflow file to your repository, follow these final steps on the GitHub website to activate GitHub Pages.
        </p>
        <ol className="relative border-l border-slate-700 ml-4 space-y-8">
            {guide.steps.map((step, index) => (
                <li key={index} className="ml-8">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-slate-800 rounded-full -left-4 ring-4 ring-slate-900 text-cyan-400 font-bold">
                        {index + 1}
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold text-white">
                        {step.title}
                    </h3>
                    <div
                        className="prose prose-invert prose-p:text-slate-400 prose-a:text-cyan-400 prose-strong:text-slate-200 prose-code:bg-slate-700 prose-code:text-slate-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm"
                        dangerouslySetInnerHTML={parseMarkdown(step.description)} 
                    />
                </li>
            ))}
        </ol>
      </div>
    </div>
  );
};
