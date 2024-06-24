import type { Metadata } from "next";
import '@/sass/global.scss';

export const metadata = {
  title: 'Bandera Azul | EcoFuturo',
  description: 'Con EcoFuturo, una aplicación AI innovadora, podrás dialogar con tu yo del futuro sobre estrategias para mejorar el medio ambiente. Descubre cómo tus acciones hoy pueden impactar positivamente el mañana.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
