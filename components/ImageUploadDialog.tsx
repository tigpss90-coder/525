'use client';

import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ImageUploadDialogProps {
  onAddImage: (imageUrl: string) => void;
}

export function ImageUploadDialog({ onAddImage }: ImageUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError('');

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
      };
      reader.onerror = () => {
        setError('Failed to read file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateImageUrl = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;

      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  };

  const handleAddFromUrl = async () => {
    if (!imageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const isValid = await validateImageUrl(imageUrl);
      if (!isValid) {
        setError('Invalid image URL or image failed to load');
        setIsLoading(false);
        return;
      }

      onAddImage(imageUrl);
      setIsOpen(false);
      setImageUrl('');
      setError('');
    } catch (err) {
      setError('Failed to validate image URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUploadedImage = () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    onAddImage(uploadedImage);
    setIsOpen(false);
    setUploadedImage('');
    setError('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setImageUrl('');
    setUploadedImage('');
    setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
      else setIsOpen(true);
    }}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:bg-cyan-600/20 hover:text-cyan-300 transition-all duration-200 group"
        >
          <ImageIcon className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
          Add Image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Image</DialogTitle>
          <DialogDescription className="text-base">
            Upload an image from your computer or paste an image URL
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">Image URL</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label htmlFor="image-url" className="text-sm font-semibold">
                Image URL
              </Label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setError('');
                }}
                className="w-full"
              />
              {imageUrl && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">Preview:</p>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-full h-auto max-h-64 mx-auto rounded"
                    onError={() => setError('Failed to load image preview')}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label htmlFor="image-file" className="text-sm font-semibold">
                Upload Image
              </Label>
              <div className="bg-slate-50 p-6 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
                <input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer file:transition-colors"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
                </p>
              </div>
              {uploadedImage && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">Preview:</p>
                  <img
                    src={uploadedImage}
                    alt="Uploaded preview"
                    className="max-w-full h-auto max-h-64 mx-auto rounded"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} className="px-6">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (uploadedImage) {
                handleAddUploadedImage();
              } else {
                handleAddFromUrl();
              }
            }}
            disabled={(!imageUrl.trim() && !uploadedImage) || isLoading}
            className="px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validating...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 mr-2" />
                Add to Canvas
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
