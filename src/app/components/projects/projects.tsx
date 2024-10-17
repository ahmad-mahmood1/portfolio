'use client';

import SanityImage from '@/app/components/sanity-image';
import SanityRichtext from '@/app/components/sanity-richtext';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel';

export default function Projects({ projects }: { projects: any }) {
  return (
    <Carousel opts={{ loop: true }} tween>
      <CarouselContent>
        {projects?.map((project: any) => {
          return (
            <CarouselItem key={project._id} className=''>
              <Card>
                <SanityImage imgSource={project.images[0]} alt={`${project.title}-image`} />
                <CardHeader className='text-xl'>{project.title}</CardHeader>
                <CardContent>
                  <p>{project.description}</p>
                  <SanityRichtext value={project.role} />
                </CardContent>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
