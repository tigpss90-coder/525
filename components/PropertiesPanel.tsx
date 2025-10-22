'use client';

import { useState, useEffect } from 'react';
import { SelectedElement } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PropertiesPanelProps {
  selectedElement: SelectedElement | null;
  onContentChange: () => void;
}

export function PropertiesPanel({ selectedElement, onContentChange }: PropertiesPanelProps) {
  const [textContent, setTextContent] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [color, setColor] = useState('');
  const [fontWeight, setFontWeight] = useState('');

  const [imageSrc, setImageSrc] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');

  useEffect(() => {
    if (!selectedElement) return;

    const element = selectedElement.element;
    const computedStyle = window.getComputedStyle(element);

    if (selectedElement.isText) {
      setTextContent(element.textContent || '');
      setFontSize(computedStyle.fontSize);
      setColor(rgbToHex(computedStyle.color));
      setFontWeight(computedStyle.fontWeight);
    }

    if (selectedElement.isImage) {
      const img = element as HTMLImageElement;
      setImageSrc(img.src);
      setImageAlt(img.alt);
      setImageWidth(img.width.toString());
      setImageHeight(img.height.toString());
    }
  }, [selectedElement]);

  const rgbToHex = (rgb: string): string => {
    if (rgb.startsWith('#')) return rgb;
    const matches = rgb.match(/\d+/g);
    if (!matches || matches.length < 3) return '#000000';
    const hex = matches.slice(0, 3).map(x => {
      const h = parseInt(x).toString(16);
      return h.length === 1 ? '0' + h : h;
    }).join('');
    return `#${hex}`;
  };

  const handleTextUpdate = () => {
    if (!selectedElement || !selectedElement.isText) return;

    const element = selectedElement.element;
    element.textContent = textContent;

    if (fontSize) element.style.fontSize = fontSize.includes('px') ? fontSize : `${fontSize}px`;
    if (color) element.style.color = color;
    if (fontWeight) element.style.fontWeight = fontWeight;

    onContentChange();
  };

  const handleImageUpdate = () => {
    if (!selectedElement || !selectedElement.isImage) return;

    const img = selectedElement.element as HTMLImageElement;

    if (imageSrc) img.src = imageSrc;
    if (imageAlt) img.alt = imageAlt;
    if (imageWidth) img.width = parseInt(imageWidth);
    if (imageHeight) img.height = parseInt(imageHeight);

    onContentChange();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!selectedElement) {
    return (
      <div className="w-80 bg-gray-50 border-l p-4" role="complementary" aria-label="Properties panel">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Select an element to edit its properties</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-l p-4 overflow-auto" role="complementary" aria-label="Properties panel">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Element Properties</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            {selectedElement.tagName} {selectedElement.id && `(${selectedElement.id})`}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedElement.isText && (
            <>
              <div className="space-y-2">
                <Label htmlFor="text-content">Text Content</Label>
                <Textarea
                  id="text-content"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="min-h-[80px]"
                  aria-label="Edit text content"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size (px)</Label>
                <Input
                  id="font-size"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  placeholder="16px"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-weight">Font Weight</Label>
                <Input
                  id="font-weight"
                  value={fontWeight}
                  onChange={(e) => setFontWeight(e.target.value)}
                  placeholder="400, 700, bold"
                />
              </div>

              <Button onClick={handleTextUpdate} className="w-full" aria-label="Apply text changes">
                Apply Changes
              </Button>
            </>
          )}

          {selectedElement.isImage && (
            <>
              <div className="space-y-2">
                <Label htmlFor="image-upload">Upload New Image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="image-src">Image URL</Label>
                <Input
                  id="image-src"
                  value={imageSrc}
                  onChange={(e) => setImageSrc(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-alt">Alt Text</Label>
                <Input
                  id="image-alt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Image description"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="image-width">Width (px)</Label>
                  <Input
                    id="image-width"
                    type="number"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-height">Height (px)</Label>
                  <Input
                    id="image-height"
                    type="number"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleImageUpdate} className="w-full" aria-label="Apply image changes">
                Apply Changes
              </Button>
            </>
          )}

          {!selectedElement.isText && !selectedElement.isImage && (
            <p className="text-sm text-gray-500">
              This element type does not have editable properties in this panel.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
