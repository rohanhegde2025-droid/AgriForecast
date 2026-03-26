import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './fonts.css'
import './styles.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgriForecast | Smarter crop decisions with AI',
  description: 'Predict yield, forecast prices, and know when to sell.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
