import SanityImage from '@/app/components/sanity-image';
import { client } from '@/sanity/client';

export default async function About() {
  const about = await client.fetch('*[_type == "about"]');

  return (
    <div className='flex flex-col items-center gap-y-4 text-center'>
      <SanityImage imgSource={about?.[0].mainProfileImage} className='w-36 rounded-full' alt='profile-image' />
      <div className='space-y-4'>
        <h1>Hi! My name is {about?.[0].name}</h1>
        <p className='font-semi text-lg'>{about?.[0].summary}</p>
      </div>
    </div>
  );
}
