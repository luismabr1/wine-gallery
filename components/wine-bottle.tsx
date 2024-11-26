import Image from 'next/image'
import Link from 'next/link'

type Wine = {
  id: number
  name: string
  country: string
  year: number
  grapeVariety: string
  imageUrl: string
}

type WineBottleProps = {
  wine: Wine
}

export default function WineBottle({ wine }: WineBottleProps) {
  return (
    <Link href={`/wine/${wine.id}`} className="block wine-bottle">
      <div className="flex flex-col items-center w-[calc(100vw-2rem)] sm:w-[calc(50vw-2.5rem)] md:w-[calc(33.33vw-2.5rem)] lg:w-[calc(25vw-2.5rem)] xl:w-[calc(20vw-2.5rem)] max-w-[300px] min-w-[200px] bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-md p-4 transition-all duration-300 hover:scale-105 focus-within:scale-105 focus-within:bg-opacity-100 sm:hover:bg-opacity-100">
        <div className="relative w-full pt-[150%] mb-4">
          <Image
            src={wine.imageUrl}
            alt={wine.name}
            layout="fill"
            objectFit="contain"
            className="rounded"
          />
        </div>
        <h2 className="text-lg font-semibold text-center">{wine.name}</h2>
        <p className="text-sm text-gray-600">{wine.country}</p>
        <p className="text-sm text-gray-600">{wine.year}</p>
        <p className="text-sm text-gray-600">{wine.grapeVariety}</p>
      </div>
    </Link>
  )
}

