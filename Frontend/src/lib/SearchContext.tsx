import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface SearchContextValue {
  query: string
  setQuery: (q: string) => void
  clearQuery: () => void
}

const SearchContext = createContext<SearchContextValue>({
  query: "",
  setQuery: () => {},
  clearQuery: () => {},
})

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQueryRaw] = useState("")
  const setQuery   = useCallback((q: string) => setQueryRaw(q), [])
  const clearQuery = useCallback(() => setQueryRaw(""), [])
  return (
    <SearchContext.Provider value={{ query, setQuery, clearQuery }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  return useContext(SearchContext)
}
