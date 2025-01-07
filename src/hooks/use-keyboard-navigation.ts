import * as React from 'react'

export type Panel = 'sidebar' | 'songlist'

export function useKeyboardNavigation() {
  const [activePanel, setActivePanel] = React.useState<Panel>('sidebar')
  const panelRefs = React.useRef<Record<Panel, React.RefObject<HTMLElement> | null>>({
    sidebar: null,
    songlist: null,
  })

  const registerPanelRef = React.useCallback((panel: Panel, ref: React.RefObject<HTMLElement>) => {
    panelRefs.current[panel] = ref
  }, [])

  const handleKeyNavigation = React.useCallback((panel: Panel, e: React.KeyboardEvent) => {
    console.log('[hook]: useKeyboardNavigation')

    const currentRef = panelRefs.current[panel]
    if (!currentRef?.current) return

    const items = Array.from(currentRef.current.querySelectorAll('[tabindex="0"]'))
    const currentIndex = items.indexOf(document.activeElement as HTMLElement)

    switch (e.key) {
      case 'ArrowDown':
      case 'j':
        e.preventDefault()
        const nextIndex = (currentIndex + 1) % items.length
        ;(items[nextIndex] as HTMLElement).focus()
        break

      case 'ArrowUp':
      case 'k':
        e.preventDefault()
        const prevIndex = (currentIndex - 1 + items.length) % items.length
        ;(items[prevIndex] as HTMLElement).focus()
        break

      case 'h':
        if (panel === 'songlist') {
          e.preventDefault()
          setActivePanel('sidebar')
          const sidebarFirstItem = panelRefs.current.sidebar?.current?.querySelector(
            '[tabindex="0"]',
          ) as HTMLElement | null
          sidebarFirstItem?.focus()
        }
        break

      case 'l':
        if (panel === 'sidebar') {
          e.preventDefault()
          setActivePanel('songlist')
          const songlistFirstItem = panelRefs.current.songlist?.current?.querySelector(
            '[tabindex="0"]',
          ) as HTMLElement | null
          songlistFirstItem?.focus()
        }
        break
    }
  }, [])

  return { activePanel, setActivePanel, registerPanelRef, handleKeyNavigation }
}
