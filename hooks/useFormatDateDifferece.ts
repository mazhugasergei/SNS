export const useFormatDateDifference = (startDate: Date) => {
	const currentDate = new Date()
	const differenceInSeconds = Math.floor((currentDate.getTime() - startDate.getTime()) / 1000)

	return differenceInSeconds < 60
		? `${differenceInSeconds}s`
		: differenceInSeconds < 3600
		? `${Math.floor(differenceInSeconds / 60)}m`
		: differenceInSeconds < 86400
		? `${Math.floor(differenceInSeconds / 3600)}h`
		: startDate.getFullYear() === currentDate.getFullYear()
		? startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
		: startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
