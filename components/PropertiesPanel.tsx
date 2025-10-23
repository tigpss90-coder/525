'use client';

import { useState, useEffect } from 'react';
import { SelectedElement } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction } from '@/components/ui/alert-dialog';
import { validateWidth, validateHeight, validateFontSize, validateFontWeight, DEFAULT_LIMITS } from '@/lib/validation';

interface PropertiesPanelProps {
  selectedElement: SelectedElement | null;
  onContentChange: (html: string) => void;
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

  const [validationError, setValidationError] = useState('');
  const [showValidationDialog, setShowValidationDialog] = useState(false);

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

    const fontSizeValue = parseInt(fontSize.replace('px', ''));
    const fontWeightValue = parseInt(fontWeight);

    if (fontSize && !isNaN(fontSizeValue)) {
      const fontSizeValidation = validateFontSize(fontSizeValue);
      if (!fontSizeValidation.isValid) {
        setValidationError(fontSizeValidation.error!);
        setShowValidationDialog(true);
        return;
      }
    }

    if (fontWeight && !isNaN(fontWeightValue)) {
      const fontWeightValidation = validateFontWeight(fontWeightValue);
      if (!fontWeightValidation.isValid) {
        setValidationError(fontWeightValidation.error!);
        setShowValidationDialog(true);
        return;
      }
    }

    const element = selectedElement.element;
    element.textContent = textContent;

    if (fontSize) element.style.fontSize = fontSize.includes('px') ? fontSize : `${fontSize}px`;
    if (color) element.style.color = color;
    if (fontWeight) element.style.fontWeight = fontWeight;

    const container = element.parentElement;
    if (container) {
      onContentChange(container.innerHTML);
    }
  };

  const handleImageUpdate = () => {
    if (!selectedElement || !selectedElement.isImage) return;

    const widthValue = parseInt(imageWidth);
    const heightValue = parseInt(imageHeight);

    if (imageWidth && !isNaN(widthValue)) {
      const widthValidation = validateWidth(widthValue);
      if (!widthValidation.isValid) {
        setValidationError(widthValidation.error!);
        setShowValidationDialog(true);
        return;
      }
    }

    if (imageHeight && !isNaN(heightValue)) {
      const heightValidation = validateHeight(heightValue);
      if (!heightValidation.isValid) {
        setValidationError(heightValidation.error!);
        setShowValidationDialog(true);
        return;
      }
    }

    const img = selectedElement.element as HTMLImageElement;

    if (imageAlt) img.alt = imageAlt;

    const container = img.parentElement;

    if (imageSrc && imageSrc !== img.src) {
      img.src = imageSrc;

      img.onload = () => {
        if (imageWidth && !isNaN(widthValue)) {
          img.width = widthValue;
        }
        if (imageHeight && !isNaN(heightValue)) {
          img.height = heightValue;
        }
        if (container) {
          onContentChange(container.innerHTML);
        }
      };
    } else {
      if (imageWidth && !isNaN(widthValue)) img.width = widthValue;
      if (imageHeight && !isNaN(heightValue)) img.height = heightValue;
      if (container) {
        onContentChange(container.innerHTML);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newSrc = event.target?.result as string;
        setImageSrc(newSrc);

        const tempImg = new Image();
        tempImg.onload = () => {
          setImageWidth(tempImg.naturalWidth.toString());
          setImageHeight(tempImg.naturalHeight.toString());
        };
        tempImg.src = newSrc;
      };
      reader.readAsDataURL(file);
    }
  };

  if (!selectedElement) {
    return (
      <div className="w-80 bg-gradient-to-b from-slate-50 to-white border-l border-slate-200 p-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <p className="text-sm text-slate-600 font-medium">No element selected</p>
              <p className="text-xs text-slate-400 mt-1">Click on an element to edit</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gradient-to-b from-slate-50 to-white border-l border-slate-200 p-6 overflow-auto">
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">Element Properties</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {selectedElement.tagName.toLowerCase()}
            </span>
            {selectedElement.id && (
              <span className="text-xs text-slate-500 font-mono">#{selectedElement.id}</span>
            )}
          </div>
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
                <p className="text-xs text-gray-500">Range: {DEFAULT_LIMITS.fontSize.min}-{DEFAULT_LIMITS.fontSize.max}px</p>
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
                <p className="text-xs text-gray-500">Range: {DEFAULT_LIMITS.fontWeight.min}-{DEFAULT_LIMITS.fontWeight.max} (multiples of 100)</p>
              </div>

              <Button onClick={handleTextUpdate} className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
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

              <div className="space-y-2">
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
                <p className="text-xs text-gray-500">Range: {DEFAULT_LIMITS.width.min}-{DEFAULT_LIMITS.width.max}px</p>
              </div>

              <Button onClick={handleImageUpdate} className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
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

      <AlertDialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exceeding Range Limit</AlertDialogTitle>
            <AlertDialogDescription>
              {validationError}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowValidationDialog(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
