import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const RouterContext = createContext({
  path: '/',
  navigate: () => {},
})

/** Lightweight client router (no extra dependency). */
export function RouterProvider({ children }) {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    function handlePopState() {
      setPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = useCallback((nextPath) => {
    if (nextPath === window.location.pathname) {
      return
    }

    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
  }, [])

  const value = useMemo(() => ({ path, navigate }), [path, navigate])

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  )
}

export function useRouter() {
  return useContext(RouterContext)
}

export function Link({ to, className, children, onClick }) {
  const { navigate } = useRouter()

  return (
    <a
      className={className}
      href={to}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.altKey ||
          event.ctrlKey ||
          event.shiftKey
        ) {
          return
        }

        event.preventDefault()
        onClick?.(event)
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}

export function Route({ path, element }) {
  const { path: currentPath } = useRouter()
  return currentPath === path ? element : null
}
