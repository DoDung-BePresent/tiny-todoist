/**
 * Node modules
 */
import { useNavigate } from 'react-router';

/**
 * Assets
 */
import homeTeamsIntroImage from '@/assets/home_teams_intro.avif';
import homeTeamsIntroNarrowImage from '@/assets/home-teams_intro_narrow.avif';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import { PageHelmet } from '@/components/PageHelmet';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHelmet
        title='The #1 to-do app and task manager'
        description='50+ million users organize their work and personal lives with the #1 to-do app'
      />
      <div className='my-12 flex flex-col items-center gap-12 md:mt-20 md:gap-10 lg:flex-row lg:justify-between'>
        <div className='flex flex-col items-center space-y-8 text-center lg:max-w-md lg:items-start lg:space-y-6 lg:pl-15 lg:text-left'>
          <h1 className='text-4xl font-bold sm:text-5xl lg:text-6xl'>
            Finally, <br className='sm:hidden lg:block' />
            more clarity.
          </h1>
          <p className='font-quicksand text-muted-foreground max-w-md text-lg font-semibold text-pretty md:max-w-2xl md:text-xl'>
            50+ million users organize their work and personal lives with the #1
            to-do app
          </p>
          <Button
            size={'lg'}
            className='h-14 rounded-xl bg-[#dc4c3e] px-4 py-3 text-lg font-semibold text-white shadow-[0_4px_0_0_#b23a31] transition-all hover:translate-y-[2px] hover:bg-[#cc463a] hover:shadow-[0_2px_0_0_#b23a31] active:translate-y-[4px] active:shadow-none'
            onClick={() => navigate('/register')}
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
            className='hidden object-cover md:block'
          />
          <img
            src={homeTeamsIntroNarrowImage}
            alt='Home teams Intro Image'
            className='aspect-square w-full max-w-[430px] md:hidden'
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
