
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Icon from "../../components/Icon";
import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";

import barbeariaService from "../../services/barbeariaService";
import servicoService from "../../services/servicoService";

import {
    apiMessage,
    asArray,
    read,
    nameOf,
    idOf,
} from "../../utils/data";

import { normalizeText } from "../../utils/session";

import "./HomeCliente.css";

const images = [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=700&q=80",
];

const FAVORITES_KEY = "barberly:favorites";

function getFavorites() {
    try {
        const stored = JSON.parse(
            localStorage.getItem(FAVORITES_KEY) || "[]"
        );

        return Array.isArray(stored)
            ? stored
                .map(Number)
                .filter((id) => Number.isInteger(id) && id > 0)
            : [];
    } catch {
        return [];
    }
}

export default function HomeCliente() {
    const [shops, setShops] = useState([]);
    const [services, setServices] = useState([]);
    const [favorites, setFavorites] = useState(getFavorites);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [query, setQuery] = useState("");

    const navigate = useNavigate();

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [shopResult, serviceResult] = await Promise.all([
                barbeariaService.listar(),
                servicoService.listar(),
            ]);

            setShops(asArray(shopResult));
            setServices(asArray(serviceResult));
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível carregar as barbearias e os serviços."
                )
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const filtered = useMemo(() => {
        const normalizedQuery = normalizeText(query.trim());

        return shops.filter((shop) => {
            const searchableText = normalizeText(
                `${nameOf(shop)} ${read(shop, "endereco", "Endereco") ?? ""
                } ${read(shop, "descricao", "Descricao") ?? ""
                }`
            );

            return searchableText.includes(normalizedQuery);
        });
    }, [shops, query]);

    const shopServices = useMemo(() => {
        const result = new Map();

        for (const service of services) {
            const shopId = Number(
                read(service, "idBarbearia", "IdBarbearia")
            );

            if (!Number.isInteger(shopId) || shopId <= 0) {
                continue;
            }

            const current = result.get(shopId) ?? [];
            current.push(service);

            result.set(shopId, current);
        }

        return result;
    }, [services]);

    function toggleFavorite(id) {
        const shopId = Number(id);

        if (!Number.isInteger(shopId) || shopId <= 0) {
            setError(
                "Não foi possível identificar a barbearia para favoritar."
            );
            return;
        }

        const isFavorite = favorites.includes(shopId);

        const nextFavorites = isFavorite
            ? favorites.filter((favoriteId) => favoriteId !== shopId)
            : [...favorites, shopId];

        try {
            localStorage.setItem(
                FAVORITES_KEY,
                JSON.stringify(nextFavorites)
            );

            setFavorites(nextFavorites);
            setError("");

            setMessage(
                isFavorite
                    ? "Barbearia removida dos favoritos."
                    : "Barbearia adicionada aos favoritos. Os favoritos ficam salvos apenas neste navegador."
            );
        } catch {
            setError(
                "Não foi possível salvar os favoritos neste navegador."
            );
        }
    }

    return (
        <div className="page home-client">
            <section className="hero">
                <div className="hero__copy">
                    <div className="eyebrow">
                        BARBERLY · SEU PRÓXIMO CORTE
                    </div>

                    <h1>Encontre sua barbearia</h1>

                    <p>
                        Estilo, qualidade e praticidade.
                        <br />
                        Tudo em um só lugar.
                    </p>

                    <div className="home-search">
                        <Icon name="search" size={20} />

                        <input
                            type="search"
                            value={query}
                            onChange={(event) =>
                                setQuery(event.target.value)
                            }
                            placeholder="Pesquisar barbearias, endereços ou descrições..."
                            aria-label="Pesquisar barbearias"
                        />

                        {query && (
                            <button
                                type="button"
                                aria-label="Limpar busca"
                                onClick={() => setQuery("")}
                            >
                                <Icon name="close" size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </section>

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
                    type="warning"
                    onClose={() => setMessage("")}
                >
                    {message}
                </Notice>
            )}

            <PageHeader
                title="Barbearias para você"
                subtitle="Explore os estabelecimentos cadastrados no Barberly."
                action={
                    <span className="chip">
                        {filtered.length} encontradas
                    </span>
                }
            />

            {loading ? (
                <LoadingState label="Buscando barbearias e serviços..." />
            ) : filtered.length === 0 ? (
                <EmptyState
                    title={
                        shops.length
                            ? "Nenhuma barbearia encontrada"
                            : "Ainda não há barbearias cadastradas"
                    }
                    text={
                        shops.length
                            ? "Tente pesquisar por outro nome, endereço ou descrição."
                            : "Quando os proprietários cadastrarem seus estabelecimentos, eles aparecerão aqui."
                    }
                    action={
                        query.trim() ? (
                            <button
                                type="button"
                                className="btn btn--secondary"
                                onClick={() => setQuery("")}
                            >
                                Limpar busca
                            </button>
                        ) : undefined
                    }
                />
            ) : (
                <div className="home-shop-grid">
                    {filtered.map((shop, index) => {
                        const shopId = idOf(shop, "barbearia");
                        const numericShopId = Number(shopId);

                        const list =
                            shopServices.get(numericShopId) ?? [];

                        const address =
                            read(shop, "endereco", "Endereco") ??
                            "Endereço não informado";

                        const description = read(
                            shop,
                            "descricao",
                            "Descricao"
                        );

                        const contact = read(
                            shop,
                            "contato",
                            "Contato"
                        );

                        const isFavorite =
                            favorites.includes(numericShopId);

                        return (
                            <article
                                className="shop-card"
                                key={shopId ?? index}
                            >
                                <img
                                    className="shop-card__image"
                                    src={images[index % images.length]}
                                    alt={`Ambiente de barbearia ${nameOf(shop)}`}
                                    loading="lazy"
                                />

                                <div className="shop-card__body">
                                    <div className="shop-card__title">
                                        <div>
                                            <h2>{nameOf(shop)}</h2>
                                            <p>{address}</p>
                                        </div>

                                        <button
                                            type="button"
                                            className={`icon-button ${isFavorite
                                                    ? "is-favorite"
                                                    : ""
                                                }`}
                                            title={
                                                isFavorite
                                                    ? "Remover dos favoritos"
                                                    : "Adicionar aos favoritos"
                                            }
                                            aria-label={
                                                isFavorite
                                                    ? `Remover ${nameOf(shop)} dos favoritos`
                                                    : `Adicionar ${nameOf(shop)} aos favoritos`
                                            }
                                            aria-pressed={isFavorite}
                                            onClick={() =>
                                                toggleFavorite(shopId)
                                            }
                                        >
                                            <Icon
                                                name="heart"
                                                size={18}
                                            />
                                        </button>
                                    </div>

                                    <div className="shop-card__meta">
                                        <span>
                                            <Icon
                                                name="scissors"
                                                size={15}
                                            />
                                            {list.length} serviço(s)
                                        </span>

                                        <span>
                                            <Icon
                                                name="pin"
                                                size={15}
                                            />
                                            {contact ||
                                                "Contato não informado"}
                                        </span>
                                    </div>

                                    {description && (
                                        <p className="shop-card__description">
                                            {description}
                                        </p>
                                    )}

                                    <button
                                        type="button"
                                        className="btn btn--primary btn--block"
                                        onClick={() =>
                                            navigate(
                                                `/cliente/agendar/${shopId}/servico`
                                            )
                                        }
                                        disabled={!shopId}
                                    >
                                        Ver serviços e agendar
                                        <Icon
                                            name="arrow"
                                            size={17}
                                        />
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            <section className="client-trust panel">
                <Icon name="scissors" size={26} />

                <div>
                    <h3>Mais que um corte, uma experiência.</h3>
                    <p>
                        Encontre serviços, escolha seu profissional e
                        organize seu próximo horário.
                    </p>
                </div>

                <Link
                    className="btn btn--secondary"
                    to="/cliente/agendamentos"
                >
                    Meus agendamentos
                </Link>
            </section>
        </div>
    );
}
