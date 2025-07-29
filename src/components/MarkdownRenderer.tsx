import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderedContent = useMemo(() => {
    // Simple markdown parser for our specific content
    let html = content
    
    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-foreground mb-4 mt-8">$1</h3>')
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-foreground mb-6 mt-10">$1</h2>')
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-foreground mb-6 mt-0">$1</h1>')
    
    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<div class="my-6 rounded-lg border border-border bg-muted/50 overflow-hidden">
        ${lang ? `<div class="px-4 py-2 bg-muted border-b border-border text-xs font-mono text-muted-foreground">${lang}</div>` : ''}
        <pre class="p-4 overflow-x-auto"><code class="text-sm font-mono text-foreground">${code.trim()}</code></pre>
      </div>`
    })
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted text-sm font-mono text-foreground">$1</code>')
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-accent underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Lists
    html = html.replace(/^- \[x\] (.*$)/gm, '<div class="flex items-center gap-2 my-2"><input type="checkbox" checked disabled class="rounded border-border" /><span class="text-foreground line-through opacity-75">$1</span></div>')
    html = html.replace(/^- \[ \] (.*$)/gm, '<div class="flex items-center gap-2 my-2"><input type="checkbox" disabled class="rounded border-border" /><span class="text-foreground">$1</span></div>')
    html = html.replace(/^- (.*$)/gm, '<li class="text-foreground mb-1">$1</li>')
    
    // Wrap consecutive list items
    html = html.replace(/(<li.*<\/li>\s*)+/g, '<ul class="list-disc list-inside space-y-1 my-4 ml-4">$&</ul>')
    
    // Numbered lists
    html = html.replace(/^\d+\. (.*$)/gm, '<li class="text-foreground mb-1">$1</li>')
    html = html.replace(/(<li.*<\/li>\s*){2,}/g, '<ol class="list-decimal list-inside space-y-1 my-4 ml-4">$&</ol>')
    
    // Paragraphs
    html = html.replace(/^(?!<[hul]|<div|<pre|<ol)(.+$)/gm, '<p class="text-foreground leading-relaxed mb-4">$1</p>')
    
    // Clean up empty paragraphs
    html = html.replace(/<p[^>]*><\/p>/g, '')
    
    return html
  }, [content])

  return (
    <div 
      className="prose prose-gray max-w-none"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  )
}