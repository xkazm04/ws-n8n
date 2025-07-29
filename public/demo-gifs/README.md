# Demo GIF Setup Instructions

## Adding Demo GIFs to Workshop Chapters

This workshop supports displaying demo GIFs alongside the tutorial content to provide visual demonstrations of each chapter's concepts.

### Setup Steps

1. **Add GIF files** to the `/public/demo-gifs/` directory
2. **Update the configuration** in `/src/config/demoGifs.ts`

### File Structure

```
public/
  demo-gifs/
    introduction.gif
    gmail-integration.gif
    ai-agent-setup.gif
    email-states-demo.gif
    tools-overview.gif
```

### Configuration

Edit `/src/config/demoGifs.ts`:

```typescript
export const DEMO_GIF_CONFIG: Record<string, string> = {
  'introduction': '/demo-gifs/introduction.gif',
  'gmail': '/demo-gifs/gmail-integration.gif',
  'ai-agent': '/demo-gifs/ai-agent-setup.gif',
  'email-states': '/demo-gifs/email-states-demo.gif',
  'tools': '/demo-gifs/tools-overview.gif',
}
```

### Features

- **Half-screen mode**: Demo GIFs display by default in a panel taking 50% of the screen width
- **Fullscreen mode**: Click the fullscreen button to view demos in full screen
- **Toggle visibility**: Use the arrow button to hide/show the demo panel
- **Responsive**: Demo panel automatically adapts to different screen sizes

### GIF Recommendations

- **File size**: Keep GIFs under 5MB for optimal loading
- **Dimensions**: Recommended minimum width of 800px
- **Duration**: 10-30 seconds showing key workflow steps
- **Content**: Focus on the specific feature being taught in each chapter