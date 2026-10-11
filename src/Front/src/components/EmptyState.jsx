import Icon from "./Icon";
export default function EmptyState({ title = "Nada por aqui ainda", text = "Quando houver dados, eles aparecerão nesta área.", action }) {
    return <div className="empty-state"><span className="empty-state__icon"><Icon name="calendar" size={29}/></span><h3>{title}</h3><p>{text}</p>{action}</div>;
}
