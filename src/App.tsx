import { useState } from 'react'
import { WorkshopRegistration } from './components/WorkshopRegistration'
import { WorkshopContent } from './components/WorkshopContent'
import { TopNavigation } from './components/TopNavigation'
import { Toaster } from '@/components/ui/sonner'

type Route = 'registration' | 'content'

function App() {
    const [currentRoute, setCurrentRoute] = useState<Route>('registration')

    return (
        <>
            <TopNavigation currentRoute={currentRoute} onRouteChange={setCurrentRoute} />
            {currentRoute === 'registration' ? <WorkshopRegistration /> : <WorkshopContent />}
            <Toaster />
        </>
    )
}

export default App