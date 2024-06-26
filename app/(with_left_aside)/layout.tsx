import type { Metadata } from "next"
import { ReactNode } from "react"
import Footer from "../../components/Footer"
import { Aside } from "./components/Aside"

export const metadata: Metadata = {
  title: "Home - Wave",
}

export default ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="container flex items-start max-sm:pl-2 max-md:pl-2 max-xl:pr-0">
        <Aside />
        {children}
      </div>
      <Footer />
    </>
  )
}
