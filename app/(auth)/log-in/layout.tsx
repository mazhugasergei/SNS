import { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: 'Welcome back - Wave'
}

export default ({ children }: { children: ReactNode }) => children