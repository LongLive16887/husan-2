"use client"

import { useState } from "react"
import { Copy, Check, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstallPWA } from "@/components/install-pwa"

export default function ColorMapper() {
  const [color, setColor] = useState<{ r: number; g: number; b: number }>({ r: 14, g: 165, b: 233 }) // #0ea5e9 (sky-500)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("rgb")

  const hexColor = `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`
  const rgbColor = `rgb(${color.r}, ${color.g}, ${color.b})`
  const hslColor = rgbToHsl(color.r, color.g, color.b)

  function rgbToHsl(r: number, g: number, b: number) {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s,
      l = (max + min) / 2

    if (max === min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }

      h /= 6
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleColorChange = (component: "r" | "g" | "b", value: number[]) => {
    setColor((prev) => ({ ...prev, [component]: value[0] }))
  }

  const complementaryColor = {
    r: 255 - color.r,
    g: 255 - color.g,
    b: 255 - color.b,
  }

  const analogousColors = [
    {
      r: Math.min(255, Math.max(0, color.r + 30)),
      g: Math.min(255, Math.max(0, color.g - 30)),
      b: Math.min(255, Math.max(0, color.b - 30)),
    },
    {
      r: Math.min(255, Math.max(0, color.r - 30)),
      g: Math.min(255, Math.max(0, color.g + 30)),
      b: Math.min(255, Math.max(0, color.b + 30)),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white">
            <Palette className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Color Mapper</h1>
        </div>
        <InstallPWA />
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Color Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-40 rounded-md mb-4 flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: rgbColor }}
          >
            <span
              className="font-mono text-lg px-3 py-1 rounded-md bg-white/20 backdrop-blur-sm"
              style={{ color: `rgb(${complementaryColor.r}, ${complementaryColor.g}, ${complementaryColor.b})` }}
            >
              {hexColor}
            </span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="rgb">RGB</TabsTrigger>
              <TabsTrigger value="hex">HEX</TabsTrigger>
              <TabsTrigger value="hsl">HSL</TabsTrigger>
            </TabsList>
            <TabsContent value="rgb" className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>R: {color.r}</span>
                  <span className="text-red-500">Red</span>
                </div>
                <Slider
                  value={[color.r]}
                  min={0}
                  max={255}
                  step={1}
                  onValueChange={(value) => handleColorChange("r", value)}
                  className="[&_[role=slider]]:bg-red-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>G: {color.g}</span>
                  <span className="text-green-500">Green</span>
                </div>
                <Slider
                  value={[color.g]}
                  min={0}
                  max={255}
                  step={1}
                  onValueChange={(value) => handleColorChange("g", value)}
                  className="[&_[role=slider]]:bg-green-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>B: {color.b}</span>
                  <span className="text-blue-500">Blue</span>
                </div>
                <Slider
                  value={[color.b]}
                  min={0}
                  max={255}
                  step={1}
                  onValueChange={(value) => handleColorChange("b", value)}
                  className="[&_[role=slider]]:bg-blue-500"
                />
              </div>
              <Button onClick={() => copyToClipboard(rgbColor)} className="w-full" variant="outline">
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {rgbColor}
              </Button>
            </TabsContent>
            <TabsContent value="hex">
              <Button onClick={() => copyToClipboard(hexColor)} className="w-full" variant="outline">
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {hexColor}
              </Button>
            </TabsContent>
            <TabsContent value="hsl">
              <Button onClick={() => copyToClipboard(hslColor)} className="w-full" variant="outline">
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {hslColor}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <div
                className="w-full aspect-square rounded-md"
                style={{
                  backgroundColor: `rgb(${analogousColors[0].r}, ${analogousColors[0].g}, ${analogousColors[0].b})`,
                }}
              ></div>
              <p className="text-xs text-center font-mono">Analogous 1</p>
            </div>
            <div className="space-y-1">
              <div className="w-full aspect-square rounded-md" style={{ backgroundColor: rgbColor }}></div>
              <p className="text-xs text-center font-mono">Primary</p>
            </div>
            <div className="space-y-1">
              <div
                className="w-full aspect-square rounded-md"
                style={{
                  backgroundColor: `rgb(${analogousColors[1].r}, ${analogousColors[1].g}, ${analogousColors[1].b})`,
                }}
              ></div>
              <p className="text-xs text-center font-mono">Analogous 2</p>
            </div>
            <div className="space-y-1 col-span-3">
              <div
                className="w-full h-12 rounded-md"
                style={{
                  backgroundColor: `rgb(${complementaryColor.r}, ${complementaryColor.g}, ${complementaryColor.b})`,
                }}
              ></div>
              <p className="text-xs text-center font-mono">Complementary</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardFooter className="flex flex-col items-center text-center text-sm text-muted-foreground pt-6">
          <p>Автор: Жабборов Хусанбой</p>
          <p>© 2025</p>
        </CardFooter>
      </Card>
    </div>
  )
}
