import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle, Circle } from '@phosphor-icons/react'
import { Chapter } from '@/data/tutorialData'
import { MarkdownRenderer } from './MarkdownRenderer'
import { cn } from '@/lib/utils'

interface MainContentProps {
  chapter: Chapter
  onToggleProgress: (chapterId: string) => void
  isCompleted: boolean
  sidebarCollapsed: boolean
}

export function MainContent({
  chapter,
  onToggleProgress,
  isCompleted,
  sidebarCollapsed
}: MainContentProps) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Chapter Header */}
      <div className="bg-card border-b border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">
              {chapter.title}
            </h1>
          </div>
          
          <Button
            onClick={() => onToggleProgress(chapter.id)}
            variant={isCompleted ? "default" : "outline"}
            className={cn(
              "flex items-center gap-2 transition-all duration-200",
              isCompleted && "bg-primary text-primary-foreground"
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4" weight="fill" />
                Completed
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                Mark Complete
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1 h-full">
        <div className={cn(
          "max-w-4xl mx-auto px-8 py-8 min-h-full",
          sidebarCollapsed && "max-w-5xl"
        )}>
          <MarkdownRenderer content={chapter.content} />
        </div>
      </ScrollArea>
    </div>
  )
}