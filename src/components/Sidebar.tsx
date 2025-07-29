import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle, Circle, List, X } from '@phosphor-icons/react'
import { Tutorial } from '@/data/tutorialData'
import { cn } from '@/lib/utils'

interface SidebarProps {
  tutorial: Tutorial
  activeChapterId: string
  onChapterSelect: (chapterId: string) => void
  chapterProgress: Record<string, boolean>
  collapsed: boolean
  onToggleCollapse: () => void
  progressPercentage: number
  completedCount: number
  totalCount: number
}

export function Sidebar({
  tutorial,
  activeChapterId,
  onChapterSelect,
  chapterProgress,
  collapsed,
  onToggleCollapse,
  progressPercentage,
  completedCount,
  totalCount
}: SidebarProps) {
  if (collapsed) {
    return (
      <div className="w-12 bg-card border-r border-border flex flex-col items-center py-4">
        <Button
          onClick={onToggleCollapse}
          variant="ghost"
          size="sm"
          className="p-2 h-8 w-8"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {tutorial.title}
          </h2>
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            className="p-2 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {tutorial.description}
        </p>
        
        {/* Progress Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {completedCount}/{totalCount} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {progressPercentage}% complete
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {tutorial.chapters.map((chapter, index) => {
            const isActive = chapter.id === activeChapterId
            const isCompleted = chapterProgress[chapter.id] || false
            
            return (
              <button
                key={chapter.id}
                onClick={() => onChapterSelect(chapter.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all duration-200 group",
                  "hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring",
                  isActive && "bg-accent text-accent-foreground shadow-sm"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle 
                        className="w-5 h-5 text-primary" 
                        weight="fill" 
                      />
                    ) : (
                      <Circle 
                        className={cn(
                          "w-5 h-5 transition-colors",
                          isActive ? "text-accent-foreground" : "text-muted-foreground"
                        )} 
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-xs font-mono px-1.5 py-0.5 rounded",
                        isActive 
                          ? "bg-accent-foreground/10 text-accent-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className={cn(
                      "font-medium text-sm leading-snug",
                      isActive ? "text-accent-foreground" : "text-foreground"
                    )}>
                      {chapter.title}
                    </h3>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}