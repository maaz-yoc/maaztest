
import { GoogleGenAI, Type } from "@google/genai";
import type { DeploymentGuide } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const guideSchema = {
  type: Type.OBJECT,
  properties: {
    viteConfig: {
      type: Type.OBJECT,
      properties: {
        fileName: { type: Type.STRING, description: 'The name of the Vite config file, e.g., vite.config.ts.' },
        code: { type: Type.STRING, description: 'The full TypeScript code for the Vite config file, including the base path setting.' }
      },
      required: ['fileName', 'code']
    },
    githubAction: {
      type: Type.OBJECT,
      properties: {
        filePath: { type: Type.STRING, description: 'The full path for the GitHub action workflow file, e.g., .github/workflows/deploy.yml.' },
        code: { type: Type.STRING, description: 'The full YAML code for the GitHub action workflow to build and deploy the Vite project.' }
      },
      required: ['filePath', 'code']
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'The title of the step.' },
          description: { type: Type.STRING, description: 'A detailed description of the step to perform. Use Markdown for formatting code snippets and links.' }
        },
        required: ['title', 'description']
      }
    }
  },
  required: ['viteConfig', 'githubAction', 'steps']
};


const parseRepoUrl = (url: string): { username: string; repoName: string } => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== 'github.com') {
      throw new Error();
    }
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      throw new Error();
    }
    const [username, repoName] = pathParts;
    return { username, repoName: repoName.replace('.git', '') };
  } catch {
    throw new Error('Invalid GitHub repository URL. Please use a format like "https://github.com/username/repo-name".');
  }
};


export const generateDeploymentGuide = async (repoUrl: string): Promise<DeploymentGuide> => {
  const { repoName } = parseRepoUrl(repoUrl);

  const prompt = `
    Generate a comprehensive guide for deploying a standard React + Vite + TypeScript project to GitHub Pages.
    The repository name is "${repoName}".

    The guide must include three parts:
    1.  **Vite Configuration**: Provide the complete code for \`vite.config.ts\`, making sure to correctly set the 'base' property to "/${repoName}/".
    2.  **GitHub Action Workflow**: Provide the complete YAML code for a GitHub Actions workflow file located at \`.github/workflows/deploy.yml\`. This workflow should:
        - Trigger on push to the 'main' or 'master' branch.
        - Check out the code.
        - Set up Node.js (version 20.x).
        - Install dependencies using 'npm install'.
        - Build the project using 'npm run build'.
        - Use a community action (like peaceiris/actions-gh-pages) to deploy the 'dist' folder to the 'gh-pages' branch.
    3.  **Setup Steps**: Provide a clear, step-by-step list of instructions for the user to follow on the GitHub website to enable GitHub Pages for their repository. The instructions should tell them to:
        - Go to their repository settings.
        - Navigate to the "Pages" section.
        - Select the 'gh-pages' branch as the source for deployment.
        - Wait for the deployment to complete and find their live URL.

    Format the entire output according to the provided JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: guideSchema,
      },
    });
    
    const guideJsonString = response.text.trim();
    const guide = JSON.parse(guideJsonString);
    
    // Basic validation to ensure the parsed object matches the expected structure
    if (!guide.viteConfig || !guide.githubAction || !guide.steps) {
        throw new Error("Invalid response structure from API.");
    }

    return guide as DeploymentGuide;
  } catch (error) {
    console.error("Error generating deployment guide:", error);
    throw new Error("Failed to generate the deployment guide. The Gemini API might be unavailable or the request failed. Please check your API key and try again.");
  }
};
