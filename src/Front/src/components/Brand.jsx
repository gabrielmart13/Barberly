import Icon from "./Icon";
export default function Brand({ compact = false, light = false }) {
    return (<div className={`brand ${compact ? "brand--compact" : ""} ${light ? "brand--light" : ""}`}>
      <span className="brand__mark"><Icon name="scissors" size={compact ? 29 : 37} strokeWidth={1.5}/></span>
      <span className="brand__text"><strong>BARBERLY</strong><small>SEU ESTILO, NOSSO HORÁRIO</small></span>
    </div>);
}
