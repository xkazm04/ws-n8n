/**
 * Demo GIF configuration for workshop chapters
 * Replace the URLs below with actual demo GIFs from /public/demo-gifs/
 * 
 * To use local files, structure should be:
 * 'introduction': '/demo-gifs/introduction.gif'
 * 'gmail': '/demo-gifs/gmail.gif'
 * etc.
 */

export const DEMO_GIF_CONFIG: Record<string, string> = {
  // Introduction chapter - overview of n8n workflow creation
  'introduction': 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif',
  
  // Gmail integration chapter - connecting email workflows
  'gmail': 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
  
  // AI Agent chapter - setting up AI automation
  'ai-agent': '/demo-gifs/ai_agent.gif',
  
  // Email states chapter - managing email flow states
  'email-states': 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif',
  
  // Tools chapter - advanced n8n tools and features
  'tools': 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif',
}

/**
 * Example of how to use local GIF files instead:
 * 
 * export const DEMO_GIF_CONFIG: Record<string, string> = {
 *   'introduction': '/demo-gifs/introduction.gif',
 *   'gmail': '/demo-gifs/gmail-integration.gif',
 *   'ai-agent': '/demo-gifs/ai-agent-setup.gif',
 *   'email-states': '/demo-gifs/email-states-demo.gif',
 *   'tools': '/demo-gifs/tools-overview.gif',
 * }
 */