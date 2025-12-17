"use client"

interface FormTextareaProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
  disabled?: boolean;
}

export function FormTextarea({ label, id, value, onChange, placeholder, required, rows = 4, disabled }: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        disabled={disabled}
        className="w-full px-4 py-3 bg-input text-foreground placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
      />
    </div>
  )
}
