import Icon from "./Icon";
export default function Notice({ type = "info", children, onClose }) {
    if (!children)
        return null;
    return <div className={`notice notice--${type}`} role={type === "error" ? "alert" : "status"}>
    <Icon name={type === "error" || type === "warning" ? "warning" : type === "success" ? "check" : "info"} size={18}/>
    <div>{children}</div>
    {onClose && <button className="icon-button notice__close" type="button" aria-label="Fechar aviso" onClick={onClose}><Icon name="close" size={16}/></button>}
  </div>;
}
