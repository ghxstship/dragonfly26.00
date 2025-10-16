"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  BookMarked,
  Hash,
  Search,
  Plus,
  Filter,
  Info,
  Link as LinkIcon
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useState } from "react"
import { useTranslations } from 'next-intl'
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function ResourcesGlossaryTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('resources.glossary')
  const tCommon = useTranslations('common')
  const { data: terms, loading } = useModuleData(workspaceId, 'resources', 'glossary')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
          {t('description')}
        </p>
        </div>
      </div>
    )
  }

  const filteredTerms = terms.filter((term: any) => {
    const matchesSearch = term.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesLetter = !selectedLetter || 
      term.name?.charAt(0).toUpperCase() === selectedLetter
    
    return matchesSearch && matchesLetter
  })

  // Group terms by first letter
  const termsByLetter = filteredTerms.reduce((acc: any, term: any) => {
    const firstLetter = term.name?.charAt(0).toUpperCase() || '#'
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(term)
    return acc
  }, {})

  const sortedLetters = Object.keys(termsByLetter).sort()
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'technical': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'production': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
      'business': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'audio': 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400',
      'lighting': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'video': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
    }
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Terms</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{terms.length}</div>
            <p className="text-xs text-muted-foreground">Definitions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(terms.map((t: any) => t.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">Topics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technical</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {terms.filter((t: any) => t.category === 'technical').length}
            </div>
            <p className="text-xs text-muted-foreground">Technical terms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {terms.filter((t: any) => t.category === 'production').length}
            </div>
            <p className="text-xs text-muted-foreground">Production terms</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder={t('searchTerms')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Alphabet Filter */}
      <div className="flex flex-wrap gap-1">
        <Button
          variant={selectedLetter === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedLetter(null)}
        >{t('all')}</Button>
        {alphabet.map((letter) => (
          <Button
            key={letter}
            variant={selectedLetter === letter ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLetter(letter)}
            disabled={!sortedLetters.includes(letter)}
          >
            {letter}
          </Button>
        ))}
      </div>

      {/* Terms List */}
      <div className="space-y-6">
        {sortedLetters.map((letter) => (
          <div key={letter} id={`letter-${letter}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                {letter}
              </div>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            <div className="space-y-3">
              {termsByLetter[letter].map((term: any) => (
                <Card key={term.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{term.name}</CardTitle>
                        {term.alternate_names && term.alternate_names.length > 0 && (
                          <CardDescription className="mt-1">
                            Also known as: {term.alternate_names.join(', ')}
                          </CardDescription>
                        )}
                      </div>
                      {term.category && (
                        <Badge className={getCategoryColor(term.category)}>
                          {term.category}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {term.definition}
                    </p>

                    {term.example && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs font-medium mb-1">Example:</p>
                        <p className="text-sm text-muted-foreground italic">
                          {term.example}
                        </p>
                      </div>
                    )}

                    {term.related_terms && term.related_terms.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <LinkIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Related:</span>
                        <div className="flex flex-wrap gap-1">
                          {term.related_terms.map((relatedTerm: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {relatedTerm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {term.tags && term.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {term.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              variant="inline"
              icon={BookMarked}
              mainMessage={searchQuery || selectedLetter ? "No terms found" : t('nothingToSeeYet')}
              description={searchQuery || selectedLetter ? t('tryAdjustingSearch') : t('addTerms')}
              actionLabel={!searchQuery && !selectedLetter ? t('addTerm') : undefined}
              onAction={!searchQuery && !selectedLetter ? () => {} : undefined}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
