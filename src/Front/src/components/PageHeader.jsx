export default function PageHeader({ eyebrow, title, subtitle, action, children }) {
    return <div className="page-header">
    <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}{children}</div>
    {action && <div className="page-header__action">{action}</div>}
  </div>;
}
