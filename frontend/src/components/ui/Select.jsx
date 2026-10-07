import { forwardRef } from 'react'

const Select = forwardRef(function Select(
  { label, error, hint, id, children, ...props },
  ref,
) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <select id={id} ref={ref} className={error ? 'error' : ''} {...props}>
        {children}
      </select>
      {error && <p className="form-error">{error}</p>}
      {!error && hint && <p className="form-hint">{hint}</p>}
    </div>
  )
})

export default Select
