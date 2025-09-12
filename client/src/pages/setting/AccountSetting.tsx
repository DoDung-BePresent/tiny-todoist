/**
 * Node modules
 */
import { z } from 'zod';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';
import { useUserMutations } from '@/hooks/useUser';

/**
 * Utils
 */
import { getAvatarColor } from '@/utils/color';

/**
 * Components
 */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name cannot be empty.'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().trim().min(1, 'Current password is required.'),
    newPassword: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match.",
    path: ['confirmPassword'],
  });

export const AccountSettings = () => {
  const { user } = useAuth();
  const { updateProfile, updatePassword } = useUserMutations();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '' },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append('avatar', file);
      updateProfile.mutate(formData);
    }
  };

  const handleRemoveAvatar = () => {
    const formData = new FormData();
    formData.append('removeAvatar', 'true');
    updateProfile.mutate(formData, {
      onSuccess: () => setAvatarPreview(null),
    });
  };

  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    const formData = new FormData();
    formData.append('name', values.name);
    updateProfile.mutate(formData);
  };

  const onPasswordSubmit = (values: z.infer<typeof passwordSchema>) => {
    updatePassword.mutate(values, {
      onSuccess: () => passwordForm.reset(),
    });
  };

  const avatarSrc = avatarPreview || user?.avatar;
  const avatarChar = user?.name?.charAt(0).toUpperCase() || '';
  const { bg, border } = getAvatarColor(avatarChar);

  return (
    <div className='space-y-6'>
      {/* Photo Section */}
      <div>
        <h3 className='text-lg font-semibold'>Photo</h3>
        <div className='mt-4 flex items-center gap-6'>
          <Avatar
            className='size-16'
            style={{ background: bg, border: `2px solid ${border}` }}
          >
            <AvatarImage
              src={avatarSrc ?? undefined}
              className='object-center'
            />
            <AvatarFallback
              className='text-2xl'
              style={{ background: bg, borderColor: border, color: border }}
            >
              {avatarChar}
            </AvatarFallback>
          </Avatar>
          <div className='flex items-center gap-2'>
            <input
              type='file'
              accept='image/*'
              ref={avatarInputRef}
              onChange={handleAvatarChange}
              className='hidden'
            />
            <Button
              type='button'
              variant='secondary'
              className='rounded-sm'
              size='sm'
              onClick={() => avatarInputRef.current?.click()}
            >
              Change photo
            </Button>
            <Button
              variant='outline'
              type='button'
              size='sm'
              onClick={handleRemoveAvatar}
              disabled={!user?.avatar}
              className='border-destructive text-destructive rounded-sm'
            >
              Remove photo
            </Button>
          </div>
        </div>
      </div>

      {/* Name Section */}
      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit(onProfileSubmit)}
          className='space-y-4'
        >
          <FormField
            control={profileForm.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className='w-2/5 rounded-sm'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {profileForm.formState.isDirty && (
            <Button
              type='submit'
              size='sm'
              disabled={
                !profileForm.formState.isDirty ||
                !profileForm.formState.isValid ||
                updateProfile.isPending
              }
              className='rounded-sm'
            >
              {updateProfile.isPending ? 'Saving...' : 'Save Name'}
            </Button>
          )}
        </form>
      </Form>

      <Separator />

      {/* Password Section */}
      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className='space-y-4'
        >
          <div>
            <h3 className='text-lg font-semibold'>Password</h3>
            <p className='text-muted-foreground text-sm'>
              Update your password here.
            </p>
          </div>
          <FormField
            control={passwordForm.control}
            name='currentPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <div className='relative w-2/5'>
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...field}
                      placeholder='••••••••••••'
                      className='rounded-sm'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute top-0 right-0.5 h-full hover:bg-transparent'
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
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
            control={passwordForm.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className='relative w-2/5'>
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      className='rounded-sm'
                      placeholder='••••••••••••'
                      {...field}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute top-0 right-0.5 h-full hover:bg-transparent'
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
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
            control={passwordForm.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <div className='relative w-2/5'>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className='rounded-sm'
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
            disabled={
              updatePassword.isPending ||
              !passwordForm.formState.isValid ||
              !passwordForm.formState.isDirty
            }
            size='sm'
            className='rounded-sm'
          >
            {updatePassword.isPending ? 'Saving...' : 'Change Password'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
