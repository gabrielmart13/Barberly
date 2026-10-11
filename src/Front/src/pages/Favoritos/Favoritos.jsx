
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";

import barbeariaService from "../../services/barbeariaService";

import {
    apiMessage,
    asArray,
    idOf,
    nameOf,
    read,
} from "../../utils/data";

import "./Favoritos.css";

const FAVORITES_KEY = "barberly:favorites";

const image =
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=650&q=80";

function getSavedFavorites() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(FAVORITES_KEY) || "[]"
        );

        return Array.isArray(saved)
            ? saved.map(Number).filter(Number.isFinite)
            : [];
    } catch {
        return [];
    }
}

export default function Favoritos() {
    const [shops, setShops] = useState([]);
    const [ids, setIds] = useState(getSavedFavorites);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        let active = true;

        async function load() {
            try {
                const result = await barbeariaService.listar();

                if (active) {
                    setShops(asArray(result));
                }
            } catch (err) {
                if (active) {
                    setError(
                        apiMessage(
                            err,
                            "Não foi possível carregar as barbearias."
                        )
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        void load();

        return () => {
            active = false;
        };
    }, []);

    const favorites = shops.filter((shop) =>
        ids.includes(Number(idOf(shop, "barbearia")))
    );

    function remove(id) {
        const next = ids.filter(
            (favoriteId) => favoriteId !== Number(id)
        );

        setIds(next);

        try {
            localStorage.setItem(
                FAVORITES_KEY,
                JSON.stringify(next)
            );
        } catch {
            setError(
                "Não foi possível atualizar os favoritos neste navegador."
            );
        }
    }

    function book(shopId) {
        if (!shopId) {
            setError(
                "Não foi possível identificar a barbearia selecionada."
            );
            return;
        }

        navigate(`/cliente/agendar/${shopId}/servico`);
    }

    return (
        <div className="page">
            <PageHeader
                title="Favoritos"
                subtitle="Barbearias que você salvou neste navegador."
            />

            <Notice type="warning">
                Os favoritos são armazenados localmente neste navegador.
                A API ainda precisa de um endpoint próprio para sincronizar
                essa lista entre dispositivos.
            </Notice>

            {error && (
                <Notice
                    type="error"
                    onClose={() => setError("")}
                >
                    {error}
                </Notice>
            )}

            {loading ? (
                <LoadingState label="Carregando favoritos..." />
            ) : favorites.length === 0 ? (
                <EmptyState
                    title="Nenhum favorito salvo"
                    text="Explore as barbearias e toque no coração para adicioná-las à sua lista."
                    action={
                        <Link
                            className="btn btn--primary"
                            to="/cliente/inicio"
                        >
                            Explorar barbearias
                        </Link>
                    }
                />
            ) : (
                <div className="home-shop-grid">
                    {favorites.map((shop) => {
                        const shopId = idOf(shop, "barbearia");

                        return (
                            <article
                                className="shop-card"
                                key={shopId}
                            >
                                <img
                                    className="shop-card__image"
                                    src={image}
                                    alt={`Ambiente de ${nameOf(shop)}`}
                                    loading="lazy"
                                />

                                <div className="shop-card__body">
                                    <div className="shop-card__title">
                                        <div>
                                            <h2>{nameOf(shop)}</h2>

                                            <p>
                                                {read(
                                                    shop,
                                                    "endereco",
                                                    "Endereco"
                                                ) ??
                                                    "Endereço não informado"}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="icon-button is-favorite"
                                            onClick={() => remove(shopId)}
                                            title="Remover dos favoritos"
                                            aria-label={`Remover ${nameOf(shop)} dos favoritos`}
                                        >
                                            <Icon
                                                name="heart"
                                                size={18}
                                            />
                                        </button>
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn btn--primary"
                                            onClick={() => book(shopId)}
                                        >
                                            Agendar
                                            <Icon
                                                name="arrow"
                                                size={16}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
