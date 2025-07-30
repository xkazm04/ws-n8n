import React from 'react'
import gmailMd from './gmail.md?raw'
import aiAgentMd from './ai-agent.md?raw'
import conditionalMd from './conditional.md?raw'
import asanaMd from './asana.md?raw'
import toolsMd from './tools.md?raw'

export interface Chapter {
  id: string
  title: string
  completed: boolean
  content: string
}

export interface Tutorial {
  title: string
  description: string | React.ReactNode
  chapters: Chapter[]
}

export const tutorialData: Tutorial = {
  title: "n8n workflow",
  description: "This tutorial will guide you through creating an automated workflow with n8n, covering Gmail integration, AI agents, email states, and powerful tools.",
  chapters: [
    {
      id: "gmail",
      title: "Gmail integration",
      completed: false,
      content: gmailMd
    },
    {
      id: "ai-agent",
      title: "AI Agent",
      completed: false,
      content: aiAgentMd
    },
    {
      id: "conditional",
      title: "Conditional logic",
      completed: false,
      content: conditionalMd
    },
    {
      id: "asana",
      title: "Asana integration",
      completed: false,
      content: asanaMd
    },
    {
      id: "tools",
      title: "Tools",
      completed: false,
      content: toolsMd
    }
  ]
}