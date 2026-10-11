
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";

import agendamentoService from "../../services/agendamentoService";
import servicoService from "../../services/servicoService";
import barbeiroService from "../../services/barbeiroService";

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

import { getOwnBarbearias } from "../../utils/ownerData";
import useActiveShop from "../../hooks/useActiveShop";

import "./AgendaDono.css";

const today = () => {
    const date = new Date();

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
};

export default function AgendaDono() {
    const [shops, setShops] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [barbers, setBarbers] = useState([]);

    const [date, setDate] = useState(today());
    const [status, setStatus] = useState("Todos");
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [ownShops, allAppointments, allServices, allBarbers] =
                await Promise.all([
                    getOwnBarbearias(),
                    agendamentoService.listar(),
                    servicoService.listar(),
                    barbeiroService.listar(),
                ]);

            setShops(asArray(ownShops));
            setAppointments(asArray(allAppointments));
            setServices(asArray(allServices));
            setBarbers(asArray(allBarbers));
        } catch (e) {
            setError(
                apiMessage(
                    e,
                    "Não foi possível carregar a agenda."
                )
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        async function carregar() {
            try {
                const [ownShops, allAppointments, allServices, allBarbers] =
                    await Promise.all([
                        getOwnBarbearias(),
                        agendamentoService.listar(),
                        servicoService.listar(),
                        barbeiroService.listar(),
                    ]);

                if (!active) return;

                setShops(asArray(ownShops));
                setAppointments(asArray(allAppointments));
                setServices(asArray(allServices));
                setBarbers(asArray(allBarbers));
                setError("");
            } catch (e) {
                if (active) {
                    setError(
                        apiMessage(
                            e,
                            "Não foi possível carregar a agenda."
                        )
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        carregar();

        return () => {
            active = false;
        };
    }, []);

    const { shopId, changeShop } = useActiveShop(shops);

    const ownServices = useMemo(
        () =>
            services.filter(
                (service) =>
                    Number(
                        read(service, "idBarbearia", "IdBarbearia")
                    ) === Number(shopId)
            ),
        [services, shopId]
    );

    const ownBarbers = useMemo(
        () =>
            barbers.filter(
                (barber) =>
                    Number(
                        read(barber, "idBarbearia", "IdBarbearia")
                    ) === Number(shopId)
            ),
        [barbers, shopId]
    );

    const filtered = useMemo(() => {
        return appointments
            .filter((appointment) => {
                if (
                    Number(
                        read(
                            appointment,
                            "idBarbearia",
                            "IdBarbearia"
                        )
                    ) !== Number(shopId)
                ) {
                    return false;
                }

                const dateValue = read(
                    appointment,
                    "dataHora",
                    "DataHora"
                );

                if (date) {
                    if (!dateValue) return false;

                    const parsedDate = new Date(dateValue);

                    if (Number.isNaN(parsedDate.getTime())) {
                        return false;
                    }

                    const localDate = [
                        parsedDate.getFullYear(),
                        String(parsedDate.getMonth() + 1).padStart(2, "0"),
                        String(parsedDate.getDate()).padStart(2, "0"),
                    ].join("-");

                    if (localDate !== date) return false;
                }

                const currentStatus = formatStatus(
                    read(appointment, "status", "Status")
                );

                if (
                    status !== "Todos" &&
                    currentStatus !== status
                ) {
                    return false;
                }

                const service = services.find(
                    (item) =>
                        Number(idOf(item, "servico")) ===
                        Number(
                            read(
                                appointment,
                                "idServico",
                                "IdServico"
                            )
                        )
                );

                const barber = barbers.find(
                    (item) =>
                        Number(idOf(item, "barbeiro")) ===
                        Number(
                            read(
                                appointment,
                                "idBarbeiro",
                                "IdBarbeiro"
                            )
                        )
                );

                const searchableText = [
                    nameOf(service),
                    nameOf(barber),
                    read(appointment, "idUsuario", "IdUsuario") ?? "",
                    idOf(appointment, "agendamento") ?? "",
                ]
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(
                    search.trim().toLowerCase()
                );
            })
            .sort(
                (a, b) =>
                    new Date(read(a, "dataHora", "DataHora")) -
                    new Date(read(b, "dataHora", "DataHora"))
            );
    }, [
        appointments,
        shopId,
        date,
        status,
        search,
        services,
        barbers,
    ]);

    async function remove(appointment) {
        const appointmentId = idOf(
            appointment,
            "agendamento"
        );

        if (!appointmentId) {
            setError("Não foi possível identificar o agendamento.");
            return;
        }

        const confirmed = window.confirm(
            "Esta operação exclui o agendamento do banco definitivamente. " +
            "Deseja excluir o registro?"
        );

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            await agendamentoService.excluir(appointmentId);

            setMessage("Agendamento excluído com sucesso.");

            await load();
        } catch (e) {
            setError(
                apiMessage(
                    e,
                    "Não foi possível excluir o agendamento."
                )
            );
        }
    }

    return (
        <div className="page">
            <PageHeader
                eyebrow="ADMINISTRAÇÃO"
                title="Gerenciar agenda"
                subtitle="Consulte os agendamentos registrados para sua barbearia."
                action={
                    <Link
                        to="/dono/barbearia"
                        className="btn btn--secondary"
                    >
                        <Icon name="store" size={17} />
                        Barbearia
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
                    <label htmlFor="active-shop">
                        Barbearia selecionada
                    </label>

                    <select
                        id="active-shop"
                        value={shopId || ""}
                        onChange={(e) =>
                            changeShop(e.target.value)
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

            <div className="toolbar">
                <div className="toolbar__filters">
                    <div className="field">
                        <label htmlFor="agenda-date">Data</label>
                        <input
                            id="agenda-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="agenda-status">Status</label>
                        <select
                            id="agenda-status"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >
                            {[
                                "Todos",
                                "Pendente",
                                "Confirmado",
                                "Em andamento",
                                "Concluído",
                                "Cancelado",
                            ].map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <label className="search-control">
                        <Icon name="search" size={18} />
                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Buscar por serviço, barbeiro ou ID"
                        />
                    </label>
                </div>

                <span className="chip">
                    {filtered.length} agendamento(s)
                </span>
            </div>

            {loading ? (
                <LoadingState />
            ) : shops.length === 0 ? (
                <EmptyState
                    title="Cadastre sua barbearia primeiro"
                    text="A agenda é vinculada a um estabelecimento de sua propriedade."
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
                    title="Nenhum agendamento encontrado"
                    text="Tente outra data ou remova os filtros."
                    action={
                        <button
                            type="button"
                            className="btn btn--secondary"
                            onClick={() => {
                                setDate("");
                                setStatus("Todos");
                                setSearch("");
                            }}
                        >
                            Limpar filtros
                        </button>
                    }
                />
            ) : (
                <>
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Horário</th>
                                    <th>Registro</th>
                                    <th>Serviço</th>
                                    <th>Barbeiro</th>
                                    <th>Status</th>
                                    <th>Valor</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((appointment, index) => {
                                    const service = ownServices.find(
                                        (item) =>
                                            Number(idOf(item, "servico")) ===
                                            Number(
                                                read(
                                                    appointment,
                                                    "idServico",
                                                    "IdServico"
                                                )
                                            )
                                    );

                                    const barber = ownBarbers.find(
                                        (item) =>
                                            Number(idOf(item, "barbeiro")) ===
                                            Number(
                                                read(
                                                    appointment,
                                                    "idBarbeiro",
                                                    "IdBarbeiro"
                                                )
                                            )
                                    );

                                    const currentStatus = formatStatus(
                                        read(
                                            appointment,
                                            "status",
                                            "Status"
                                        )
                                    );

                                    const statusClass = currentStatus
                                        .toLowerCase()
                                        .replaceAll(" ", "-")
                                        .replace("í", "i");

                                    return (
                                        <tr
                                            key={
                                                idOf(
                                                    appointment,
                                                    "agendamento"
                                                ) ?? index
                                            }
                                        >
                                            <td>
                                                {formatDateTime(
                                                    read(
                                                        appointment,
                                                        "dataHora",
                                                        "DataHora"
                                                    )
                                                )}
                                            </td>

                                            <td>
                                                #
                                                {idOf(
                                                    appointment,
                                                    "agendamento"
                                                ) ?? "—"}

                                                <br />

                                                <span className="muted tiny">
                                                    Cliente ID:{" "}
                                                    {read(
                                                        appointment,
                                                        "idUsuario",
                                                        "IdUsuario"
                                                    ) ?? "—"}
                                                </span>
                                            </td>

                                            <td>{nameOf(service)}</td>
                                            <td>{nameOf(barber)}</td>

                                            <td>
                                                <span
                                                    className={`appointment-status appointment-status--${statusClass}`}
                                                >
                                                    {currentStatus}
                                                </span>
                                            </td>

                                            <td>
                                                {formatMoney(
                                                    read(
                                                        service,
                                                        "valor",
                                                        "Valor"
                                                    )
                                                )}
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    className="icon-button"
                                                    title="Excluir registro"
                                                    aria-label="Excluir agendamento"
                                                    onClick={() =>
                                                        remove(appointment)
                                                    }
                                                >
                                                    <Icon
                                                        name="trash"
                                                        size={16}
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <p className="page-footnote">
                        O controller atual não oferece endpoint para
                        reagendar ou alterar status. O botão de ação
                        exclui o registro. A API também precisa filtrar
                        e autorizar a agenda por proprietário no servidor.
                    </p>
                </>
            )}
        </div>
    );
}
