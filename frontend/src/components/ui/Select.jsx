export default function Select({
  label,
  error,
  hint,
  id,
  children,
  ...props
}) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <select id={id} className={error ? 'error' : ''} {...props}>
        {children}
      </select>
      {error && <p className="form-error">{error}</p>}
      {!error && hint && <p className="form-hint">{hint}</p>}
    </div>
  )
}
