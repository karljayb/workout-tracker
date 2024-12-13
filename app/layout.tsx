import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { WorkoutProvider } from '@/contexts/WorkoutContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthGuard } from '@/components/AuthGuard'
import { Toaster } from "@/components/ui/toast"
import { ThemeProvider } from "@/components/theme-provider"
import AuthSessionProvider from "@/components/providers/AuthSessionProvider"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Workout Tracker",
  description: "Track your workouts and progress",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-red-500`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthSessionProvider>
            <AuthProvider>
              <AuthGuard>
                <WorkoutProvider>
                  {children}
                  <Toaster />
                </WorkoutProvider>
              </AuthGuard>
            </AuthProvider>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}