import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import Link from 'next/link';

import SanityImage from '@/app/components/sanity-image';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel';
import { client } from '@/sanity/client';

export default async function Projects() {
  const projects = await client.fetch('*[_type == "project"]');

  return (
    <div className='space-y-6 text-center'>
      <h2>Projects</h2>
      <div className='hidden grid-cols-2 gap-4 md:grid'>
        {projects?.map((project: any) => {
          return (
            <Card className='relative rounded-t-none text-left shadow-lg md:flex-1' key={project.title}>
              <Carousel className='z-2'>
                <CarouselContent>
                  {project.images.map((img: SanityImageSource, index: number) => (
                    <CarouselItem key={index}>
                      <SanityImage imgSource={img} alt={`${project.title}-image-${index}`} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <Link href={project.projectUrl || ''} target='__blank' className='group/item text-left shadow-lg md:flex-1'>
                <CardHeader className='text-xl group-hover/item:underline'>{project.title}</CardHeader>
                <CardContent>
                  <p>{project.description}</p>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>

      <div className='block md:hidden'>
        <Carousel className='z-2'>
          <CarouselContent>
            {projects.map((project: any) => (
              <CarouselItem key={project.title}>
                <SanityImage imgSource={project.images[0]} alt={`${project.title}-image`} />
                <Link href={project.projectUrl || ''} target='__blank' className='group/item text-left shadow-lg md:flex-1'>
                  <CardHeader className='text-xl group-hover/item:underline'>{project.title}</CardHeader>
                  <CardContent>
                    <p>{project.description}</p>
                  </CardContent>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='-left-2' />
          <CarouselNext className='-right-2' />
        </Carousel>
      </div>
    </div>
  );
}
