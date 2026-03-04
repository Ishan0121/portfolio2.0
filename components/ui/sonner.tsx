'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          success:
            'group-[.toaster]:!bg-green-500/10 group-[.toaster]:!border-green-500/20 group-[.toaster]:!text-green-500 group-[.toaster]:!shadow-green-500/20 backdrop-blur-md',
          error:
            'group-[.toaster]:!bg-red-500/10 group-[.toaster]:!border-red-500/20 group-[.toaster]:!text-red-500 group-[.toaster]:!shadow-red-500/20 backdrop-blur-md',
          warning:
            'group-[.toaster]:!bg-yellow-500/10 group-[.toaster]:!border-yellow-500/20 group-[.toaster]:!text-yellow-500 group-[.toaster]:!shadow-yellow-500/20 backdrop-blur-md',
          info:
            'group-[.toaster]:!bg-blue-500/10 group-[.toaster]:!border-blue-500/20 group-[.toaster]:!text-blue-500 group-[.toaster]:!shadow-blue-500/20 backdrop-blur-md',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
