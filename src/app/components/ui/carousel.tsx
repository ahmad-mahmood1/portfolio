'use client';

import * as React from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import { cn } from '@/lib/utils';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  tween?: boolean;
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

const TWEEN_FACTOR_BASE = 0.1;

const numberWithinRange = (number: number, min: number, max: number): number => Math.min(Math.max(number, min), max);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(({ orientation = 'horizontal', opts, tween = false, setApi, plugins, className, children, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const tweenNodes = React.useRef<HTMLElement[]>([]);
  const tweenFactor = React.useRef(0);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  const setTweenNodes = React.useCallback((emblaApi: CarouselApi): void => {
    tweenNodes.current = emblaApi?.slideNodes().map((slideNode) => slideNode.querySelector('#embla-slide') as HTMLElement) || [];
  }, []);

  const setTweenFactor = React.useCallback((emblaApi: CarouselApi) => {
    tweenFactor.current = emblaApi ? TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length : TWEEN_FACTOR_BASE;
  }, []);

  const tweenScale = React.useCallback((emblaApi: CarouselApi, eventName?: any) => {
    const engine = emblaApi?.internalEngine();
    const scrollProgress = emblaApi?.scrollProgress() || 0;
    const slidesInView = emblaApi?.slidesInView();
    const isScrollEvent = eventName === 'scroll';

    emblaApi?.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine?.slideRegistry[snapIndex];

      slidesInSnap?.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView?.includes(slideIndex)) return;

        if (engine?.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }

              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
        const scale = numberWithinRange(tweenValue, 0, 1).toString();
        const tweenNode = tweenNodes.current[slideIndex];

        tweenNode.style.transform = `scale(${scale})`;
      });
    });
  }, []);

  React.useEffect(() => {
    if (!api || !setApi) {
      return;
    }

    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);

    api.on('reInit', onSelect);
    api.on('select', onSelect);

    if (tween) {
      setTweenNodes(api);
      setTweenFactor(api);
      tweenScale(api);

      api.on('reInit', tweenScale);
      api.on('reInit', setTweenFactor);
      api.on('scroll', tweenScale);
      api.on('slideFocus', tweenScale);
      api.on('reInit', setTweenNodes);
    }

    return () => {
      api?.off('select', onSelect);
      api?.off('scroll', tweenScale);
      api?.off('slideFocus', tweenScale);
    };
  }, [api, tween, tweenFactor, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        tween,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div ref={ref} onKeyDownCapture={handleKeyDown} className={cn('relative', className)} role='region' aria-roledescription='carousel' {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
});

Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className='overflow-hidden'>
      <div ref={ref} className={cn('flex', orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col', className)} {...props} />
    </div>
  );
});

CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
  const { orientation, tween } = useCarousel();

  return (
    <div ref={ref} role='group' aria-roledescription='slide' className={cn('min-w-0 shrink-0 grow-0 basis-full', orientation === 'horizontal' ? 'pl-4' : 'pt-4', tween && 'basis-2/3 px-0.5', className)} {...props}>
      <div id='embla-slide'>{children}</div>
    </div>
  );
});

CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev, api } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute hidden h-8 w-8 rounded-full',
        orientation === 'horizontal' ? 'left-6 top-1/2 -translate-y-1/2' : '-top-6 left-1/2 -translate-x-1/2 rotate-90',
        api?.slideNodes() && api.slideNodes().length > 1 && 'inline-flex',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className='h-4 w-4' />
      <span className='sr-only'>Previous slide</span>
    </Button>
  );
});

CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext, api } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute hidden h-8 w-8 rounded-full',
        orientation === 'horizontal' ? 'right-6 top-1/2 -translate-y-1/2' : '-bottom-6 left-1/2 -translate-x-1/2 rotate-90',
        api?.slideNodes() && api.slideNodes().length > 1 && 'inline-flex',
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className='h-4 w-4' />
      <span className='sr-only'>Next slide</span>
    </Button>
  );
});

CarouselNext.displayName = 'CarouselNext';

export { Carousel, type CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious };
