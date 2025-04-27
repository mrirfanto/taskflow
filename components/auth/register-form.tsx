'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from './auth-provider';
import { useRouter } from 'next/navigation';
import { AuthError } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Define form validation schema with zod
const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    mode: 'onSubmit',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  // Watch password field to calculate strength
  const password = form.watch('password');

  // Calculate password strength whenever password changes
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // Update password strength when password changes
  useEffect(() => {
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password));
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Account created!', {
        description:
          'Please check your email to verify your account before logging in.',
        duration: 5000,
        richColors: true,
      });
      router.push('/login');
    } catch (err) {
      console.error('Registration failed', err);
      const errorMessage =
        err instanceof AuthError
          ? err.message
          : 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
            {error}
          </div>
        )}
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    type="text"
                    autoCapitalize="words"
                    autoComplete="name"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <span className="text-xs text-muted-foreground">
                    Min. 8 characters
                  </span>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <div className="flex gap-1 h-1 mt-1">
                  <div
                    className={`w-1/4 h-full rounded-full ${
                      passwordStrength >= 1 ? 'bg-primary/30' : 'bg-muted'
                    }`}
                  ></div>
                  <div
                    className={`w-1/4 h-full rounded-full ${
                      passwordStrength >= 2 ? 'bg-primary/30' : 'bg-muted'
                    }`}
                  ></div>
                  <div
                    className={`w-1/4 h-full rounded-full ${
                      passwordStrength >= 3 ? 'bg-primary/30' : 'bg-muted'
                    }`}
                  ></div>
                  <div
                    className={`w-1/4 h-full rounded-full ${
                      passwordStrength >= 4 ? 'bg-primary/30' : 'bg-muted'
                    }`}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {passwordStrength === 0 && 'No password'}
                  {passwordStrength === 1 && 'Weak password'}
                  {passwordStrength === 2 && 'Medium strength'}
                  {passwordStrength === 3 && 'Strong password'}
                  {passwordStrength === 4 && 'Very strong password'}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I agree to the Terms and Conditions</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    By creating an account, you agree to our{' '}
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </Form>
  );
}
