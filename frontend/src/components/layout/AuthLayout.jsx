export default function AuthLayout({ title, tagline, features, children }) {
  return (
    <div className="auth-page">
      <div className="auth-brand">
        <h1>{title || 'Arrenda'}</h1>
        <p>{tagline}</p>
        <ul className="features">
          {features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="auth-form-panel">
        <div className="auth-card">{children}</div>
      </div>
    </div>
  )
}
