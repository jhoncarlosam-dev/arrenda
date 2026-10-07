export default function Button({
  variant = 'primary',
  size = 'default',
  className = '',
  type = 'button',
  children,
  ...props
}) {
  const classes = ['btn', `btn-${variant}`]
  if (size === 'sm') classes.push('btn-sm')
  if (className) classes.push(className)
  return (
    <button type={type} className={classes.join(' ')} {...props}>
      {children}
    </button>
  )
}
