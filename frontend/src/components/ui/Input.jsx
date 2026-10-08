import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, hint, id, className = '', ...props },
  ref,
) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        ref={ref}
        className={`${error ? 'error' : ''} ${className}`.trim()}
        {...props}
      />
      {error && <p className="form-error">{error}</p>}
      {!error && hint && <p className="form-hint">{hint}</p>}
    </div>
  )
})

export default Input
