"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes/dist/types"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: NextThemesProviderProps['attribute']
  defaultTheme?: string
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