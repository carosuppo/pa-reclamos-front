"use client"

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  options: readonly SelectOption[]
  required?: boolean
  disabled?: boolean
}

export function FormSelect({ label, id, value, onChange, options, required, disabled }: FormSelectProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
      >
        <option value="">Seleccionar...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
