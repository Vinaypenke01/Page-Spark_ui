/**
 * Form Validation Schemas
 * 
 * Zod schemas for type-safe form validation across the application.
 */

import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase()
    .trim();

/**
 * Password validation schema
 */
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Login form schema
 */
export const loginSchema = z.object({
    username: z.string().min(1, 'Username or Email is required'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form schema
 */
export const registerSchema = z
    .object({
        username: z.string().min(3, 'Username must be at least 3 characters').trim(),
        name: z.string().min(2, 'Name must be at least 2 characters').trim(),
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Page generation form schema
 */
export const pageGeneratorSchema = z.object({
    prompt: z
        .string()
        .min(10, 'Please provide a more detailed description (at least 10 characters)')
        .max(1000, 'Description is too long (max 1000 characters)')
        .trim(),
    email: emailSchema,
    pageType: z.enum(['birthday', 'event', 'landing', 'portfolio', 'announcement', 'other']).optional(),
    theme: z.enum(['light', 'dark', 'colorful', 'modern', 'elegant']).optional(),
});

export type PageGeneratorFormData = z.infer<typeof pageGeneratorSchema>;

/**
 * Admin creation form schema
 */
export const createAdminSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string(),
        role: z.enum(['admin', 'super_admin']),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type CreateAdminFormData = z.infer<typeof createAdminSchema>;

/**
 * Utility function to format Zod errors for display
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
    const errors: Record<string, string> = {};
    error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
    });
    return errors;
}

/**
 * Password strength checker
 */
export function getPasswordStrength(password: string): {
    score: number;
    label: 'weak' | 'fair' | 'good' | 'strong';
    feedback: string[];
} {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (password.length < 8) feedback.push('Use at least 8 characters');
    if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
    if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters');
    if (!/[0-9]/.test(password)) feedback.push('Add numbers');
    if (!/[^A-Za-z0-9]/.test(password)) feedback.push('Add special characters');

    let label: 'weak' | 'fair' | 'good' | 'strong';
    if (score <= 2) label = 'weak';
    else if (score <= 3) label = 'fair';
    else if (score <= 4) label = 'good';
    else label = 'strong';

    return { score, label, feedback };
}
