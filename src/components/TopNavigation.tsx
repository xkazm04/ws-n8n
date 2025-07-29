import { Button } from '@/components/ui/button'

type Route = 'registration' | 'content'

interface TopNavigationProps {
  currentRoute: Route
  onRouteChange: (route: Route) => void
}

export function TopNavigation({ currentRoute, onRouteChange }: TopNavigationProps) {
  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold text-foreground">
            N8N Workshop
          </h1>
          
          <div className="flex space-x-1">
            <Button
              variant={currentRoute === 'registration' ? 'default' : 'ghost'}
              onClick={() => onRouteChange('registration')}
              className="px-4 py-2"
            >
              Registration
            </Button>
            <Button
              variant={currentRoute === 'content' ? 'default' : 'ghost'}
              onClick={() => onRouteChange('content')}
              className="px-4 py-2"
            >
              Content
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}