export default function Input({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} className={`${error ? 'error' : ''} ${className}`.trim()} {...props} />
      {error && <p className="form-error">{error}</p>}
      {!error && hint && <p className="form-hint">{hint}</p>}
    </div>
  )
}
