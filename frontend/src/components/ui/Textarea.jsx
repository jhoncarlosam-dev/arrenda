export default function Textarea({
  label,
  error,
  hint,
  id,
  ...props
}) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <textarea id={id} className={error ? 'error' : ''} {...props} />
      {error && <p className="form-error">{error}</p>}
      {!error && hint && <p className="form-hint">{hint}</p>}
    </div>
  )
}
