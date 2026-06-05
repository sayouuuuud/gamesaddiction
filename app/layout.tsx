import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { SmoothScroll } from '@/components/smooth-scroll'
import { Preloader } from '@/components/preloader'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// Blanka — outlined uppercase display face, used only for the hero headline
const blanka = localFont({
  src: '../public/fonts/Blanka-Regular.otf',
  variable: '--font-blanka',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RECLAIM — Gaming Addiction, By Design',
  description:
    'An awareness project on gaming addiction: how games are engineered to keep you playing, the signs, the cost, and the way back.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${blanka.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <Preloader />
        <SmoothScroll>{children}</SmoothScroll>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
