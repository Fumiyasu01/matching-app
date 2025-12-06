'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'

interface TagInputCardProps {
  title: string
  placeholder: string
  tags: string[]
  inputValue: string
  onInputChange: (value: string) => void
  onAdd: () => void
  onRemove: (tag: string) => void
}

export function TagInputCard({
  title,
  placeholder,
  tags,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
}: TagInputCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onAdd()
              }
            }}
          />
          <Button type="button" variant="outline" size="icon" onClick={onAdd}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="pr-1">
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
