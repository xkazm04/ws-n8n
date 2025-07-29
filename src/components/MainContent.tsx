import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle, Circle, CaretLeft, CaretRight, ArrowLeft, Check, ArrowsOut, X } from '@phosphor-icons/react'
import { Chapter, tutorialData } from '@/data/tutorialData'
import { MarkdownRenderer } from './MarkdownRenderer'
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
  const [iframeExpanded, setIframeExpanded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Find current chapter index for navigation
  const currentIndex = tutorialData.chapters.findIndex(ch => ch.id === chapter.id)
  const hasPreviousChapter = currentIndex > 0
  const hasNextChapter = currentIndex < tutorialData.chapters.length - 1
  const previousChapter = hasPreviousChapter ? tutorialData.chapters[currentIndex - 1] : null
  const nextChapter = hasNextChapter ? tutorialData.chapters[currentIndex + 1] : null

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

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen)
    if (!iframeExpanded) {
      setIframeExpanded(true)
    }
  }

  const handleCloseFullscreen = () => {
    setIsFullscreen(false)
  }

  return (
    <>
      <div className="flex-1 flex relative">
        {/* Main Content Area */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          iframeExpanded && !isFullscreen && "xl:mr-[50%]"
        )}>
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

        {/* Iframe Toggle Button - Only show on xl+ screens */}
        <div className="hidden xl:block absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIframeExpanded(!iframeExpanded)}
            className={cn(
              "transition-all duration-300 shadow-lg bg-card",
              iframeExpanded && "rotate-180"
            )}
          >
            <CaretLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Embedded iframe panel - Only show on xl+ screens */}
        <div className={cn(
          "hidden xl:block absolute top-0 right-0 h-full bg-card border-l border-border transition-all duration-300 ease-in-out z-20",
          iframeExpanded && !isFullscreen ? "w-[50%] opacity-100" : "w-0 opacity-0 overflow-hidden"
        )}>
          {iframeExpanded && !isFullscreen && (
            <div className="h-full flex flex-col">
              <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">n8n Interface</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFullscreenToggle}
                  className="flex items-center gap-2 text-xs"
                >
                  <ArrowsOut className="w-3 h-3" />
                  Fullscreen
                </Button>
              </div>
              <iframe
                src="https://n8n-finance.groupondev.com/"
                className="flex-1 w-full border-0"
                title="n8n Interface"
              />
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen iframe overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="h-full flex flex-col">
            <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">n8n Interface - Fullscreen</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseFullscreen}
                className="flex items-center gap-2 text-xs"
              >
                <X className="w-3 h-3" />
                Close
              </Button>
            </div>
            <iframe
              src="https://n8n-finance.groupondev.com/"
              className="flex-1 w-full border-0"
              title="n8n Interface - Fullscreen"
            />
          </div>
        </div>
      )}
    </>
  )
}