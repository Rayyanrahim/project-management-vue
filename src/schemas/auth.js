import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

const emailField = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Enter a valid email address')

const passwordField = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')

const withMatchingPasswords = (schema) =>
  schema.superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      })
    }
  })

export const registerSchema = withMatchingPasswords(
  z.object({
    name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  }),
)

export const forgotPasswordSchema = z.object({
  email: emailField,
})

export const verifyOtpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'Enter the six-digit verification code'),
})

export const resetPasswordSchema = withMatchingPasswords(
  z.object({
    token: z.string().regex(/^[a-f0-9]{64}$/i, 'This password reset link is invalid'),
    password: passwordField,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  }),
)
