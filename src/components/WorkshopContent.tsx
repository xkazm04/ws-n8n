import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'
import { tutorialData } from '@/data/tutorialData'
import { UserProfileService } from '@/services/userProfileService'

export function WorkshopContent() {
  const [activeChapterId, setActiveChapterId] = useState(tutorialData.chapters[0].id)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Track chapter progress with localStorage persistence
  const [chapterProgress, setChapterProgress] = useState<Record<string, boolean>>({})
  
  // Get user profile for personalized content
  const userProfile = UserProfileService.getUserProfile()

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('workshop-chapter-progress')
    if (savedProgress) {
      try {
        setChapterProgress(JSON.parse(savedProgress))
      } catch (error) {
        console.error('Error loading progress from localStorage:', error)
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('workshop-chapter-progress', JSON.stringify(chapterProgress))
  }, [chapterProgress])

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

  // Create personalized tutorial data with user's invitation link if available
  const personalizedTutorial = userProfile ? {
    ...tutorialData,
    description: `Welcome ${userProfile.name}! Your workshop invitation: ${userProfile.invitationUrl}`
  } : tutorialData

  return (
    <div className="flex h-full bg-background">
      <Sidebar
        tutorial={personalizedTutorial}
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
        onChapterSelect={setActiveChapterId}
      />
    </div>
  )
}