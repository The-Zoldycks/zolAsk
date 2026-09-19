import { cn } from '@/lib/cn';

const variants = {
  default: 'button button-default',
  secondary: 'button button-secondary',
  outline: 'button button-outline',
  ghost: 'button button-ghost',
  destructive: 'button button-destructive',
};

export function Button({ className, variant = 'default', size = 'default', ...props }) {
  return <button className={cn(variants[variant], size === 'icon' && 'button-icon', className)} {...props} />;
}
