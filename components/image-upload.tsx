"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Camera, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
}

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setPreviewImage(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const confirmUpload = () => {
    if (previewImage) {
      onImageUpload(previewImage)
    }
  }

  const clearImage = () => {
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (previewImage) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="relative inline-block">
            <Image
              src={previewImage || "/placeholder.svg"}
              alt="Preview"
              width={300}
              height={400}
              className="rounded-lg object-cover max-h-96"
            />
            <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={clearImage}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 space-x-2">
            <Button onClick={confirmUpload} size="lg">
              <Camera className="h-4 w-4 mr-2" />
              Use This Photo
            </Button>
            <Button variant="outline" onClick={clearImage}>
              Choose Different Photo
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload Your Photo</h3>
        <p className="text-gray-600 mb-4">Drag and drop your image here, or click to select</p>
        <Button onClick={() => fileInputRef.current?.click()} className="mb-4">
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
        <div className="text-xs text-gray-500 mt-4">
          <p>Supported formats: JPG, PNG, WebP</p>
          <p>Maximum file size: 10MB</p>
        </div>
      </div>
    </Card>
  )
}
