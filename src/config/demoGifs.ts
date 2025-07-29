/**
 * Demo GIF configuration for workshop chapters
 * Maps chapter IDs to their corresponding demo GIF URLs
 */

export const DEMO_GIF_CONFIG: Record<string, string> = {
  // Introduction chapter - overview of n8n workflow creation
  'introduction': 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif',
  
  // Gmail integration chapter - connecting email workflows
  'gmail': 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
  
  // AI Agent chapter - setting up AI automation (using local file)
  'ai-agent': '/demo-gifs/ai_agent.gif',
  
  // Email states chapter - managing email flow states
  'email-states': 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
  
  // Tools chapter - advanced n8n tools and features
  'tools': 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
}

/**
 * Example of how to use local GIF files instead:
 * Simply place your GIF files in the public/demo-gifs/ directory
 * and reference them with '/demo-gifs/filename.gif'
 * 
 * For example:
 * 'introduction': '/demo-gifs/introduction.gif',
 * 'gmail': '/demo-gifs/gmail-integration.gif',
 * 'ai-agent': '/demo-gifs/ai-agent-setup.gif',
 * 'email-states': '/demo-gifs/email-states-demo.gif',
 * 'tools': '/demo-gifs/tools-overview.gif',
 */