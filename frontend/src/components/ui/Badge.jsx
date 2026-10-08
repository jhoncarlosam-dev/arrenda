export default function Badge({ variant = 'blue', children, className = '' }) {
  return <span className={`badge badge-${variant} ${className}`.trim()}>{children}</span>
}
