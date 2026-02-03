'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageItem {
  id: string;
  src: string;
  alt: string;
  title: string;
}

interface MasonryGridProps {
  images: ImageItem[];
  className?: string;
  onImageClick?: (image: ImageItem) => void;
}

export default function MasonryGrid({ images, className, onImageClick }: MasonryGridProps) {
  return (
    <div className={cn("columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 p-4", className)}>
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          layoutId={`image-${image.id}`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index % 3 * 0.1 }}
          className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-zoom-in border border-white/5 bg-gray-900"
          onClick={() => onImageClick && onImageClick(image)}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <h3 className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {image.title}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
