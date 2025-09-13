/**
 * Node modules
 */
import z from 'zod';
import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Assets
 */
import projectRedImage from '@/assets/project-red.avif';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';

/**
 * Components
 */
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z
  .object({
    email: z
      .string()
      .trim()
      .nonempty('Email is required')
      .email('Please enter a valid email address.')
      .max(50, 'Maximum 50 characters'),
    password: z
      .string()
      .trim()
      .nonempty('Password is required')
      .min(8, 'Minimum 8 characters')
      .max(50, 'Maximum 50 characters'),
    confirmPassword: z
      .string()
      .trim()
      .nonempty('Confirm Password is required')
      .min(8, 'Minimum 8 characters')
      .max(50, 'Maximum 50 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword'],
  });

const RegisterPage = () => {
  const { register, loginWithGithub } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await register.mutateAsync(values);
  };

  const handleGithubLogin = () => {
    loginWithGithub();
  };

  return (
    <div className='w-full max-w-sm md:max-w-4xl'>
      <div className='flex flex-col gap-6'>
        <Card className='overflow-hidden p-0 shadow-none'>
          <CardContent className='grid p-0 md:grid-cols-2'>
            <div className='p-6 md:p-8'>
              <div className='flex flex-col gap-6'>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-5'
                  >
                    <div className='flex flex-col items-center text-center'>
                      <h1 className='text-2xl font-bold'>Welcome 🎉</h1>
                      <p className='text-muted-foreground text-balance'>
                        Let's create your Tiny Todoist account
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              autoFocus
                              type='email'
                              placeholder='m@example.com'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='••••••••••••'
                                {...field}
                              />
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                className='absolute top-0 right-0.5 h-full hover:bg-transparent'
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <Eye className='text-muted-foreground' />
                                ) : (
                                  <EyeOff className='text-muted-foreground' />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='confirmPassword'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder='••••••••••••'
                                {...field}
                              />
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                className='absolute top-0 right-0.5 h-full hover:bg-transparent'
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <Eye className='text-muted-foreground' />
                                ) : (
                                  <EyeOff className='text-muted-foreground' />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type='submit'
                      disabled={register.isPending}
                      className='w-full'
                    >
                      {register.isPending ? 'Creating ...' : 'Create'}
                    </Button>
                    <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                      <span className='bg-card text-muted-foreground relative z-10 px-2'>
                        Or continue with
                      </span>
                    </div>
                    <Button
                      variant='outline'
                      type='button'
                      className='w-full'
                      disabled={register.isPending}
                      onClick={handleGithubLogin}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                      >
                        <path
                          d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
                          fill='currentColor'
                        />
                      </svg>
                      Continue with Github
                    </Button>
                  </form>
                </Form>
                <div className='text-center text-sm'>
                  Already have an account?{' '}
                  <Link
                    to='/login'
                    className='underline underline-offset-4'
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
            <div className='bg-muted relative hidden md:block'>
              <img
                src={projectRedImage}
                alt='Projects green image'
                className='absolute inset-0 h-full w-full object-cover object-left dark:brightness-[0.2] dark:grayscale'
              />
            </div>
          </CardContent>
        </Card>
        <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
          By clicking continue, you agree to our{' '}
          <a
            href='https://doist.com/terms-of-service'
            target='blank'
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href='https://doist.com/privacy'
            target='blank'
          >
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
