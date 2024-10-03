import { urlFor } from '@/app/lib/utils';
import { client } from '@/sanity/client';

export default async function Skills() {
  const skills = await client.fetch('*[_type == "skill"]');

  return (
    <div className='text-center'>
      <h2>Skills</h2>
      <div className='flex flex-wrap items-center gap-2'>
        {skills?.map((skill: any) => {
          const skillIcon = skill?.asset ? urlFor(skill.asset)?.url() : '';

          return (
            <div key={skill.title}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={skillIcon} className='w-12' alt={skill.title} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
