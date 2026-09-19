import { cn } from '@/lib/cn';

export function Alert({ className, ...props }) { return <div role="alert" className={cn('alert', className)} {...props} />; }
