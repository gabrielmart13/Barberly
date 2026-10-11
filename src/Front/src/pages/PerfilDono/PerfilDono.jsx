
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import Icon from "../../components/Icon";

import authService from "../../services/authService";

import { getSession } from "../../utils/session";

import "./PerfilDono.css";

const defaultPrefs = {
    novosAgendamentos: true,
    cancelamentos: true,
    avaliacoes: true,
    avisos: false,
};

const preferences = [
    {
        key: "novosAgendamentos",
        label: "Novos agendamentos",
        description: "Preferência para avisos de novas reservas.",
    },
    {
        key: "cancelamentos",
        label: "Cancelamentos",
        description: "Preferência para avisos de cancelamentos.",
    },
    {
        key: "avaliacoes",
        label: "Avaliações",
        description: "Preferência para novos comentários e avaliações.",
    },
    {
        key: "avisos",
        label: "Atualizações da plataforma",
        description: "Avisos gerais do Barberly.",
    },
];

const PREFERENCES_KEY = "barberly:owner-prefs";

function loadPreferences() {
    try {
        const stored = JSON.parse(
            localStorage.getItem(PREFERENCES_KEY) || "{}"
        );

        if (
            !stored ||
            typeof stored !== "object" ||
            Array.isArray(stored)
        ) {
            return { ...defaultPrefs };
        }

        return {
            ...defaultPrefs,
            ...Object.fromEntries(
                Object.keys(defaultPrefs)
                    .filter(
                        (key) =>
                            typeof stored[key] === "boolean"
                    )
                    .map((key) => [key, stored[key]])
            ),
        };
    } catch {
        return { ...defaultPrefs };
    }
}

export default function PerfilDono() {
    const navigate = useNavigate();

    const session = getSession() ?? {};

    const [prefs, setPrefs] = useState(loadPreferences);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    function toggle(key) {
        const next = {
            ...prefs,
            [key]: !prefs[key],
        };

        try {
            localStorage.setItem(
                PREFERENCES_KEY,
                JSON.stringify(next)
            );

            setPrefs(next);
            setMessage(
                "Preferências salvas neste navegador."
            );
            setError("");
        } catch {
            setError(
                "Não foi possível salvar as preferências neste navegador."
            );
        }
    }

    function logout() {
        authService.logout();
        navigate("/login", { replace: true });
    }

    const expiration = session.expiraEmUtc
        ? new Date(session.expiraEmUtc)
        : null;

    const expirationText =
        expiration && !Number.isNaN(expiration.getTime())
            ? expiration.toLocaleString("pt-BR")
            : "Não informado";

    return (
        <div className="page">
            <PageHeader
                eyebrow="CONTA DO PROPRIETÁRIO"
                title="Perfil e preferências"
                subtitle="Consulte os dados da sessão e ajuste suas preferências locais."
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

            {message && (
                <Notice
                    type="success"
                    onClose={() => setMessage("")}
                >
                    {message}
                </Notice>
            )}

            {error && (
                <Notice
                    type="error"
                    onClose={() => setError("")}
                >
                    {error}
                </Notice>
            )}

            <section className="profile-hero">
                <div className="profile-avatar">
                    {String(session.nome ?? "D")
                        .trim()
                        .charAt(0)
                        .toUpperCase() || "D"}
                </div>

                <div className="grow">
                    <h2>
                        {session.nome ?? "Proprietário Barberly"}
                    </h2>

                    <p>
                        {session.email ??
                            "E-mail não disponível na sessão"}
                    </p>

                    <span className="chip chip--gold">
                        <Icon name="store" size={13} />
                        Dono da barbearia
                    </span>
                </div>
            </section>

            <section className="panel">
                <div className="panel__header">
                    <div>
                        <h2>Informações da conta</h2>
                        <p>
                            Dados disponíveis na sessão autenticada.
                        </p>
                    </div>

                    <Icon name="user" size={24} />
                </div>

                <div className="profile-info-list">
                    <div>
                        <Icon name="user" />
                        <span>Nome</span>
                        <strong>
                            {session.nome ?? "—"}
                        </strong>
                    </div>

                    <div>
                        <Icon name="mail" />
                        <span>E-mail</span>
                        <strong>
                            {session.email ?? "—"}
                        </strong>
                    </div>

                    <div>
                        <Icon name="lock" />
                        <span>Tipo de conta</span>
                        <strong>DonoBarbearia</strong>
                    </div>

                    <div>
                        <Icon name="calendar" />
                        <span>Expiração do token</span>
                        <strong>{expirationText}</strong>
                    </div>
                </div>

                <Notice type="warning">
                    A edição de dados pessoais não está disponível.
                    Antes de implementar essa funcionalidade, o backend
                    precisa garantir o hash seguro das senhas e retornar
                    DTOs públicos sem informações sensíveis.
                </Notice>

                <Link
                    className="btn btn--secondary"
                    to="/dono/barbearia"
                >
                    <Icon name="store" size={17} />
                    Gerenciar dados da barbearia
                </Link>
            </section>

            <section className="panel">
                <div className="panel__header">
                    <div>
                        <h2>Preferências de notificação</h2>
                        <p>
                            Estas opções ficam salvas apenas neste navegador.
                        </p>
                    </div>

                    <Icon name="bell" size={23} />
                </div>

                <div className="preferences-list">
                    {preferences.map((preference) => (
                        <label
                            className="preference-row"
                            key={preference.key}
                        >
                            <span>
                                <strong>
                                    {preference.label}
                                </strong>

                                <small>
                                    {preference.description}
                                </small>
                            </span>

                            <input
                                type="checkbox"
                                checked={Boolean(
                                    prefs[preference.key]
                                )}
                                onChange={() =>
                                    toggle(preference.key)
                                }
                            />
                        </label>
                    ))}
                </div>
            </section>
        </div>
    );
}
