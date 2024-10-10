import { urlFor } from '@/app/lib/utils';
import { client } from '@/sanity/client';

export default async function About() {
  const about = await client.fetch('*[_type == "about"]');
  const profileImage = urlFor(about?.[0].mainProfileImage)?.url() || '';

  return (
    <div className='flex flex-col items-center gap-y-4 text-center'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={profileImage} className='w-36 rounded-full' alt='profile-image' />
      <div className='space-y-4'>
        <h1>Hi! My name is {about?.[0].name}</h1>
        <p className='font-semi text-lg'>{about?.[0].summary}</p>
      </div>
    </div>
  );
}
