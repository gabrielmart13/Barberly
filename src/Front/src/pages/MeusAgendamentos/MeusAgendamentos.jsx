/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";

import agendamentoService from "../../services/agendamentoService";
import servicoService from "../../services/servicoService";
import barbeiroService from "../../services/barbeiroService";
import barbeariaService from "../../services/barbeariaService";

import {
    apiMessage,
    asArray,
    formatDateTime,
    formatMoney,
    formatStatus,
    read,
    nameOf,
    idOf,
} from "../../utils/data";

import { getUserId } from "../../utils/session";

import "./MeusAgendamentos.css";

export default function MeusAgendamentos() {
    const navigate = useNavigate();
    const userId = getUserId();

    const [items, setItems] = useState([]);
    const [services, setServices] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [shops, setShops] = useState([]);

    const [filter, setFilter] = useState("Todos");
    const [loading, setLoading] = useState(Boolean(getUserId()));
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function carregarAgendamentos() {
        setLoading(true);
        setError("");

        try {
            const [agendamentos, servicos, barbeiros, barbearias] =
                await Promise.all([
                    agendamentoService.listar(),
                    servicoService.listar(),
                    barbeiroService.listar(),
                    barbeariaService.listar(),
                ]);

            setItems(
                asArray(agendamentos).filter(
                    (item) =>
                        Number(read(item, "idUsuario", "IdUsuario")) ===
                        Number(userId)
                )
            );

            setServices(asArray(servicos));
            setBarbers(asArray(barbeiros));
            setShops(asArray(barbearias));
        } catch (e) {
            setError(
                apiMessage(
                    e,
                    "Não foi possível buscar seus agendamentos."
                )
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let active = true;

        async function carregar() {
            setLoading(true);
            setError("");

            try {
                const [agendamentos, servicos, barbeiros, barbearias] =
                    await Promise.all([
                        agendamentoService.listar(),
                        servicoService.listar(),
                        barbeiroService.listar(),
                        barbeariaService.listar(),
                    ]);

                if (!active) return;

                setItems(
                    asArray(agendamentos).filter(
                        (item) =>
                            Number(read(item, "idUsuario", "IdUsuario")) ===
                            Number(userId)
                    )
                );

                setServices(asArray(servicos));
                setBarbers(asArray(barbeiros));
                setShops(asArray(barbearias));
            } catch (e) {
                if (active) {
                    setError(
                        apiMessage(
                            e,
                            "Não foi possível buscar seus agendamentos."
                        )
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        if (userId) {
            carregar();
        } else {
            setLoading(false);
        }

        return () => {
            active = false;
        };
    }, [userId]);

    const filtered = useMemo(
        () =>
            items.filter(
                (item) =>
                    filter === "Todos" ||
                    formatStatus(read(item, "status", "Status")) === filter
            ),
        [items, filter]
    );

    function related(list, kind, value) {
        return list.find(
            (item) =>
                Number(idOf(item, kind)) === Number(value)
        );
    }

    async function remove(item) {
        const id = idOf(item, "agendamento");

        if (!id) {
            setError("Não foi possível identificar o agendamento.");
            return;
        }

        const confirmed = window.confirm(
            "A API atual exclui o registro de forma definitiva. " +
            "Ela ainda não possui uma operação específica para cancelar " +
            "o agendamento. Deseja realmente excluí-lo?"
        );

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            await agendamentoService.excluir(id);
            setMessage("Agendamento excluído com sucesso.");

            await carregarAgendamentos();
        } catch (e) {
            setError(
                apiMessage(
                    e,
                    "Não foi possível excluir o agendamento."
                )
            );
        }
    }

    if (!userId) {
        return (
            <div className="page">
                <PageHeader
                    eyebrow="ÁREA DO CLIENTE"
                    title="Meus agendamentos"
                    subtitle="Consulte os horários registrados na sua conta."
                />

                <Notice type="error">
                    Não foi possível identificar o usuário autenticado.
                    Entre novamente na sua conta.
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
                eyebrow="ÁREA DO CLIENTE"
                title="Meus agendamentos"
                subtitle="Acompanhe os horários registrados na sua conta."
                action={
                    <Link
                        className="btn btn--primary"
                        to="/cliente/inicio"
                    >
                        <Icon name="plus" size={18} />
                        Novo agendamento
                    </Link>
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

            <div className="toolbar">
                <div className="segmented">
                    {[
                        "Todos",
                        "Pendente",
                        "Confirmado",
                        "Em andamento",
                        "Concluído",
                        "Cancelado",
                    ].map((status) => (
                        <button
                            type="button"
                            key={status}
                            className={
                                filter === status ? "is-active" : ""
                            }
                            onClick={() => setFilter(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <span className="chip">
                    {filtered.length} registro(s)
                </span>
            </div>

            {loading ? (
                <LoadingState label="Carregando seus agendamentos..." />
            ) : filtered.length === 0 ? (
                <EmptyState
                    title={
                        items.length
                            ? "Nenhum resultado neste filtro"
                            : "Você ainda não tem agendamentos"
                    }
                    text={
                        items.length
                            ? "Escolha outro status para visualizar os registros."
                            : "Encontre uma barbearia e reserve seu próximo horário."
                    }
                    action={
                        <Link
                            className="btn btn--primary"
                            to="/cliente/inicio"
                        >
                            Encontrar barbearia
                        </Link>
                    }
                />
            ) : (
                <div className="stack">
                    {filtered.map((item, index) => {
                        const shop = related(
                            shops,
                            "barbearia",
                            read(item, "idBarbearia", "IdBarbearia")
                        );

                        const barber = related(
                            barbers,
                            "barbeiro",
                            read(item, "idBarbeiro", "IdBarbeiro")
                        );

                        const service = related(
                            services,
                            "servico",
                            read(item, "idServico", "IdServico")
                        );

                        const status = formatStatus(
                            read(item, "status", "Status")
                        );

                        const appointmentId = idOf(
                            item,
                            "agendamento"
                        );

                        const serviceName = nameOf(service);

                        const statusClass = status
                            .toLowerCase()
                            .replaceAll(" ", "-")
                            .replace("í", "i");

                        return (
                            <article
                                className="appointment-card"
                                key={appointmentId ?? index}
                            >
                                <div className="appointment-card__visual">
                                    <Icon name="calendar" size={27} />

                                    <span>
                                        {formatDateTime(
                                            read(
                                                item,
                                                "dataHora",
                                                "DataHora"
                                            )
                                        )}
                                    </span>
                                </div>

                                <div className="appointment-card__body">
                                    <div className="inline">
                                        <strong>
                                            {serviceName === "Sem nome"
                                                ? `Agendamento #${appointmentId}`
                                                : serviceName}
                                        </strong>

                                        <span
                                            className={`appointment-status appointment-status--${statusClass}`}
                                        >
                                            {status}
                                        </span>
                                    </div>

                                    <p>
                                        <Icon name="store" size={14} />
                                        {" "}{nameOf(shop)}
                                    </p>

                                    <p>
                                        <Icon name="user" size={14} />
                                        {" "}{nameOf(barber)}
                                    </p>

                                    <p>
                                        <Icon name="clock" size={14} />
                                        {" "}
                                        {formatDateTime(
                                            read(
                                                item,
                                                "dataHora",
                                                "DataHora"
                                            )
                                        )}
                                    </p>

                                    <div className="appointment-card__footer">
                                        <span>
                                            {formatMoney(
                                                read(
                                                    service,
                                                    "valor",
                                                    "Valor"
                                                )
                                            )}
                                        </span>

                                        <div className="inline">
                                            <button
                                                type="button"
                                                className="btn btn--ghost btn--small"
                                                onClick={() =>
                                                    navigate(
                                                        `/cliente/agendamentos/${appointmentId}`
                                                    )
                                                }
                                            >
                                                Ver detalhes
                                            </button>

                                            {status !== "Concluído" &&
                                                status !== "Cancelado" && (
                                                    <button
                                                        type="button"
                                                        className="btn btn--danger btn--small"
                                                        onClick={() =>
                                                            remove(item)
                                                        }
                                                    >
                                                        Excluir
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            <p className="page-footnote">
                Os dados são filtrados pelo ID da conta no front-end.
                O backend também precisa garantir que cada cliente só
                consulte e altere os próprios agendamentos.
            </p>
        </div>
    );
}
