'use client';

import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import Image from 'next/image';
import { useNextSanityImage } from 'next-sanity-image';

import { cn } from '@/lib/utils';
import { client } from '@/sanity/client';

function SanityImage({ imgSource, className = '', alt = '' }: { imgSource: SanityImageSource; className?: string; alt: string }) {
  const imageProps = useNextSanityImage(client, imgSource);

  return <Image {...imageProps} alt={alt} sizes='(max-width: 800px) 100vw, 800px' className={cn('h-auto w-full', className)} />;
}

export default SanityImage;
