export default function LoadingState({ label = "Carregando dados..." }) {
    return <div className="loading-state"><span className="spinner"/>{label}</div>;
}
