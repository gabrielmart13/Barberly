import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import Icon from "../../components/Icon";
import servicoService from "../../services/servicoService";
import categoriaService from "../../services/categoriaServicoService";
import { apiMessage, asArray, idOf, nameOf, read } from "../../utils/data";
import { getOwnBarbearias, getSelectedBarbeariaId } from "../../utils/ownerData";
import "./FormServico.css";
export default function FormServico() {
    const { id } = useParams();
    const edit = Boolean(id);
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ Nome: "", Valor: "", TempoEstimado: "30", IdCategoria: "", IdBarbearia: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => { let active = true; (async () => { try {
        const [own, cat] = await Promise.all([getOwnBarbearias(), categoriaService.listar()]);
        if (!active)
            return;
        setShops(own);
        setCategories(asArray(cat));
        setForm(p => ({ ...p, IdBarbearia: String(getSelectedBarbeariaId(own) ?? ""), IdCategoria: String(idOf(asArray(cat)[0], "categoria") ?? "") }));
        if (edit) {
            const s = await servicoService.buscarPorId(id);
            if (active)
                setForm({ Nome: read(s, "nome", "Nome") ?? "", Valor: String(read(s, "valor", "Valor") ?? ""), TempoEstimado: String(read(s, "tempoEstimado", "TempoEstimado") ?? "30"), IdCategoria: String(read(s, "idCategoria", "IdCategoria") ?? ""), IdBarbearia: String(read(s, "idBarbearia", "IdBarbearia") ?? "") });
        }
    }
    catch (e) {
        if (active)
            setError(apiMessage(e, "Não foi possível carregar os dados do serviço."));
    }
    finally {
        if (active)
            setLoading(false);
    } })(); return () => { active = false; }; }, [id, edit]);
    function update(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })); }
    async function submit(e) { e.preventDefault(); setError(""); if (Number(form.Valor) < 0 || Number(form.TempoEstimado) <= 0) {
        setError("Informe um preço não negativo e uma duração maior que zero.");
        return;
    } setSaving(true); try {
        const payload = { Nome: form.Nome.trim(), Valor: Number(form.Valor), TempoEstimado: Number(form.TempoEstimado), IdCategoria: Number(form.IdCategoria), IdBarbearia: Number(form.IdBarbearia) };
        if (edit)
            await servicoService.atualizar(id, payload);
        else
            await servicoService.criar(payload);
        navigate("/dono/servicos", { replace: true });
    }
    catch (e) {
        setError(apiMessage(e, "Não foi possível salvar o serviço."));
    }
    finally {
        setSaving(false);
    } }
    return <div className="page"><PageHeader title={edit ? "Editar serviço" : "Novo serviço"} subtitle="Defina nome, preço, duração e categoria." action={<Link className="btn btn--ghost" to="/dono/servicos"><Icon name="back" size={17}/> Voltar aos serviços</Link>}/>{error && <Notice type="error">{error}</Notice>}{loading ? <LoadingState /> : !shops.length ? <Notice type="warning">Cadastre primeiro sua barbearia.</Notice> : !categories.length ? <Notice type="warning">Cadastre uma categoria antes de criar um serviço. A listagem de categorias depende também da correção do await no CategoriaServicoController.</Notice> : <form className="panel" onSubmit={submit}><div className="panel__header"><div><h2>Detalhes do serviço</h2><p>Os campos correspondem ao CriarServicoRequest / AtualizarServicoRequest.</p></div><Icon name="scissors" size={24}/></div><div className="form-grid"><div className="field field--full"><label htmlFor="Nome">Nome do serviço *</label><input id="Nome" name="Nome" value={form.Nome} onChange={update} placeholder="Ex.: Corte de cabelo" required/></div><div className="field"><label htmlFor="Valor">Preço (R$) *</label><input id="Valor" name="Valor" type="number" min="0" step="0.01" value={form.Valor} onChange={update} required/></div><div className="field"><label htmlFor="TempoEstimado">Duração estimada (minutos) *</label><input id="TempoEstimado" name="TempoEstimado" type="number" min="1" step="1" value={form.TempoEstimado} onChange={update} required/></div><div className="field"><label htmlFor="IdCategoria">Categoria *</label><select id="IdCategoria" name="IdCategoria" value={form.IdCategoria} onChange={update} required>{categories.map(c => <option key={idOf(c, "categoria")} value={idOf(c, "categoria")}>{nameOf(c)}</option>)}</select></div><div className="field"><label htmlFor="IdBarbearia">Barbearia *</label><select id="IdBarbearia" name="IdBarbearia" value={form.IdBarbearia} onChange={update} required>{shops.map(s => <option key={idOf(s, "barbearia")} value={idOf(s, "barbearia")}>{nameOf(s)}</option>)}</select></div></div><div className="form-actions"><Link to="/dono/servicos" className="btn btn--ghost">Cancelar</Link><button className="btn btn--primary" type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar serviço"}<Icon name="check" size={17}/></button></div></form>}</div>;
}
