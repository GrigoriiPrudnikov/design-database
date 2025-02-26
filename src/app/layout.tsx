import { ThemeProvider } from '@/components'
import { Toaster } from '@/components/ui'
import { ReactFlowProvider } from '@xyflow/react'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
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
    <html lang='en' className='dark' suppressHydrationWarning>
      <body className={`${inter.className} antialiased h-screen w-screen`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <ReactFlowProvider>{children}</ReactFlowProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
