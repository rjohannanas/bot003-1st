"use client"

import { useState } from "react"
import { FileText, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Source } from "@/types/chat"

interface SourceCardsProps {
  sources: Source[]
}

export function SourceCards({ sources }: SourceCardsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (sources.length === 0) return null

  const displayedSources = isExpanded ? sources : sources.slice(0, 2)
  const hasMore = sources.length > 2

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FileText className="size-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {sources.length} fuente{sources.length !== 1 ? "s" : ""} consultada{sources.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {displayedSources.map((source, index) => (
          <SourceCard key={index} source={source} />
        ))}
      </div>

      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-xs"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="size-3" />
              Mostrar menos
            </>
          ) : (
            <>
              <ChevronDown className="size-3" />
              Ver {sources.length - 2} fuente{sources.length - 2 !== 1 ? "s" : ""} mas
            </>
          )}
        </Button>
      )}
    </div>
  )
}

function SourceCard({ source }: { source: Source }) {
  const [isSnippetExpanded, setIsSnippetExpanded] = useState(false)

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:bg-muted/50",
        "border-l-2 border-l-primary/50"
      )}
      onClick={() => setIsSnippetExpanded(!isSnippetExpanded)}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <FileText className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{source.filename}</p>
            {source.page && (
              <p className="text-xs text-muted-foreground">Pagina {source.page}</p>
            )}
            <p
              className={cn(
                "mt-1 text-xs text-muted-foreground",
                !isSnippetExpanded && "line-clamp-2"
              )}
            >
              {source.snippet}
            </p>
            {source.score !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(source.score * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {Math.round(source.score * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
