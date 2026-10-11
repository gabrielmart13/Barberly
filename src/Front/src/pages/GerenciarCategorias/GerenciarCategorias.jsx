
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";

import categoriaService from "../../services/categoriaServicoService";

import {
    apiMessage,
    asArray,
    idOf,
    nameOf,
    read,
} from "../../utils/data";

import "./GerenciarCategorias.css";

const emptyForm = {
    Nome: "",
    Descricao: "",
};

export default function GerenciarCategorias() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ ...emptyForm });
    const [editing, setEditing] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const load = useCallback(async () => {
        setLoading(true);

        try {
            const result = await categoriaService.listar();

            setItems(asArray(result));
            setError("");
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível carregar as categorias."
                )
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    function reset() {
        setForm({ ...emptyForm });
        setEditing(null);
    }

    function update(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function beginEdit(item) {
        const categoryId = idOf(item, "categoria");

        if (!categoryId) {
            setError(
                "Não foi possível identificar a categoria selecionada."
            );
            return;
        }

        setError("");
        setMessage("");
        setEditing(categoryId);

        setForm({
            Nome: read(item, "nome", "Nome") ?? "",
            Descricao: read(
                item,
                "descricao",
                "Descricao"
            ) ?? "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    async function submit(event) {
        event.preventDefault();

        if (saving || deletingId !== null) {
            return;
        }

        const nome = form.Nome.trim();
        const descricao = form.Descricao.trim();

        if (!nome || !descricao) {
            setError(
                "Preencha o nome e a descrição da categoria."
            );
            return;
        }

        setError("");
        setMessage("");
        setSaving(true);

        try {
            const payload = {
                Nome: nome,
                Descricao: descricao,
            };

            if (editing !== null) {
                await categoriaService.atualizar(
                    editing,
                    payload
                );

                setMessage("Categoria atualizada com sucesso.");
            } else {
                await categoriaService.criar(payload);

                setMessage("Categoria criada com sucesso.");
            }

            reset();
            await load();
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível salvar a categoria."
                )
            );
        } finally {
            setSaving(false);
        }
    }

    async function remove(item) {
        const categoryId = idOf(item, "categoria");

        if (
            !categoryId ||
            saving ||
            deletingId !== null
        ) {
            return;
        }

        const confirmed = window.confirm(
            `Deseja excluir a categoria "${nameOf(item)}"? ` +
            "Se houver serviços associados, a API ou o banco de dados poderá impedir a exclusão."
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setMessage("");
        setDeletingId(categoryId);

        try {
            await categoriaService.excluir(categoryId);

            if (
                String(editing) === String(categoryId)
            ) {
                reset();
            }

            setMessage("Categoria excluída com sucesso.");

            await load();
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível excluir a categoria."
                )
            );
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="page">
            <PageHeader
                title="Categorias de serviços"
                subtitle="Organize o catálogo em categorias reutilizáveis."
                action={
                    <Link
                        to="/dono/servicos"
                        className="btn btn--ghost"
                    >
                        <Icon name="back" size={16} />
                        Voltar aos serviços
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

            <div className="content-grid content-grid--2 category-page-grid">
                <form
                    className="panel"
                    onSubmit={submit}
                >
                    <div className="panel__header">
                        <div>
                            <h2>
                                {editing !== null
                                    ? "Editar categoria"
                                    : "Nova categoria"}
                            </h2>

                            <p>
                                Informe o nome e a descrição da categoria.
                            </p>
                        </div>

                        <Icon name="filter" size={24} />
                    </div>

                    <div className="stack">
                        <div className="field">
                            <label htmlFor="Nome">
                                Nome da categoria *
                            </label>

                            <input
                                id="Nome"
                                name="Nome"
                                value={form.Nome}
                                onChange={update}
                                required
                                maxLength={120}
                                placeholder="Ex.: Cabelo"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="Descricao">
                                Descrição *
                            </label>

                            <textarea
                                id="Descricao"
                                name="Descricao"
                                value={form.Descricao}
                                onChange={update}
                                required
                                placeholder="Descreva os serviços desta categoria."
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        {editing !== null && (
                            <button
                                type="button"
                                className="btn btn--ghost"
                                onClick={reset}
                                disabled={saving}
                            >
                                Cancelar edição
                            </button>
                        )}

                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={
                                saving || deletingId !== null
                            }
                        >
                            {saving
                                ? "Salvando..."
                                : editing !== null
                                    ? "Salvar alterações"
                                    : "Criar categoria"}
                        </button>
                    </div>
                </form>

                <section className="panel">
                    <div className="panel__header">
                        <div>
                            <h2>Categorias cadastradas</h2>
                            <p>
                                {items.length} registro(s)
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <LoadingState />
                    ) : items.length === 0 ? (
                        <EmptyState
                            title="Nenhuma categoria"
                            text="Crie a primeira categoria no formulário ao lado."
                        />
                    ) : (
                        <div className="data-list">
                            {items.map((item) => {
                                const categoryId = idOf(
                                    item,
                                    "categoria"
                                );

                                const deleting =
                                    String(deletingId) ===
                                    String(categoryId);

                                return (
                                    <div
                                        className="data-row"
                                        key={categoryId}
                                    >
                                        <span className="category-symbol">
                                            <Icon
                                                name="scissors"
                                                size={18}
                                            />
                                        </span>

                                        <div className="data-row__main">
                                            <strong>
                                                {nameOf(item)}
                                            </strong>

                                            <p>
                                                {read(
                                                    item,
                                                    "descricao",
                                                    "Descricao"
                                                ) || "Sem descrição"}
                                            </p>
                                        </div>

                                        <div className="data-row__actions">
                                            <button
                                                type="button"
                                                className="icon-button"
                                                title="Editar categoria"
                                                aria-label={`Editar ${nameOf(item)}`}
                                                disabled={
                                                    saving ||
                                                    deletingId !== null
                                                }
                                                onClick={() =>
                                                    beginEdit(item)
                                                }
                                            >
                                                <Icon
                                                    name="edit"
                                                    size={16}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                className="icon-button"
                                                title="Excluir categoria"
                                                aria-label={`Excluir ${nameOf(item)}`}
                                                disabled={
                                                    saving ||
                                                    deletingId !== null
                                                }
                                                onClick={() =>
                                                    remove(item)
                                                }
                                            >
                                                <Icon
                                                    name="trash"
                                                    size={16}
                                                />
                                            </button>

                                            {deleting && (
                                                <span>
                                                    Excluindo...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>

            <p className="page-footnote">
                Se as categorias não aparecerem, verifique a resposta
                de categoriaService.listar() e o endpoint correspondente
                no backend.
            </p>
        </div>
    );
}
