/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import Icon from "../../components/Icon";

import barbeariaService from "../../services/barbeariaService";

import {
    apiMessage,
    idOf,
    nameOf,
    read,
} from "../../utils/data";

import { getUserId } from "../../utils/session";
import {
    getOwnBarbearias,
    getSelectedBarbeariaId,
} from "../../utils/ownerData";

import "./ConfigurarBarbearia.css";

const empty = {
    Nome: "",
    Endereco: "",
    Contato: "",
    Descricao: "",
};

function getShopForm(shop) {
    if (!shop) {
        return { ...empty };
    }

    return {
        Nome: read(shop, "nome", "Nome") ?? "",
        Endereco: read(shop, "endereco", "Endereco") ?? "",
        Contato: read(shop, "contato", "Contato") ?? "",
        Descricao: read(shop, "descricao", "Descricao") ?? "",
    };
}

export default function ConfigurarBarbearia() {
    const [shops, setShops] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [form, setForm] = useState({ ...empty });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const load = useCallback(async (preferredId) => {
        setLoading(true);
        setError("");

        try {
            const result = await getOwnBarbearias();
            const ownShops = Array.isArray(result) ? result : [];

            setShops(ownShops);

            const savedId = getSelectedBarbeariaId(ownShops);
            const requestedId = preferredId ?? savedId;

            const selectedShop =
                ownShops.find(
                    (shop) =>
                        String(idOf(shop, "barbearia")) ===
                        String(requestedId ?? "")
                ) ?? ownShops[0] ?? null;

            const nextId = selectedShop
                ? String(idOf(selectedShop, "barbearia"))
                : "";

            setSelectedId(nextId);
            setForm(getShopForm(selectedShop));

            if (nextId) {
                localStorage.setItem("barberly:active-shop-id", nextId);
            } else {
                localStorage.removeItem("barberly:active-shop-id");
            }
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível carregar os dados da barbearia."
                )
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const editMode = Boolean(
        shops.some(
            (shop) =>
                String(idOf(shop, "barbearia")) ===
                String(selectedId)
        )
    );

    function update(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function choose(event) {
        const id = event.target.value;

        setMessage("");
        setError("");

        await load(id);
    }

    async function submit(event) {
        event.preventDefault();

        setError("");
        setMessage("");

        if (!form.Nome.trim() || !form.Endereco.trim()) {
            setError("Preencha o nome e o endereço da barbearia.");
            return;
        }

        setSaving(true);

        try {
            const payload = {
                Nome: form.Nome.trim(),
                Endereco: form.Endereco.trim(),
                Contato: form.Contato.trim(),
                Descricao: form.Descricao.trim(),
                IdDonoBarbearia: Number(getUserId()),
            };

            let result;

            if (editMode) {
                result = await barbeariaService.atualizar(
                    selectedId,
                    payload
                );
            } else {
                result = await barbeariaService.criar(payload);
            }

            const returnedId = idOf(result, "barbearia");
            const nextId = returnedId ?? selectedId;

            if (nextId) {
                localStorage.setItem(
                    "barberly:active-shop-id",
                    String(nextId)
                );
            }

            setMessage(
                editMode
                    ? "Informações da barbearia atualizadas."
                    : "Barbearia cadastrada com sucesso."
            );

            await load(nextId);
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível salvar as informações."
                )
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="page">
            <PageHeader
                eyebrow="CONFIGURAÇÕES DO NEGÓCIO"
                title="Informações da barbearia"
                subtitle="Gerencie as informações básicas cadastradas na API e exibidas aos clientes."
                action={
                    <Link
                        className="btn btn--secondary"
                        to="/dono/horarios"
                    >
                        <Icon name="clock" size={17} />
                        Horários
                    </Link>
                }
            />

            {error && (
                <Notice
                    type="error"
                    onClose={() => setError("")}
                >
                    {error}
                </Notice>
            )}

            {message && (
                <Notice
                    type="success"
                    onClose={() => setMessage("")}
                >
                    {message}
                </Notice>
            )}

            {loading ? (
                <LoadingState label="Carregando estabelecimento..." />
            ) : (
                <>
                    {shops.length > 1 && (
                        <div className="field config-shop-picker">
                            <label htmlFor="barbearia-select">
                                Estabelecimento
                            </label>

                            <select
                                id="barbearia-select"
                                value={selectedId}
                                onChange={choose}
                                disabled={saving}
                            >
                                {shops.map((shop) => {
                                    const id = idOf(
                                        shop,
                                        "barbearia"
                                    );

                                    return (
                                        <option
                                            key={id}
                                            value={id}
                                        >
                                            {nameOf(shop)}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    )}

                    <form
                        className="panel shop-form"
                        onSubmit={submit}
                    >
                        <div className="shop-cover">
                            <div className="shop-cover__mark">
                                <Icon name="store" size={35} />
                            </div>

                            <div>
                                <span className="eyebrow">
                                    PERFIL PÚBLICO
                                </span>

                                <h2>
                                    {form.Nome || "Sua barbearia"}
                                </h2>

                                <p>
                                    {form.Endereco ||
                                        "Adicione o endereço para identificar seu estabelecimento."}
                                </p>
                            </div>
                        </div>

                        <div className="panel__header">
                            <div>
                                <h2>
                                    {editMode
                                        ? "Editar informações básicas"
                                        : "Cadastrar seu estabelecimento"}
                                </h2>

                                <p>
                                    Use os campos suportados pelos
                                    contratos de criação e atualização
                                    da API.
                                </p>
                            </div>

                            <Icon name="edit" size={22} />
                        </div>

                        <div className="form-grid">
                            <div className="field field--full">
                                <label htmlFor="Nome">
                                    Nome da barbearia *
                                </label>

                                <input
                                    id="Nome"
                                    name="Nome"
                                    value={form.Nome}
                                    onChange={update}
                                    required
                                    maxLength={120}
                                    placeholder="Ex.: Barberly Centro"
                                />
                            </div>

                            <div className="field field--full">
                                <label htmlFor="Endereco">
                                    Endereço *
                                </label>

                                <input
                                    id="Endereco"
                                    name="Endereco"
                                    value={form.Endereco}
                                    onChange={update}
                                    required
                                    placeholder="Rua, número, bairro, cidade"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="Contato">
                                    Contato
                                </label>

                                <input
                                    id="Contato"
                                    name="Contato"
                                    value={form.Contato}
                                    onChange={update}
                                    placeholder="Telefone ou outro contato"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="IdDonoBarbearia">
                                    ID do proprietário
                                </label>

                                <input
                                    id="IdDonoBarbearia"
                                    value={getUserId() ?? ""}
                                    disabled
                                    readOnly
                                />

                                <small className="field__hint">
                                    Identificação obtida da sessão.
                                    A API também deve validar a
                                    propriedade do estabelecimento.
                                </small>
                            </div>

                            <div className="field field--full">
                                <label htmlFor="Descricao">
                                    Descrição
                                </label>

                                <textarea
                                    id="Descricao"
                                    name="Descricao"
                                    value={form.Descricao}
                                    onChange={update}
                                    rows={4}
                                    placeholder="Conte aos clientes sobre seu estabelecimento."
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn--primary"
                                disabled={saving}
                            >
                                {saving
                                    ? "Salvando..."
                                    : editMode
                                        ? "Salvar alterações"
                                        : "Cadastrar barbearia"}

                                <Icon name="check" size={17} />
                            </button>
                        </div>
                    </form>

                    {editMode && (
                        <section className="panel">
                            <div className="panel__header">
                                <div>
                                    <h2>Atalhos de gerenciamento</h2>
                                    <p>
                                        Acesse as outras configurações
                                        do estabelecimento.
                                    </p>
                                </div>
                            </div>

                            <div className="quick-actions">
                                <Link
                                    className="quick-action"
                                    to="/dono/servicos"
                                >
                                    <Icon name="scissors" size={23} />
                                    <strong>Serviços</strong>
                                    <span>Preço e duração</span>
                                </Link>

                                <Link
                                    className="quick-action"
                                    to="/dono/barbeiros"
                                >
                                    <Icon name="users" size={23} />
                                    <strong>Barbeiros</strong>
                                    <span>Equipe</span>
                                </Link>

                                <Link
                                    className="quick-action"
                                    to="/dono/horarios"
                                >
                                    <Icon name="clock" size={23} />
                                    <strong>Expediente</strong>
                                    <span>Dias e horários</span>
                                </Link>
                            </div>
                        </section>
                    )}

                    <Notice type="warning">
                        A API atual não possui campos para fotos, redes
                        sociais, categoria da barbearia, endereço
                        estruturado por cidade/estado ou destaques.
                        Esses recursos precisam de modelos e endpoints
                        próprios para serem salvos.
                    </Notice>
                </>
            )}
        </div>
    );
}
