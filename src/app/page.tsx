import About from '@/app/components/about';
import Projects from '@/app/components/projects/projects';
import Skills from '@/app/components/skills';

export default async function IndexPage() {
  return (
    <main className='container mx-auto min-h-screen space-y-12 py-11'>
      <About />
      <Skills />
      <Projects />
    </main>
  );
}
