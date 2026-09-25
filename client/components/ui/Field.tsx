import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

/** Label + control + hint/error wrapper. Every form field in the app uses this. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  children,
}: {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="z-field">
      {label && (
        <label className="z-label" htmlFor={htmlFor}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="z-error-text" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="z-hint">{hint}</span>
      ) : null}
    </div>
  );
}

export function Input({
  className = "",
  invalid = false,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input {...props} aria-invalid={invalid || undefined} className={`input ${className}`.trim()} />;
}

export function Textarea({
  className = "",
  invalid = false,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea {...props} aria-invalid={invalid || undefined} className={`textarea ${className}`.trim()} />;
}

export function Select({
  className = "",
  invalid = false,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select {...props} aria-invalid={invalid || undefined} className={`select ${className}`.trim()}>
      {children}
    </select>
  );
}

export function Checkbox({
  className = "",
  children,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { children?: ReactNode }) {
  return (
    <label className={`z-check ${className}`.trim()}>
      <input type="checkbox" {...props} />
      {children ? <span>{children}</span> : null}
    </label>
  );
}

export function Toggle({
  className = "",
  children,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { children?: ReactNode }) {
  return (
    <label className={`z-toggle ${className}`.trim()}>
      <input type="checkbox" role="switch" {...props} />
      <span className="z-toggle-track" aria-hidden="true" />
      {children ? <span>{children}</span> : null}
    </label>
  );
}
