import { useState } from 'react'
import { WorkshopRegistration } from './components/WorkshopRegistration'
import { WorkshopContent } from './components/WorkshopContent'
import { TopNavigation } from './components/TopNavigation'
import { Toaster } from '@/components/ui/sonner'

type Route = 'registration' | 'content'

function App() {
    const [currentRoute, setCurrentRoute] = useState<Route>('registration')

    return (
        <div className="min-h-screen bg-background">
            <TopNavigation currentRoute={currentRoute} onRouteChange={setCurrentRoute} />
            <div className="h-[calc(100vh-4rem)]">
                {currentRoute === 'registration' ? <WorkshopRegistration /> : <WorkshopContent />}
            </div>
            <Toaster />
        </div>
    )
}

export default App