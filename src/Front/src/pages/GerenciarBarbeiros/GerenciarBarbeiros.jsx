/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import StatCard from "../../components/StatCard";
import Icon from "../../components/Icon";

import barbeiroService from "../../services/barbeiroService";

import {
    apiMessage,
    asArray,
    nameOf,
    idOf,
    read,
} from "../../utils/data";

import { getOwnBarbearias } from "../../utils/ownerData";
import useActiveShop from "../../hooks/useActiveShop";

import "./GerenciarBarbeiros.css";

const faces = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
];

export default function GerenciarBarbeiros() {
    const [shops, setShops] = useState([]);
    const [all, setAll] = useState([]);

    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [query, setQuery] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [shopResult, barberResult] = await Promise.all([
                getOwnBarbearias(),
                barbeiroService.listar(),
            ]);

            setShops(
                Array.isArray(shopResult) ? shopResult : []
            );

            setAll(asArray(barberResult));
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível carregar os barbeiros."
                )
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const { shopId, changeShop } = useActiveShop(shops);

    const own = useMemo(
        () =>
            all.filter(
                (barber) =>
                    Number(
                        read(
                            barber,
                            "idBarbearia",
                            "IdBarbearia"
                        )
                    ) === Number(shopId)
            ),
        [all, shopId]
    );

    const filtered = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return own.filter((barber) => {
            const name = String(nameOf(barber) ?? "");
            const email = String(
                read(barber, "email", "Email") ?? ""
            );

            return `${name} ${email}`
                .toLowerCase()
                .includes(normalizedQuery);
        });
    }, [own, query]);

    async function remove(barber) {
        const barberId = idOf(barber, "barbeiro");

        if (!barberId) {
            setError("Não foi possível identificar o barbeiro.");
            return;
        }

        const confirmed = window.confirm(
            `Deseja excluir o cadastro de ${nameOf(barber)}?`
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setMessage("");
        setDeletingId(barberId);

        try {
            await barbeiroService.excluir(barberId);

            setMessage("Barbeiro excluído com sucesso.");

            await load();
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível excluir o barbeiro."
                )
            );
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="page">
            <PageHeader
                eyebrow="EQUIPE"
                title="Meus barbeiros"
                subtitle="Cadastre e mantenha atualizados os profissionais do estabelecimento."
                action={
                    <Link
                        className="btn btn--primary"
                        to="/dono/barbeiros/novo"
                    >
                        <Icon name="plus" size={18} />
                        Novo barbeiro
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

            {shops.length > 1 && (
                <div className="field agenda-shop-select">
                    <label htmlFor="active-shop-barbers">
                        Barbearia selecionada
                    </label>

                    <select
                        id="active-shop-barbers"
                        value={shopId || ""}
                        onChange={(event) =>
                            changeShop(event.target.value)
                        }
                    >
                        {shops.map((shop) => (
                            <option
                                key={idOf(shop, "barbearia")}
                                value={idOf(shop, "barbearia")}
                            >
                                {nameOf(shop)}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="metric-grid">
                <StatCard
                    label="Profissionais"
                    value={own.length}
                    detail="Barbeiros vinculados"
                    icon={<Icon name="users" />}
                />

                <StatCard
                    label="E-mails cadastrados"
                    value={
                        own.filter((barber) =>
                            read(barber, "email", "Email")
                        ).length
                    }
                    detail="Dados de contato"
                    icon={<Icon name="mail" />}
                />

                <StatCard
                    label="Barbearia"
                    value={shops.length ? "Cadastrada" : "Não cadastrada"}
                    detail="Estabelecimentos da sua conta"
                    icon={<Icon name="store" />}
                    accent
                />

                <StatCard
                    label="Busca"
                    value={filtered.length}
                    detail="Resultados encontrados"
                    icon={<Icon name="search" />}
                />
            </div>

            <div className="toolbar">
                <label className="search-control">
                    <Icon name="search" size={18} />

                    <input
                        type="search"
                        value={query}
                        onChange={(event) =>
                            setQuery(event.target.value)
                        }
                        placeholder="Buscar por nome ou e-mail..."
                        aria-label="Buscar barbeiros por nome ou e-mail"
                    />
                </label>

                <span className="chip">
                    {filtered.length} profissional(is)
                </span>
            </div>

            {loading ? (
                <LoadingState />
            ) : shops.length === 0 ? (
                <EmptyState
                    title="Cadastre sua barbearia primeiro"
                    text="Os barbeiros precisam estar associados a um estabelecimento."
                    action={
                        <Link
                            className="btn btn--primary"
                            to="/dono/barbearia"
                        >
                            Cadastrar barbearia
                        </Link>
                    }
                />
            ) : filtered.length === 0 ? (
                <EmptyState
                    title="Nenhum barbeiro encontrado"
                    text={
                        query.trim()
                            ? "Tente outro nome ou e-mail."
                            : "Cadastre um profissional para começar a montar sua equipe."
                    }
                    action={
                        <Link
                            className="btn btn--primary"
                            to="/dono/barbeiros/novo"
                        >
                            Adicionar barbeiro
                        </Link>
                    }
                />
            ) : (
                <div className="staff-list">
                    {filtered.map((barber, index) => {
                        const barberId = idOf(barber, "barbeiro");
                        const isDeleting =
                            String(deletingId) === String(barberId);

                        return (
                            <article
                                className="staff-card"
                                key={barberId}
                            >
                                <img
                                    src={faces[index % faces.length]}
                                    alt=""
                                    loading="lazy"
                                />

                                <div className="staff-card__body">
                                    <h3>{nameOf(barber)}</h3>

                                    <p>
                                        {read(
                                            barber,
                                            "experiencia",
                                            "Experiencia"
                                        ) || "Profissional da equipe"}
                                    </p>

                                    <span>
                                        <Icon name="mail" size={13} />
                                        {read(
                                            barber,
                                            "email",
                                            "Email"
                                        ) || "E-mail não informado"}
                                    </span>

                                    <span>
                                        <Icon name="phone" size={13} />
                                        {read(
                                            barber,
                                            "contato",
                                            "Contato"
                                        ) || "Contato não informado"}
                                    </span>
                                </div>

                                <div className="staff-card__actions">
                                    <Link
                                        className="icon-button"
                                        title="Editar barbeiro"
                                        aria-label={`Editar ${nameOf(barber)}`}
                                        to={`/dono/barbeiros/${barberId}/editar`}
                                    >
                                        <Icon name="edit" size={17} />
                                    </Link>

                                    <button
                                        className="icon-button staff-delete"
                                        type="button"
                                        title="Excluir barbeiro"
                                        aria-label={`Excluir ${nameOf(barber)}`}
                                        disabled={
                                            deletingId !== null
                                        }
                                        onClick={() => remove(barber)}
                                    >
                                        <Icon name="trash" size={17} />
                                    </button>
                                </div>

                                {isDeleting && (
                                    <span className="staff-card__status">
                                        Excluindo...
                                    </span>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}

            <p className="page-footnote">
                A tela exibe os dados disponibilizados pela API.
                Recursos como status ativo/inativo e métricas de
                desempenho dependem de implementação no backend.
            </p>
        </div>
    );
}
