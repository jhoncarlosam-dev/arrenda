import { forwardRef } from 'react'

const Textarea = forwardRef(function Textarea(
  { label, error, hint, id, ...props },
  ref,
) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <textarea id={id} ref={ref} className={error ? 'error' : ''} {...props} />
      {error && <p className="form-error">{error}</p>}
      {!error && hint && <p className="form-hint">{hint}</p>}
    </div>
  )
})

export default Textarea
