"use client"

import { useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export default ({ children, ...props }: ThemeProviderProps) => {
	const [theme, setTheme] = useState("light")
	useEffect(() => {
		setTheme(localStorage.getItem("theme") || "light")
	}, [])
	return (
		<NextThemesProvider {...props} defaultTheme={theme}>
			{children}
		</NextThemesProvider>
	)
}
