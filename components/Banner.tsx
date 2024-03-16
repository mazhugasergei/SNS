import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"

export const Banner = ({ src, className }: { src?: string | null; className?: string }) => {
	return (
		<AspectRatio ratio={3 / 1} className={`overflow-hidden flex items-center bg-secondary rounded-lg  ${className}`}>
			{src && <Image src={src} width={1500} height={500} alt="" />}
		</AspectRatio>
	)
}
