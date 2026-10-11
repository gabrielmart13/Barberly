
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import Icon from "../../components/Icon";

import agendamentoService from "../../services/agendamentoService";
import servicoService from "../../services/servicoService";
import barbeiroService from "../../services/barbeiroService";
import barbeariaService from "../../services/barbeariaService";

import {
    apiMessage,
    asArray,
    formatDateTime,
    formatStatus,
    formatMoney,
    read,
    nameOf,
    idOf,
} from "../../utils/data";

import "./DetalhesAgendamento.css";

function getStatusClass(status) {
    return formatStatus(status)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
}

export default function DetalhesAgendamento() {
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [service, setService] = useState(null);
    const [barber, setBarber] = useState(null);
    const [shop, setShop] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function load() {
            setLoading(true);
            setError("");

            try {
                const appointment =
                    await agendamentoService.buscarPorId(id);

                const [
                    serviceData,
                    barberData,
                    shopData,
                ] = await Promise.all([
                    servicoService.listar(),
                    barbeiroService.listar(),
                    barbeariaService.listar(),
                ]);

                if (!active) {
                    return;
                }

                const serviceId = Number(
                    read(
                        appointment,
                        "idServico",
                        "IdServico"
                    )
                );

                const barberId = Number(
                    read(
                        appointment,
                        "idBarbeiro",
                        "IdBarbeiro"
                    )
                );

                const shopId = Number(
                    read(
                        appointment,
                        "idBarbearia",
                        "IdBarbearia"
                    )
                );

                setData(appointment);

                setService(
                    asArray(serviceData).find(
                        (item) =>
                            Number(idOf(item, "servico")) ===
                            serviceId
                    ) ?? null
                );

                setBarber(
                    asArray(barberData).find(
                        (item) =>
                            Number(idOf(item, "barbeiro")) ===
                            barberId
                    ) ?? null
                );

                setShop(
                    asArray(shopData).find(
                        (item) =>
                            Number(idOf(item, "barbearia")) ===
                            shopId
                    ) ?? null
                );
            } catch (err) {
                if (active) {
                    setError(
                        apiMessage(
                            err,
                            "Não foi possível carregar o agendamento."
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
    }, [id]);

    const status = formatStatus(
        read(data, "status", "Status")
    );

    return (
        <div className="page">
            <PageHeader
                title="Detalhes do agendamento"
                subtitle="Confira as informações enviadas para a API."
                action={
                    <Link
                        className="btn btn--ghost"
                        to="/cliente/agendamentos"
                    >
                        <Icon name="back" size={17} />
                        Voltar à lista
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

            {loading ? (
                <LoadingState label="Carregando agendamento..." />
            ) : data ? (
                <div className="detail-grid">
                    <section className="panel">
                        <div className="detail-photo" />

                        <h2 className="detail-main-title">
                            {nameOf(service)}
                        </h2>

                        <span
                            className={`appointment-status appointment-status--${getStatusClass(
                                read(data, "status", "Status")
                            )}`}
                        >
                            {status}
                        </span>

                        <div className="divider" />

                        <div className="summary-line">
                            <span>
                                <Icon name="calendar" size={15} />
                                Data e horário
                            </span>

                            <strong>
                                {formatDateTime(
                                    read(
                                        data,
                                        "dataHora",
                                        "DataHora"
                                    )
                                )}
                            </strong>
                        </div>

                        <div className="summary-line">
                            <span>
                                <Icon name="clock" size={15} />
                                Duração estimada
                            </span>

                            <strong>
                                {read(
                                    service,
                                    "tempoEstimado",
                                    "TempoEstimado"
                                ) ?? "—"}{" "}
                                min
                            </strong>
                        </div>

                        <div className="summary-line">
                            <span>
                                <Icon name="user" size={15} />
                                Barbeiro
                            </span>

                            <strong>{nameOf(barber)}</strong>
                        </div>

                        <div className="summary-line">
                            <span>
                                <Icon name="store" size={15} />
                                Barbearia
                            </span>

                            <strong>{nameOf(shop)}</strong>
                        </div>

                        <div className="summary-line">
                            <span>Valor do serviço</span>

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
                    </section>

                    <aside className="panel">
                        <h2>Informações</h2>

                        <p className="muted tiny">
                            ID do agendamento: #
                            {idOf(data, "agendamento") ?? id}
                        </p>

                        <div className="callout">
                            O backend atual permite excluir o registro,
                            mas ainda não possui endpoint para reagendar
                            ou alterar o status. Esta tela não oferece
                            essas ações para evitar simular
                            funcionalidades inexistentes.
                        </div>

                        <div className="divider" />

                        <Link
                            className="btn btn--primary btn--block"
                            to="/cliente/agendamentos"
                        >
                            Voltar aos agendamentos
                        </Link>
                    </aside>
                </div>
            ) : (
                <Notice type="warning">
                    Não foi possível encontrar os dados deste agendamento.
                </Notice>
            )}
        </div>
    );
}
