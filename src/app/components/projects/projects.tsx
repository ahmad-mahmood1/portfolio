import Link from 'next/link';

import { ProjectImagesCarousel } from '@/app/components/projects/project-image-carousel';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { urlFor } from '@/app/lib/utils';
import { client } from '@/sanity/client';

export default async function Projects() {
  const projects = await client.fetch('*[_type == "project"]');

  return (
    <div className='space-y-6 text-center'>
      <h2>Projects</h2>
      <div className='space-y-3 md:flex md:flex-wrap md:gap-x-2 md:space-y-0'>
        {projects?.map((project: any) => {
          const imageUrls = project.images.map((img: any) => urlFor(img)?.url());

          return (
            <Card className='rounded-t-none text-left shadow-lg md:flex-1' key={project.title}>
              <ProjectImagesCarousel imageUrls={imageUrls} />
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
    </div>
  );
}
