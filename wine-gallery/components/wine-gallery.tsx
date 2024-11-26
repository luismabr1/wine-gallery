"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import WineBottle from './wine-bottle'

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

export default function WineGallery() {
  const [wines, setWines] = useState<Wine[]>([])
  const [filteredWines, setFilteredWines] = useState<Wine[]>([])
  const [filters, setFilters] = useState({
    country: 'all',
    year: '',
    grapeVariety: 'all'
  })
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoading(true);
    fetch('/wineData.json')
      .then(response => response.json())
      .then(data => {
        setWines(data);
        setFilteredWines(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching wine data:', error);
        setError('Failed to load wines. Please try again later.');
        setIsLoading(false);
      });
  }, [])

  const filterWines = useCallback(() => {
    const filtered = wines.filter(wine => 
      (filters.country === 'all' || wine.country === filters.country) &&
      (filters.year === '' || wine.year.toString() === filters.year) &&
      (filters.grapeVariety === 'all' || wine.grapeVariety === filters.grapeVariety)
    )
    setFilteredWines(filtered)
  }, [wines, filters])

  useEffect(() => {
    filterWines()
  }, [filterWines])

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      if (scrollLeft + clientWidth >= scrollWidth - 1) {
        // Load more wines when reaching the end
        setWines(prevWines => [...prevWines, ...wines])
      }

      // Highlight the centered wine on mobile
      const wineElements = scrollContainerRef.current.querySelectorAll('.wine-bottle')
      wineElements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const isCenter = rect.left <= (window.innerWidth / 2) && (window.innerWidth / 2) <= rect.right
        el.classList.toggle('mobile-highlight', isCenter)
      })
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (scrollContainerRef.current) {
        handleScroll()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleScroll])

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Wine Gallery</h1>
          <div className="flex flex-wrap gap-4">
            <div className="w-40">
              <Label htmlFor="country">Country</Label>
              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, country: value }))} defaultValue="all">
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Italy">Italy</SelectItem>
                  <SelectItem value="Spain">Spain</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder="All years"
                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
              />
            </div>
            <div className="w-40">
              <Label htmlFor="grapeVariety">Grape Variety</Label>
              <Select onValueChange={(value) => setFilters(prev => ({ ...prev, grapeVariety: value }))} defaultValue="all">
                <SelectTrigger id="grapeVariety">
                  <SelectValue placeholder="Select variety" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Varieties</SelectItem>
                  <SelectItem value="Cabernet Sauvignon">Cabernet Sauvignon</SelectItem>
                  <SelectItem value="Sangiovese">Sangiovese</SelectItem>
                  <SelectItem value="Shiraz">Shiraz</SelectItem>
                  <SelectItem value="Tempranillo">Tempranillo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </nav>
      <div 
        className="flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url('/placeholder.svg?height=600&width=1200&text=Bar+Counter&fontsize=30&bg=8B4513')" }}
      >
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto whitespace-nowrap p-4 pb-8"
          onScroll={handleScroll}
        >
          {isLoading ? (
            <p className="text-white">Loading wines...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="inline-flex gap-5 pr-4 snap-x snap-mandatory">
              {filteredWines.map(wine => (
                <div key={`${wine.id}-${wine.name}`} className="snap-center">
                  <WineBottle wine={wine} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-500 to-purple-500 text-transparent bg-clip-text">
              Wine Gallery
            </span>
          </h2>
          <p className="text-sm">
            Explore our curated selection of fine wines from around the world. 
            Discover the perfect bottle for any occasion.
          </p>
          <p className="text-sm mt-4">
            © 2023 Wine Gallery. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

