import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'
import { tutorialData } from '@/data/tutorialData'
import { useKV } from '@github/spark/hooks'

export function WorkshopContent() {
  const [activeChapterId, setActiveChapterId] = useState(tutorialData.chapters[0].id)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Track chapter progress with persistence
  const [chapterProgress, setChapterProgress] = useKV<Record<string, boolean>>(
    'workshop-chapter-progress',
    {}
  )

  const toggleChapterProgress = (chapterId: string) => {
    setChapterProgress(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }))
  }

  const activeChapter = tutorialData.chapters.find(chapter => chapter.id === activeChapterId)
  
  const completedCount = Object.values(chapterProgress).filter(Boolean).length
  const totalCount = tutorialData.chapters.length
  const progressPercentage = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">
      <Sidebar
        tutorial={tutorialData}
        activeChapterId={activeChapterId}
        onChapterSelect={setActiveChapterId}
        chapterProgress={chapterProgress}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        progressPercentage={progressPercentage}
        completedCount={completedCount}
        totalCount={totalCount}
      />
      <MainContent
        chapter={activeChapter!}
        onToggleProgress={toggleChapterProgress}
        isCompleted={chapterProgress[activeChapterId] || false}
        sidebarCollapsed={sidebarCollapsed}
      />
    </div>
  )
}