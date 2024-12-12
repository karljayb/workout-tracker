"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type Attribute = "class" | "data-theme" | "data-mode"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: Attribute | Attribute[]
  defaultTheme?: "light" | "dark" | "system"
  enableSystem?: boolean
  storageKey?: string
  disableTransitionOnChange?: boolean
  forcedTheme?: string
  themes?: string[]
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}