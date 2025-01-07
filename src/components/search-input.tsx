import * as React from 'react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/button'
import { Input } from '@/components/input'

interface SearchInputProps {
  value?: string
}

export function SearchInput({ value: initialValue = '' }: SearchInputProps) {
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = React.useState(initialValue)

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="search"
        className="mb-4 bg-[#1A1A1A] border-[#333] text-xs h-8 focus-visible:ring-0 pr-8 [&::-webkit-search-cancel-button]:appearance-none"
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
        }}
        placeholder="Search"
        value={value}
        onChange={(e) => {
          const q = e.currentTarget.value
          setValue(q)
          router.push(`/?q=${encodeURIComponent(q)}`)
        }}
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
          onClick={() => {
            setValue('')
            router.push('/')
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      ) : (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center bg-neutral-800 rounded text-neutral-400 border border-neutral-700">
          <span className="font-mono text-xs">/</span>
        </div>
      )}
    </div>
  )
}
