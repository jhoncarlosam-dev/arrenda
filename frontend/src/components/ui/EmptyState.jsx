import Button from './Button'

export default function EmptyState({ icon, title, description, ctaLabel, onCta }) {
  return (
    <div className="empty-state">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {ctaLabel && onCta && (
        <Button variant="primary" onClick={onCta}>
          {ctaLabel}
        </Button>
      )}
    </div>
  )
}
