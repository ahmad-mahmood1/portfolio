import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/app/components/ui/carousel';

export function ProjectImagesCarousel({ imageUrls }: { imageUrls: string[] }) {
  return (
    <Carousel className='z-2'>
      <CarouselContent>
        {imageUrls.map((img, index) => (
          <CarouselItem key={index}>
            <img src={img} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
