import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle, Circle, CaretLeft, CaretRight, ArrowLeft, Check, GripVertical } from '@phosphor-icons/react'
import { Chapter, tutorialData } from '@/data/tutorialData'
import { MarkdownRenderer } from './MarkdownRenderer'
import { DEMO_GIF_CONFIG } from '@/config/demoGifs'
import { cn } from '@/lib/utils'

interface MainContentProps {
  chapter: Chapter
  onToggleProgress: (chapterId: string) => void
  isCompleted: boolean
  sidebarCollapsed: boolean
  onChapterSelect: (chapterId: string) => void
}

export function MainContent({
  chapter,
  onToggleProgress,
  isCompleted,
  sidebarCollapsed,
  onChapterSelect
}: MainContentProps) {
  const [demoExpanded, setDemoExpanded] = useState(true) // Show half-screen by default
  const [demoWidth, setDemoWidth] = useState(50) // Percentage width
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)
  
  // Find current chapter index for navigation
  const currentIndex = tutorialData.chapters.findIndex(ch => ch.id === chapter.id)
  const hasPreviousChapter = currentIndex > 0
  const hasNextChapter = currentIndex < tutorialData.chapters.length - 1
  const previousChapter = hasPreviousChapter ? tutorialData.chapters[currentIndex - 1] : null
  const nextChapter = hasNextChapter ? tutorialData.chapters[currentIndex + 1] : null

  // Resize handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeRef.current) return

    const container = resizeRef.current.parentElement
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const mouseX = e.clientX - containerRect.left
    const newWidth = Math.max(20, Math.min(80, ((containerRect.width - mouseX) / containerRect.width) * 100))
    
    setDemoWidth(newWidth)
  }, [isResizing])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Add event listeners for resize
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  const goToPreviousChapter = () => {
    if (previousChapter) {
      onChapterSelect(previousChapter.id)
    }
  }

  const goToNextChapter = () => {
    if (nextChapter) {
      onChapterSelect(nextChapter.id)
    }
  }

  const handleCompleteAndNext = () => {
    onToggleProgress(chapter.id)
    if (nextChapter) {
      onChapterSelect(nextChapter.id)
    }
  }

  // Get demo GIF URL for current chapter
  const demoGifUrl = DEMO_GIF_CONFIG[chapter.id] || DEMO_GIF_CONFIG['introduction']

  return (
    <div className="flex-1 flex relative" ref={resizeRef}>
      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col transition-all duration-300 ease-in-out",
        demoExpanded ? `w-[${100 - demoWidth}%]` : "w-full"
      )} style={{ width: demoExpanded ? `${100 - demoWidth}%` : '100%' }}>
        {/* Chapter Header */}
        <div className="bg-card border-b border-border px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">
                {chapter.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {isCompleted && (
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  <CheckCircle className="w-4 h-4" weight="fill" />
                  Completed
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 h-full">
          <div className={cn(
            "max-w-4xl mx-auto px-8 py-8 pb-24 min-h-full",
            sidebarCollapsed && "max-w-5xl"
          )}>
            <MarkdownRenderer content={chapter.content} />
          </div>
        </ScrollArea>

        {/* Bottom Navigation */}
        <div className="bg-card border-t border-border px-8 py-4">
          <div className={cn(
            "max-w-4xl mx-auto flex items-center justify-between",
            sidebarCollapsed && "max-w-5xl"
          )}>
            <div>
              {hasPreviousChapter && (
                <Button
                  variant="outline"
                  onClick={goToPreviousChapter}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {!isCompleted && (
                <Button
                  onClick={handleCompleteAndNext}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Complete
                  {hasNextChapter && <span className="text-xs opacity-75">& Continue</span>}
                </Button>
              )}
              
              {isCompleted && hasNextChapter && (
                <Button
                  onClick={goToNextChapter}
                  className="flex items-center gap-2"
                >
                  Next Chapter
                  <CaretRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resizable Demo Panel */}
      {demoExpanded && (
        <>
          {/* Resize Handle */}
          <div
            className={cn(
              "w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors flex items-center justify-center group",
              isResizing && "bg-primary"
            )}
            onMouseDown={handleMouseDown}
          >
            <GripVertical className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>

          {/* Demo Content */}
          <div
            className="bg-card border-l border-border flex flex-col"
            style={{ width: `${demoWidth}%` }}
          >
            <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Demo Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDemoExpanded(false)}
                className="flex items-center gap-2 text-xs"
              >
                <CaretRight className="w-3 h-3" />
                Hide
              </Button>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center bg-muted/20 overflow-hidden">
              <img
                src={demoGifUrl}
                alt={`${chapter.title} demo`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </>
      )}

      {/* Demo Toggle Button (when collapsed) */}
      {!demoExpanded && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDemoExpanded(true)}
            className="shadow-lg bg-card"
          >
            <CaretLeft className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}