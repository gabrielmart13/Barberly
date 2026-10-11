
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import Icon from "../../components/Icon";

import usuarioService from "../../services/usuarioService";
import authService from "../../services/authService";

import { apiMessage, read } from "../../utils/data";
import { getSession, getUserId } from "../../utils/session";

import "./PerfilCliente.css";

export default function PerfilCliente() {
    const navigate = useNavigate();

    const userId = getUserId();
    const session = getSession() ?? {};

    const [form, setForm] = useState({
        Nome: session.nome ?? "",
        Email: session.email ?? "",
        Contato: "",
    });

    const [loading, setLoading] = useState(Boolean(userId));
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [mode, setMode] = useState("view");

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        let active = true;

        async function carregarPerfil() {
            setLoading(true);

            try {
                const usuario =
                    await usuarioService.buscarPorId(userId);

                if (!active) {
                    return;
                }

                setForm({
                    Nome:
                        read(usuario, "nome", "Nome") ??
                        session.nome ??
                        "",
                    Email:
                        read(usuario, "email", "Email") ??
                        session.email ??
                        "",
                    Contato:
                        read(usuario, "contato", "Contato") ??
                        "",
                });
            } catch (err) {
                if (active) {
                    setError(
                        apiMessage(
                            err,
                            "Não foi possível carregar seu perfil."
                        )
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        void carregarPerfil();

        return () => {
            active = false;
        };
    }, [userId]);

    function update(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setMessage("");
    }

    function cancelEdit() {
        setMode("view");
        setError("");
    }

    async function save(event) {
        event.preventDefault();

        if (saving) {
            return;
        }

        if (!userId) {
            setError(
                "Não foi possível identificar o usuário autenticado."
            );
            return;
        }

        const nome = form.Nome.trim();
        const email = form.Email.trim();
        const contato = form.Contato.trim();

        if (!nome || !email || !contato) {
            setError("Preencha todos os campos obrigatórios.");
            return;
        }

        setError("");
        setMessage("");
        setSaving(true);

        try {
            const updated = await usuarioService.atualizar(
                userId,
                {
                    Nome: nome,
                    Email: email,
                    Contato: contato,
                }
            );

            const nextSession = {
                ...session,
                nome: read(updated, "nome", "Nome") ?? nome,
                email: read(updated, "email", "Email") ?? email,
            };

            // Mantém a sessão sincronizada com o perfil atualizado.
            localStorage.setItem(
                "usuario",
                JSON.stringify(nextSession)
            );

            setForm({
                Nome: nextSession.nome,
                Email: nextSession.email,
                Contato:
                    read(updated, "contato", "Contato") ??
                    contato,
            });

            setMessage("Perfil atualizado com sucesso.");
            setMode("view");
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível atualizar o perfil."
                )
            );
        } finally {
            setSaving(false);
        }
    }

    function logout() {
        authService.logout();
        navigate("/login", { replace: true });
    }

    if (!userId) {
        return (
            <div className="page">
                <Notice type="error">
                    Não foi possível identificar o usuário autenticado.
                </Notice>

                <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() =>
                        navigate("/login", { replace: true })
                    }
                >
                    Voltar ao login
                </button>
            </div>
        );
    }

    return (
        <div className="page">
            <PageHeader
                eyebrow="MINHA CONTA"
                title="Meu perfil"
                subtitle="Gerencie suas informações de contato e sua sessão."
                action={
                    <button
                        type="button"
                        className="btn btn--danger"
                        onClick={logout}
                    >
                        <Icon name="logout" size={17} />
                        Sair da conta
                    </button>
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
                <LoadingState label="Carregando perfil..." />
            ) : (
                <>
                    <section className="profile-hero">
                        <div className="profile-avatar">
                            {(form.Nome || "C")
                                .trim()
                                .charAt(0)
                                .toUpperCase() || "C"}
                        </div>

                        <div className="grow">
                            <h2>
                                {form.Nome || "Cliente Barberly"}
                            </h2>

                            <p>{form.Email}</p>

                            <span className="chip chip--gold">
                                <Icon name="user" size={13} />
                                Cliente
                            </span>
                        </div>

                        <button
                            type="button"
                            className="btn btn--secondary"
                            onClick={() => {
                                setError("");
                                setMessage("");

                                setMode((previous) =>
                                    previous === "edit"
                                        ? "view"
                                        : "edit"
                                );
                            }}
                            disabled={saving}
                        >
                            <Icon name="edit" size={16} />
                            {mode === "edit"
                                ? "Cancelar"
                                : "Editar perfil"}
                        </button>
                    </section>

                    <section className="panel">
                        <div className="panel__header">
                            <div>
                                <h2>Informações pessoais</h2>
                                <p>
                                    Atualize seus dados de contato.
                                </p>
                            </div>

                            <Icon name="user" size={24} />
                        </div>

                        {mode === "edit" ? (
                            <form onSubmit={save}>
                                <div className="form-grid">
                                    <div className="field">
                                        <label htmlFor="Nome">
                                            Nome completo *
                                        </label>

                                        <input
                                            id="Nome"
                                            name="Nome"
                                            value={form.Nome}
                                            onChange={update}
                                            required
                                            maxLength={120}
                                            disabled={saving}
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="Email">
                                            E-mail *
                                        </label>

                                        <input
                                            id="Email"
                                            name="Email"
                                            type="email"
                                            autoComplete="email"
                                            value={form.Email}
                                            onChange={update}
                                            required
                                            disabled={saving}
                                        />
                                    </div>

                                    <div className="field field--full">
                                        <label htmlFor="Contato">
                                            Telefone *
                                        </label>

                                        <input
                                            id="Contato"
                                            name="Contato"
                                            type="tel"
                                            autoComplete="tel"
                                            value={form.Contato}
                                            onChange={update}
                                            required
                                            disabled={saving}
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn btn--ghost"
                                        onClick={cancelEdit}
                                        disabled={saving}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn--primary"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Salvando..."
                                            : "Salvar alterações"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-info-list">
                                <div>
                                    <Icon name="user" />
                                    <span>Nome completo</span>
                                    <strong>
                                        {form.Nome || "—"}
                                    </strong>
                                </div>

                                <div>
                                    <Icon name="mail" />
                                    <span>E-mail</span>
                                    <strong>
                                        {form.Email || "—"}
                                    </strong>
                                </div>

                                <div>
                                    <Icon name="phone" />
                                    <span>Telefone</span>
                                    <strong>
                                        {form.Contato || "—"}
                                    </strong>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="panel">
                        <div className="panel__header">
                            <h2>Segurança</h2>
                            <Icon name="lock" size={22} />
                        </div>

                        <div className="callout">
                            A alteração de senha ainda não está
                            disponível. Essa funcionalidade precisa
                            de um endpoint próprio no backend, com
                            validação da senha atual e armazenamento
                            seguro da nova senha.
                        </div>

                        <div
                            className="inline"
                            style={{ marginTop: 16 }}
                        >
                            <span className="muted tiny">
                                Sessão autenticada via JWT
                            </span>

                            <span className="chip chip--success">
                                Token presente
                            </span>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
