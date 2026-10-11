/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import StatCard from "../../components/StatCard";
import Icon from "../../components/Icon";

import servicoService from "../../services/servicoService";
import categoriaService from "../../services/categoriaServicoService";

import {
    apiMessage,
    asArray,
    formatMoney,
    idOf,
    nameOf,
    read,
} from "../../utils/data";

import { getOwnBarbearias } from "../../utils/ownerData";
import useActiveShop from "../../hooks/useActiveShop";

import "./GerenciarServicos.css";

const pics = [
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=220&q=75",
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=220&q=75",
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=220&q=75",
];

export default function GerenciarServicos() {
    const [shops, setShops] = useState([]);
    const [all, setAll] = useState([]);
    const [categories, setCategories] = useState([]);

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [ownShops, services, cats] = await Promise.all([
                getOwnBarbearias(),
                servicoService.listar(),
                categoriaService.listar(),
            ]);

            setShops(asArray(ownShops));
            setAll(asArray(services));
            setCategories(asArray(cats));
        } catch (e) {
            setError(
                apiMessage(
                    e,
                    "Não foi possível carregar os serviços."
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
                (service) =>
                    Number(
                        read(service, "idBarbearia", "IdBarbearia")
                    ) === Number(shopId)
            ),
        [all, shopId]
    );

    const filtered = useMemo(
        () =>
            own.filter((service) => {
                const text = `${nameOf(service)} ${read(service, "descricao", "Descricao") ?? ""
                    }`.toLowerCase();

                return text.includes(query.trim().toLowerCase());
            }),
        [own, query]
    );

    const averagePrice = useMemo(() => {
        if (own.length === 0) return 0;

        const total = own.reduce(
            (sum, service) =>
                sum + Number(read(service, "valor", "Valor") || 0),
            0
        );

        return total / own.length;
    }, [own]);

    async function remove(service) {
        const serviceId = idOf(service, "servico");

        if (!serviceId) {
            setError("Não foi possível identificar o serviço.");
            return;
        }

        const confirmed = window.confirm(
            `Deseja excluir o serviço "${nameOf(service)}"?`
        );

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            await servicoService.excluir(serviceId);

            setMessage("Serviço excluído com sucesso.");

            await load();
        } catch (e) {
            setError(
                apiMessage(
                    e,
                    "Não foi possível excluir o serviço."
                )
            );
        }
    }

    return (
        <div className="page">
            <PageHeader
                eyebrow="CATÁLOGO"
                title="Gerenciar serviços"
                subtitle="Adicione, edite ou remova os serviços oferecidos pela sua barbearia."
                action={
                    <div className="inline">
                        <Link
                            className="btn btn--secondary"
                            to="/dono/categorias"
                        >
                            Categorias
                        </Link>

                        <Link
                            className="btn btn--primary"
                            to="/dono/servicos/novo"
                        >
                            <Icon name="plus" size={18} />
                            Novo serviço
                        </Link>
                    </div>
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
                    <label htmlFor="active-shop-services">
                        Barbearia selecionada
                    </label>

                    <select
                        id="active-shop-services"
                        value={shopId || ""}
                        onChange={(e) => changeShop(e.target.value)}
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
                    label="Serviços cadastrados"
                    value={own.length}
                    detail="Neste estabelecimento"
                    icon={<Icon name="scissors" />}
                />

                <StatCard
                    label="Categorias"
                    value={categories.length}
                    detail="Cadastradas na API"
                    icon={<Icon name="filter" />}
                />

                <StatCard
                    label="Ticket médio estimado"
                    value={formatMoney(averagePrice)}
                    detail="Média dos preços cadastrados"
                    icon={<Icon name="chart" />}
                    accent
                />

                <StatCard
                    label="Resultados"
                    value={filtered.length}
                    detail="Na busca atual"
                    icon={<Icon name="search" />}
                />
            </div>

            <div className="toolbar">
                <label className="search-control">
                    <Icon name="search" size={18} />

                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar serviço pelo nome..."
                    />
                </label>

                <span className="chip">
                    {filtered.length} serviço(s)
                </span>
            </div>

            {loading ? (
                <LoadingState />
            ) : shops.length === 0 ? (
                <EmptyState
                    title="Cadastre sua barbearia primeiro"
                    text="Cada serviço precisa pertencer a um estabelecimento."
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
                    title="Nenhum serviço encontrado"
                    text="Adicione um serviço ou ajuste a busca."
                    action={
                        <Link
                            className="btn btn--primary"
                            to="/dono/servicos/novo"
                        >
                            Novo serviço
                        </Link>
                    }
                />
            ) : (
                <div className="service-list">
                    {filtered.map((service, index) => {
                        const category = categories.find(
                            (cat) =>
                                Number(idOf(cat, "categoria")) ===
                                Number(
                                    read(
                                        service,
                                        "idCategoria",
                                        "IdCategoria"
                                    )
                                )
                        );

                        const serviceId = idOf(service, "servico");
                        const categoryName = nameOf(category);

                        return (
                            <article
                                className="service-row"
                                key={serviceId}
                            >
                                <img
                                    src={pics[index % pics.length]}
                                    alt=""
                                    loading="lazy"
                                />

                                <div className="service-row__body">
                                    <h3>{nameOf(service)}</h3>

                                    <p>
                                        {categoryName === "Sem nome"
                                            ? "Serviço profissional"
                                            : categoryName}
                                    </p>

                                    <div className="service-row__meta">
                                        <span>
                                            <Icon
                                                name="clock"
                                                size={14}
                                            />
                                            {read(
                                                service,
                                                "tempoEstimado",
                                                "TempoEstimado"
                                            ) ?? "—"}{" "}
                                            min
                                        </span>

                                        <strong>
                                            {formatMoney(
                                                read(
                                                    service,
                                                    "valor",
                                                    "Valor"
                                                )
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                <div className="service-row__actions">
                                    <Link
                                        className="icon-button"
                                        title="Editar serviço"
                                        aria-label="Editar serviço"
                                        to={`/dono/servicos/${serviceId}/editar`}
                                    >
                                        <Icon name="edit" size={17} />
                                    </Link>

                                    <button
                                        type="button"
                                        className="icon-button"
                                        title="Excluir serviço"
                                        aria-label="Excluir serviço"
                                        onClick={() => remove(service)}
                                    >
                                        <Icon name="trash" size={17} />
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
