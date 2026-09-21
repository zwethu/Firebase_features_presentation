import type { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

const baseInputClasses =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-navy-950 placeholder:text-slate-400 focus:border-firebase-blue-500 focus:outline-none focus:ring-2 focus:ring-firebase-blue-500/30'

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="mb-1 block text-sm font-medium text-navy-900" {...props} />
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(baseInputClasses, className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(baseInputClasses, className)} {...props} />
}

export function FieldError({ children }: { children?: string | null }) {
  if (!children) return null
  return (
    <p role="alert" className="mt-1 text-sm text-red-600">
      {children}
    </p>
  )
}
