/**
 * Demo GIF configuration for workshop chapters
 * Maps chapter IDs to their corresponding demo GIF URLs
 * Only chapters with available GIFs are included - chapters without GIFs won't show the demo panel
 */

export const DEMO_GIF_CONFIG: Record<string, string> = {
  // Gmail integration chapter - connecting email workflows
  'gmail': '/demo-gifs/gmail.gif',
  
  // AI Agent chapter - setting up AI automation
  'ai-agent': '/demo-gifs/ai_agent.gif',
  
  // Conditional logic chapter - IF/THEN workflow logic
  'conditional': '/demo-gifs/if.gif',
  
  // Asana integration chapter - task management integration
  'asana': '/demo-gifs/asana.gif',
  
  // Tools chapter has no GIF - will not show demo panel
}