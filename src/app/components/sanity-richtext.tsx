import { PortableText, PortableTextComponents } from 'next-sanity';

import { cn } from '@/lib/utils';

export default function SanityRichtext({ value, components = {}, className = '' }: { value: any; components?: PortableTextComponents; className?: string }) {
  return (
    <div className={cn('prose prose-sm', className)}>
      <PortableText value={value} components={{ ...components }} />
    </div>
  );
}
