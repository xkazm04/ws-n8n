import { useState, useMemo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from '@phosphor-icons/react'

interface MarkdownRendererProps {
  content: string
}

interface ParsedElement {
  type: 'header' | 'paragraph' | 'code' | 'list' | 'checkbox' | 'bold' | 'link' | 'inline-code' | 'aside' | 'divider'
  content: string
  level?: number
  language?: string
  checked?: boolean
  id?: string
  href?: string
}

// Custom syntax highlighter theme that matches our design
const customCodeTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: 'transparent',
    margin: 0,
    padding: '1rem',
    fontSize: '0.875rem',
    lineHeight: '1.5'
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'transparent',
    fontFamily: 'var(--font-mono), ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  }
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [checkboxStates, setCheckboxStates] = useState<Record<string, boolean>>({})
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [animatingCheckboxes, setAnimatingCheckboxes] = useState<Set<string>>(new Set())

  const copyToClipboard = async (text: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(codeId)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }
  const parsedElements = useMemo(() => {
    const lines = content.split('\n')
    const elements: ParsedElement[] = []
    let currentList: string[] = []
    let checkboxCounter = 0

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push({
          type: 'list',
          content: currentList.join('\n')
        })
        currentList = []
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (!line) {
        flushList()
        continue
      }

      // Divider
      if (line === '---') {
        flushList()
        elements.push({
          type: 'divider',
          content: ''
        })
      }
      // Aside blocks (tip boxes)
      else if (line === '<aside>') {
        flushList()
        let asideContent = ''
        i++
        
        while (i < lines.length && lines[i].trim() !== '</aside>') {
          asideContent += lines[i] + '\n'
          i++
        }
        
        elements.push({
          type: 'aside',
          content: asideContent.trim()
        })
      }
      // Headers
      else if (line.startsWith('###')) {
        flushList()
        elements.push({
          type: 'header',
          level: 3,
          content: line.replace(/^### /, '')
        })
      } else if (line.startsWith('##')) {
        flushList()
        elements.push({
          type: 'header',
          level: 2,
          content: line.replace(/^## /, '')
        })
      } else if (line.startsWith('#')) {
        flushList()
        elements.push({
          type: 'header',
          level: 1,
          content: line.replace(/^# /, '')
        })
      }
      // Code blocks
      else if (line.startsWith('```')) {
        flushList()
        const language = line.replace('```', '') || 'javascript'
        let codeContent = ''
        i++
        
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeContent += lines[i] + '\n'
          i++
        }
        
        elements.push({
          type: 'code',
          language,
          content: codeContent.replace(/\n$/, '') // Remove trailing newline
        })
      }
      // Checkboxes
      else if (line.match(/^- \[(x| )\]/)) {
        flushList()
        const checked = line.includes('[x]')
        const text = line.replace(/^- \[(x| )\] /, '')
        const id = `checkbox-${checkboxCounter++}`
        
        elements.push({
          type: 'checkbox',
          content: text,
          checked,
          id
        })
      }
      // Regular list items
      else if (line.startsWith('- ')) {
        currentList.push(line.replace(/^- /, ''))
      }
      // Numbered list items
      else if (line.match(/^\d+\. /)) {
        currentList.push(line.replace(/^\d+\. /, ''))
      }
      // Regular paragraphs
      else {
        flushList()
        elements.push({
          type: 'paragraph',
          content: line
        })
      }
    }
    
    flushList()
    return elements
  }, [content])

  const toggleCheckbox = (id: string) => {
    setCheckboxStates(prev => {
      const newState = !prev[id]
      
      // Add animation if becoming checked
      if (newState) {
        setAnimatingCheckboxes(current => new Set([...current, id]))
        setTimeout(() => {
          setAnimatingCheckboxes(current => {
            const newSet = new Set(current)
            newSet.delete(id)
            return newSet
          })
        }, 400)
      }
      
      return {
        ...prev,
        [id]: newState
      }
    })
  }

  const renderInlineContent = (text: string) => {
    // Process in order: bold first, then italic (since bold uses ** and italic uses *)
    // Bold text - match **text** and replace with <strong> without showing the asterisks
    let processed = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    
    // Italic text - Simple approach: replace single * that isn't preceded or followed by another *
    // Split by existing <strong> tags to avoid affecting already processed bold text
    const parts = processed.split(/(<strong[^>]*>.*?<\/strong>)/g)
    processed = parts.map(part => {
      if (part.includes('<strong')) {
        return part // Don't process parts that contain bold tags
      }
      return part.replace(/\*([^*\n]+?)\*/g, '<em class="italic">$1</em>')
    }).join('')
    
    // Inline code
    processed = processed.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">$1</code>')
    
    // Links
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-accent underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
    
    return <span dangerouslySetInnerHTML={{ __html: processed }} />
  }

  return (
    <div className="prose prose-gray max-w-none">
      {parsedElements.map((element, index) => {
        switch (element.type) {
          case 'header':
            const HeaderTag = `h${element.level}` as keyof JSX.IntrinsicElements
            const headerClasses = {
              1: 'text-3xl font-bold text-foreground mb-6 mt-0',
              2: 'text-2xl font-bold text-foreground mb-6 mt-10',
              3: 'text-xl font-semibold text-foreground mb-4 mt-8'
            }
            return (
              <HeaderTag key={index} className={headerClasses[element.level as keyof typeof headerClasses]}>
                {element.content}
              </HeaderTag>
            )

          case 'code':
            const codeId = `code-${index}`
            const isCopied = copiedCode === codeId
            return (
              <div key={index} className="my-6 rounded-lg border border-border bg-card/50 overflow-hidden shadow-sm relative">
                <div className="px-4 py-2 bg-muted/50 border-b border-border text-xs font-mono text-muted-foreground flex justify-between items-center">
                  <span>{element.language}</span>
                  <button
                    onClick={() => copyToClipboard(element.content, codeId)}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs bg-background/80 border border-border rounded hover:bg-background transition-all duration-200 hover:shadow-sm"
                    title={isCopied ? "Copied!" : "Copy code"}
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} className="text-green-600" />
                        <span className="text-green-600 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <SyntaxHighlighter
                  language={element.language}
                  style={customCodeTheme}
                  customStyle={{
                    margin: 0,
                    background: 'transparent',
                    fontSize: '0.875rem',
                    padding: '1rem'
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: 'var(--font-mono), ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                    }
                  }}
                >
                  {element.content}
                </SyntaxHighlighter>
              </div>
            )

          case 'checkbox':
            const isChecked = checkboxStates[element.id!] ?? element.checked
            const isAnimating = animatingCheckboxes.has(element.id!)
            return (
              <div key={index} className="flex items-center gap-3 my-3 group">
                <div className="relative checkbox-wrapper">
                  <input
                    type="checkbox"
                    id={element.id}
                    checked={isChecked}
                    onChange={() => toggleCheckbox(element.id!)}
                    className="sr-only"
                  />
                  <label 
                    htmlFor={element.id}
                    className={`
                      w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer
                      transition-all duration-300 ease-out hover:scale-110 active:scale-95
                      checkbox-focus relative overflow-hidden
                      ${isChecked 
                        ? 'bg-primary border-primary shadow-lg shadow-primary/25 ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/60 bg-background hover:bg-primary/5 hover:shadow-sm'
                      }
                    `}
                  >
                    {/* Ripple effect background */}
                    <div className={`
                      absolute inset-0 bg-white/20 rounded-md scale-0 
                      transition-transform duration-200 ease-out
                      ${isAnimating ? 'scale-150' : ''}
                    `} />
                    
                    <svg 
                      className={`w-3 h-3 text-white transition-all duration-300 relative z-10 ${
                        isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                      } ${isAnimating ? 'checkbox-check-animate' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={3} 
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </label>
                </div>
                <label 
                  htmlFor={element.id}
                  className={`text-foreground cursor-pointer transition-all duration-300 select-none ${
                    isChecked ? 'line-through opacity-70' : 'group-hover:text-primary/80'
                  }`}
                >
                  {renderInlineContent(element.content)}
                </label>
              </div>
            )

          case 'list':
            const listItems = element.content.split('\n')
            return (
              <ul key={index} className="list-disc list-inside space-y-1 my-4 ml-4">
                {listItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-foreground mb-1">
                    {renderInlineContent(item)}
                  </li>
                ))}
              </ul>
            )

          case 'aside':
            return (
              <div key={index} className="my-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-blue-600 text-sm font-semibold">💡</span>
                  </div>
                  <div className="text-blue-800 space-y-2 flex-1">
                    {element.content.split('\n').map((line, lineIndex) => {
                      const trimmedLine = line.trim()
                      if (!trimmedLine) return null
                      
                      return (
                        <p key={lineIndex} className="leading-relaxed">
                          {renderInlineContent(trimmedLine)}
                        </p>
                      )
                    })}
                  </div>
                </div>
              </div>
            )

          case 'divider':
            return (
              <hr key={index} className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            )

          case 'paragraph':
            return (
              <p key={index} className="text-foreground leading-relaxed mb-4">
                {renderInlineContent(element.content)}
              </p>
            )

          default:
            return null
        }
      })}
    </div>
  )
}