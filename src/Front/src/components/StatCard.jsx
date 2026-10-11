export default function StatCard({ label, value, detail, icon, accent = false }) {
    return <article className={`stat-card ${accent ? "stat-card--accent" : ""}`}><div className="stat-card__top"><span>{label}</span><span className="stat-card__icon">{icon}</span></div><strong>{value}</strong>{detail && <small>{detail}</small>}</article>;
}
