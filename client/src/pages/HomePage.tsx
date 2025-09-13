/**
 * Assets
 */
import homeTeamsIntroImage from '@/assets/home_teams_intro.avif';

/**
 * Components
 */
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className='mx-auto'>
      <div className='mt-20 flex'>
        <div className='h-fit flex-1 space-y-8 pl-15'>
          <h1 className='text-6xl font-bold'>
            Finally, <br />
            more clarity.
          </h1>
          <p className='text-muted-foreground font-quicksand text-xl font-semibold'>
            50+ million users organize their work and personal lives with the #1
            to-do app
          </p>
          <Button
            size={'lg'}
            className='text-lg'
          >
            Try it for free
          </Button>
        </div>
        <div className='rounded-xl border bg-orange-50'>
          <img
            src={homeTeamsIntroImage}
            alt='Home teams Intro Image'
            height={422}
            width={750}
            className='object-cover'
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
