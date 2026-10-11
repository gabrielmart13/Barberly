
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import StatCard from "../../components/StatCard";
import Icon from "../../components/Icon";

import agendamentoService from "../../services/agendamentoService";
import servicoService from "../../services/servicoService";
import barbeiroService from "../../services/barbeiroService";

import {
    apiMessage,
    asArray,
    formatStatus,
    read,
    nameOf,
    idOf,
} from "../../utils/data";

import { getSession } from "../../utils/session";
import { getOwnBarbearias } from "../../utils/ownerData";
import useActiveShop from "../../hooks/useActiveShop";

import "./DashboardDono.css";

function getAppointmentDate(appointment) {
    const value = read(
        appointment,
        "dataHora",
        "DataHora"
    );

    if (!value) {
        return null;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
}

function getStatusClass(status) {
    return formatStatus(status)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
}

export default function DashboardDono() {
    const [shops, setShops] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [barbers, setBarbers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const session = getSession();

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [
                ownShops,
                appointmentData,
                serviceData,
                barberData,
            ] = await Promise.all([
                getOwnBarbearias(),
                agendamentoService.listar(),
                servicoService.listar(),
                barbeiroService.listar(),
            ]);

            setShops(asArray(ownShops));
            setAppointments(asArray(appointmentData));
            setServices(asArray(serviceData));
            setBarbers(asArray(barberData));
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível carregar o painel."
                )
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadDashboard();
    }, [loadDashboard]);

    const { shopId, changeShop } = useActiveShop(shops);

    const ownAppointments = useMemo(
        () =>
            appointments.filter(
                (appointment) =>
                    Number(
                        read(
                            appointment,
                            "idBarbearia",
                            "IdBarbearia"
                        )
                    ) === Number(shopId)
            ),
        [appointments, shopId]
    );

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

    const today = new Date();

    const dayCount = ownAppointments.filter((appointment) => {
        const date = getAppointmentDate(appointment);

        return (
            date &&
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    }).length;

    const upcoming = useMemo(
        () =>
            ownAppointments
                .filter((appointment) => {
                    const date = getAppointmentDate(appointment);

                    return date && date >= today;
                })
                .sort(
                    (first, second) =>
                        getAppointmentDate(first) -
                        getAppointmentDate(second)
                )
                .slice(0, 6),
        [ownAppointments]
    );

    const futureCount = ownAppointments.filter((appointment) => {
        const date = getAppointmentDate(appointment);

        return date && date >= today;
    }).length;

    const serviceTotal = ownServices.reduce(
        (sum, service) =>
            sum +
            Number(read(service, "valor", "Valor") || 0),
        0
    );

    const selectedShop =
        shops.find(
            (shop) =>
                Number(idOf(shop, "barbearia")) === Number(shopId)
        ) ?? shops[0];

    const firstName = (
        session?.nome ??
        session?.Nome ??
        "proprietário"
    ).split(" ")[0];

    return (
        <div className="page">
            <PageHeader
                eyebrow="PAINEL DO PROPRIETÁRIO"
                title={`Olá, ${firstName}!`}
                subtitle={
                    shops.length
                        ? `Resumo de ${nameOf(selectedShop)}.`
                        : "Gerencie seu estabelecimento e acompanhe a agenda."
                }
                action={
                    shops.length > 1 ? (
                        <select
                            className="shop-select"
                            value={shopId || ""}
                            onChange={(event) =>
                                changeShop(event.target.value)
                            }
                            aria-label="Selecionar barbearia"
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
                    ) : null
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

            {loading ? (
                <LoadingState label="Carregando indicadores..." />
            ) : !shops.length ? (
                <EmptyState
                    title="Cadastre sua barbearia"
                    text="Para começar a administrar serviços, barbeiros e agendamentos, cadastre o estabelecimento."
                    action={
                        <Link
                            className="btn btn--primary"
                            to="/dono/barbearia"
                        >
                            Cadastrar barbearia
                            <Icon name="arrow" size={17} />
                        </Link>
                    }
                />
            ) : (
                <>
                    <div className="metric-grid">
                        <StatCard
                            label="Agendamentos hoje"
                            value={dayCount}
                            icon={<Icon name="calendar" />}
                            detail="Registros da API para hoje"
                        />

                        <StatCard
                            label="Serviços cadastrados"
                            value={ownServices.length}
                            icon={<Icon name="scissors" />}
                            detail="Neste estabelecimento"
                            accent
                        />

                        <StatCard
                            label="Barbeiros"
                            value={ownBarbers.length}
                            icon={<Icon name="users" />}
                            detail="Equipe cadastrada"
                        />

                        <StatCard
                            label="Agendamentos futuros"
                            value={futureCount}
                            icon={<Icon name="clock" />}
                            detail="Inclui pendentes e confirmados"
                        />
                    </div>

                    <div className="content-grid content-grid--2 dashboard-columns">
                        <section className="panel">
                            <div className="panel__header">
                                <div>
                                    <h2>Próximos agendamentos</h2>
                                    <p>
                                        Os nomes dos clientes não estão
                                        disponíveis no endpoint atual.
                                    </p>
                                </div>

                                <Link
                                    className="text-link"
                                    to="/dono/agenda"
                                >
                                    Ver agenda
                                    <Icon name="arrow" size={14} />
                                </Link>
                            </div>

                            {upcoming.length ? (
                                upcoming.map((appointment, index) => {
                                    const date =
                                        getAppointmentDate(appointment);

                                    const appointmentId = idOf(
                                        appointment,
                                        "agendamento"
                                    );

                                    const serviceId = Number(
                                        read(
                                            appointment,
                                            "idServico",
                                            "IdServico"
                                        )
                                    );

                                    const service = ownServices.find(
                                        (item) =>
                                            Number(
                                                idOf(item, "servico")
                                            ) === serviceId
                                    );

                                    const barberId = read(
                                        appointment,
                                        "idBarbeiro",
                                        "IdBarbeiro"
                                    );

                                    return (
                                        <div
                                            className="data-row"
                                            key={
                                                appointmentId ??
                                                `${date?.getTime()}-${index}`
                                            }
                                        >
                                            <div className="dashboard-time">
                                                <strong>
                                                    {date.toLocaleTimeString(
                                                        "pt-BR",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </strong>

                                                <small>
                                                    {date.toLocaleDateString(
                                                        "pt-BR",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                        }
                                                    )}
                                                </small>
                                            </div>

                                            <div className="data-row__main">
                                                <strong>
                                                    {`Agendamento #${appointmentId ?? "—"}`}
                                                </strong>

                                                <p>
                                                    Serviço:{" "}
                                                    {service
                                                        ? nameOf(service)
                                                        : "Não identificado"}{" "}
                                                    · Barbeiro #
                                                    {barberId ?? "—"}
                                                </p>
                                            </div>

                                            <span
                                                className={`appointment-status appointment-status--${getStatusClass(
                                                    read(
                                                        appointment,
                                                        "status",
                                                        "Status"
                                                    )
                                                )}`}
                                            >
                                                {formatStatus(
                                                    read(
                                                        appointment,
                                                        "status",
                                                        "Status"
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <EmptyState
                                    title="Sem agendamentos futuros"
                                    text="Quando um cliente solicitar um horário para esta barbearia, o registro aparecerá aqui."
                                />
                            )}
                        </section>

                        <section className="panel">
                            <div className="panel__header">
                                <h2>Ações rápidas</h2>
                                <Icon name="settings" size={21} />
                            </div>

                            <div className="quick-actions">
                                <Link
                                    to="/dono/servicos"
                                    className="quick-action"
                                >
                                    <Icon name="scissors" size={24} />
                                    <strong>Gerenciar serviços</strong>
                                    <span>Valores e duração</span>
                                </Link>

                                <Link
                                    to="/dono/barbeiros"
                                    className="quick-action"
                                >
                                    <Icon name="users" size={24} />
                                    <strong>Gerenciar barbeiros</strong>
                                    <span>Equipe da barbearia</span>
                                </Link>

                                <Link
                                    to="/dono/horarios"
                                    className="quick-action"
                                >
                                    <Icon name="clock" size={24} />
                                    <strong>Expediente</strong>
                                    <span>Horários cadastrados</span>
                                </Link>

                                <Link
                                    to="/dono/barbearia"
                                    className="quick-action"
                                >
                                    <Icon name="store" size={24} />
                                    <strong>Perfil da barbearia</strong>
                                    <span>Nome e endereço</span>
                                </Link>
                            </div>

                            <div
                                className="callout"
                                style={{ marginTop: 18 }}
                            >
                                Indicadores como faturamento, taxa de
                                ocupação, avaliações médias e novos
                                clientes exigem endpoints e regras de
                                negócio próprios na API.
                            </div>
                        </section>
                    </div>

                    <section className="panel dashboard-bottom">
                        <div className="panel__header">
                            <div>
                                <h2>Resumo da operação</h2>
                                <p>
                                    Contagens calculadas a partir dos
                                    registros recuperados pelo front.
                                </p>
                            </div>
                        </div>

                        <div className="content-grid content-grid--3">
                            <div className="operation-item">
                                <span>Valor dos serviços</span>

                                <strong>
                                    {serviceTotal.toLocaleString(
                                        "pt-BR",
                                        {
                                            style: "currency",
                                            currency: "BRL",
                                        }
                                    )}
                                </strong>

                                <small>
                                    Soma dos preços cadastrados; não
                                    representa faturamento.
                                </small>
                            </div>

                            <div className="operation-item">
                                <span>Expediente</span>
                                <strong>Configurar</strong>

                                <small>
                                    Confira os horários de funcionamento.
                                </small>

                                <Link to="/dono/horarios">
                                    Abrir horários
                                </Link>
                            </div>

                            <div className="operation-item">
                                <span>Conta</span>
                                <strong>Autenticada</strong>

                                <small>
                                    Login realizado com token JWT.
                                </small>

                                <Link to="/dono/perfil">
                                    Ver perfil
                                </Link>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
