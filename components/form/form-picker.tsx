/**
 * Form Image Picker Component
 *
 * This component provides an image selection interface with the following features:
 * - Unsplash API integration for image options
 * - Grid-based image selection UI
 * - Loading states and indicators
 * - Fallback to default images
 * - Attribution links for image creators
 *
 * @param id - Form field identifier
 * @param errors - Validation errors for the field
 */

'use client';

import Image from 'next/image';
import { Check, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { unsplash } from '@/lib/unsplash';
import { defaultImages } from '@/constants/images';
import Link from 'next/link';

import { FormErrors } from './form-errors';

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[]> | undefined;
}

interface UnsplashImage {
  id: string;
  urls: {
    thumb: string;
    full: string;
  };
  links: {
    html: string;
  };
  user: {
    name: string;
  };
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();

  const [images, setImages] = useState<UnsplashImage[]>(defaultImages);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // Fetch images from Unsplash on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ['317099'],
          count: 9,
        });
        if (result && result.response) {
          const newImages = result.response as UnsplashImage[];
          setImages(newImages);
        } else {
          console.error('Failed to get images from Unsplash');
        }
      } catch (error) {
        console.error(error);
        // Fall back to default images if API call fails
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              'cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted',
              pending && 'opacity-50 hover:opacity-50 cursor-auto'
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id);
            }}>
            {/* Hidden radio input for form submission */}
            <input
              type="radio"
              name={id}
              id={id}
              className="hidden"
              checked={selectedImageId === image.id}
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
            />
            <Image
              src={image.urls.thumb}
              alt="Unsplash Image"
              className="object-cover rounded-sm"
              fill
            />
            {selectedImageId === image.id && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              rel="noopener"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 hidden md:block">
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
};
