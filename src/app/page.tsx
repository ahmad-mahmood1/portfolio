import About from '@/app/components/about';
import Projects from '@/app/components/projects/projects';
import Skills from '@/app/components/skills';
import { client } from '@/sanity/client';

export default async function IndexPage() {
  const [about, skills, projects] = await Promise.all([client.fetch('*[_type == "about"]'), client.fetch('*[_type == "skill"]'), client.fetch('*[_type == "project"]')]);

  return (
    <main className='container mx-auto min-h-screen space-y-12 py-11'>
      <About />
      <Skills />
      <div className='space-y-6 text-center'>
        <h2>Projects</h2>
        <Projects projects={projects} />
      </div>
    </main>
  );
}
