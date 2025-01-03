import { ReactFlowProvider } from '@xyflow/react'
import { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400'],
})

export const metadata: Metadata = {
  title: 'Design Database',
  description: 'Built by Grigorii Prudnikov',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.className} antialiased h-screen w-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactFlowProvider>{children}</ReactFlowProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
