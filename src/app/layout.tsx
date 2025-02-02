import { ThemeProvider } from '@/components'
import { ReactFlowProvider } from '@xyflow/react'
import { Metadata } from 'next'
import { Roboto_Mono } from 'next/font/google'
import './globals.css'

const robotoMono = Roboto_Mono({
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
    <html lang='en' className='dark' suppressHydrationWarning>
      <body className={`${robotoMono.className} antialiased h-screen w-screen`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <ReactFlowProvider>{children}</ReactFlowProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
