"use client"

import { useState, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { Languages, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { locales, languageNames, type Locale } from "@/i18n/config"
import { setStoredLanguage } from "@/lib/language-preference"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
  const t = useTranslations("language")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const changeLanguage = (newLocale: Locale) => {
    // Save user's language preference
    setStoredLanguage(newLocale)
    
    startTransition(() => {
      // Remove the current locale from the pathname if it exists
      const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
      // Add the new locale to the pathname
      const newPath = `/${newLocale}${pathnameWithoutLocale}`
      router.push(newPath)
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              disabled={isPending}
            >
              <Languages className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("selectLanguage")}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-64 max-h-[500px] overflow-y-auto">
        <DropdownMenuLabel>{t("selectLanguage")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {locales.map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={cn(
                "cursor-pointer flex items-center justify-between",
                locale === lang && "bg-accent"
              )}
            >
              <div className="flex flex-col">
                <span className="font-medium">{languageNames[lang].native}</span>
                <span className="text-xs text-muted-foreground">
                  {languageNames[lang].english}
                </span>
              </div>
              {locale === lang && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
