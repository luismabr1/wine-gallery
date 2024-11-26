'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

type Wine = {
  id: number
  name: string
  country: string
  year: number
  grapeVariety: string
  imageUrl: string
  gallery: string[]
  history: string
  details: string
}

export default function WineDetailPage() {
  const { id } = useParams()
  const [wine, setWine] = useState<Wine | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetch('/wineData.json')
      .then(response => response.json())
      .then(data => {
        const wineId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id)
        const foundWine = data.find((w: Wine) => w.id === wineId)
        setWine(foundWine || null)
      })
  }, [id])

  useEffect(() => {
    if (wine) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % wine.gallery.length)
      }, 5000) // Change image every 5 seconds

      return () => clearInterval(timer)
    }
  }, [wine])

  if (!wine) {
    return <div>Wine not found</div>
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % wine.gallery.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + wine.gallery.length) % wine.gallery.length)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{wine.name}</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative">
          <div className="aspect-w-3 aspect-h-4 relative">
            <Image
              src={wine.gallery[currentImageIndex]}
              alt={`${wine.name} - Image ${currentImageIndex + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button variant="outline" size="icon" onClick={prevImage} className="rounded-full bg-white/80 hover:bg-white">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextImage} className="rounded-full bg-white/80 hover:bg-white">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Wine Details</h2>
          <p className="mb-2"><strong>Country:</strong> {wine.country}</p>
          <p className="mb-2"><strong>Year:</strong> {wine.year}</p>
          <p className="mb-2"><strong>Grape Variety:</strong> {wine.grapeVariety}</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">History</h3>
          <p className="mb-4">{wine.history}</p>
          <h3 className="text-xl font-semibold mb-2">Tasting Notes</h3>
          <p>{wine.details}</p>
        </div>
      </div>
    </div>
  )
}

