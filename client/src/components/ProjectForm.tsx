import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROJECT_COLORS } from '@/constants/project';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useProjectMutation } from '@/hooks/useProject';

const formSchema = z.object({
  name: z.string().trim().min(1, 'Project name cannot be empty'),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
  isFavorite: z.boolean().optional(),
});

type ProjectFormProps = {
  className?: string;
  onDone?: () => void;
};

export const ProjectForm = ({ className, onDone }: ProjectFormProps) => {
  const { createProject } = useProjectMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      color: '#808080',
      isFavorite: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createProject.mutate(values, {
      onSuccess: () => {
        form.reset();
        onDone?.();
      },
    });
  };
  return (
    <div className={cn('', className)}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      autoFocus
                      type='text'
                      placeholder='Project name'
                      className='pr-13'
                      maxLength={130}
                      {...field}
                    />
                    <span
                      className={cn(
                        'text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 text-xs',
                        field.value.length > 100 && 'text-red-500',
                      )}
                    >
                      {field.value.length}/130
                    </span>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='color'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select color' />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_COLORS.map(({ label, value }) => (
                        <SelectItem
                          value={value}
                          key={value}
                        >
                          <div
                            style={{
                              backgroundColor: `${value}`,
                            }}
                            className='size-3.5 rounded-full'
                          />
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='isFavorite'
            render={({ field }) => (
              <FormItem className='flex items-center'>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className='font-normal'>Add to favorites</FormLabel>
              </FormItem>
            )}
          />
          <div className='flex items-center justify-end gap-2 border-t pt-3'>
            <Button
              type='button'
              variant='secondary'
              size='sm'
              className='rounded-[6px]'
              onClick={onDone}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              size='sm'
              className='min-w-16 rounded-[6px]'
              disabled={createProject.isPending || !form.formState.isValid}
            >
              {createProject.isPending ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
