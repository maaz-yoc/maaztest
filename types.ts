
export interface ViteConfig {
  fileName: string;
  code: string;
}

export interface GithubAction {
  filePath: string;
  code: string;
}

export interface GuideStep {
  title: string;
  description: string;
}

export interface DeploymentGuide {
  viteConfig: ViteConfig;
  githubAction: GithubAction;
  steps: GuideStep[];
}
