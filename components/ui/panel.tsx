import { cn } from '@/lib/utils';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Panel({ className, children, ...props }: PanelProps) {
  return (
    <div 
      className={cn('glass-card rounded-[28px] p-5 md:p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}
