
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import Icon from "../../components/Icon";

import agendamentoService from "../../services/agendamentoService";

import {
    apiMessage,
    formatDate,
    formatMoney,
    read,
    nameOf,
} from "../../utils/data";

import {
    getBookingDraft,
    saveLastBooking,
    clearBookingDraft,
} from "../../utils/bookingDraft";

import { getUserId } from "../../utils/session";

import "./ConfirmarAgendamento.css";

export default function ConfirmarAgendamento() {
    const { barbeariaId } = useParams();
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const draft = getBookingDraft();
    const userId = getUserId();

    const selectedShopId = String(draft.barbeariaId ?? "");
    const routeShopId = String(barbeariaId ?? "");

    const shopMatchesRoute =
        Boolean(routeShopId) && selectedShopId === routeShopId;

    const dateTime =
        draft.data && draft.hora
            ? new Date(`${draft.data}T${draft.hora}:00`)
            : null;

    const validDateTime =
        dateTime && !Number.isNaN(dateTime.getTime())
            ? dateTime.toISOString()
            : null;

    async function confirm() {
        setError("");

        if (
            !draft.servicoId ||
            !draft.barbeiroId ||
            !draft.barbeariaId ||
            !draft.data ||
            !draft.hora ||
            !validDateTime
        ) {
            setError(
                "Seu agendamento está incompleto. Volte e selecione serviço, barbeiro, data e horário."
            );
            return;
        }

        if (!shopMatchesRoute) {
            setError(
                "A barbearia selecionada não corresponde à etapa atual. Volte ao início do agendamento e tente novamente."
            );
            return;
        }

        if (!userId) {
            setError(
                "Não foi possível identificar sua conta. Entre novamente."
            );
            return;
        }

        setLoading(true);

        try {
            const payload = {
                DataHora: validDateTime,
                Status: "Pendente",
                IdUsuario: Number(userId),
                IdServico: Number(draft.servicoId),
                IdBarbeiro: Number(draft.barbeiroId),
                IdBarbearia: Number(draft.barbeariaId),
            };

            const result = await agendamentoService.criar(payload);

            saveLastBooking({
                agendamento: result,
                ...draft,
                dataHora: validDateTime,
            });

            clearBookingDraft();

            navigate("/cliente/agendamento-confirmado", {
                replace: true,
            });
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível criar o agendamento."
                )
            );
        } finally {
            setLoading(false);
        }
    }

    const servicePrice = read(
        draft.servico,
        "valor",
        "Valor"
    );

    const serviceDuration =
        read(
            draft.servico,
            "tempoEstimado",
            "TempoEstimado"
        ) ?? 30;

    return (
        <div className="page">
            <PageHeader
                eyebrow="NOVO AGENDAMENTO · 4 DE 4"
                title="Confirme seu agendamento"
                subtitle="Revise os detalhes e confirme para enviar o pedido à barbearia."
            />

            <div className="wizard-steps">
                <div className="wizard-step is-complete">
                    <span className="wizard-step__number">✓</span>
                    Serviço
                </div>

                <span className="wizard-step__line" />

                <div className="wizard-step is-complete">
                    <span className="wizard-step__number">✓</span>
                    Barbeiro
                </div>

                <span className="wizard-step__line" />

                <div className="wizard-step is-complete">
                    <span className="wizard-step__number">✓</span>
                    Data e horário
                </div>

                <span className="wizard-step__line" />

                <div className="wizard-step is-active">
                    <span className="wizard-step__number">4</span>
                    Confirmação
                </div>
            </div>

            {error && (
                <Notice
                    type="error"
                    onClose={() => setError("")}
                >
                    {error}
                </Notice>
            )}

            <div className="detail-grid">
                <section className="panel">
                    <div className="panel__header">
                        <div>
                            <h2>Resumo do atendimento</h2>
                            <p>
                                Confira se todos os dados estão corretos.
                            </p>
                        </div>

                        <Icon name="calendar" size={23} />
                    </div>

                    <div className="confirm-entity">
                        <div className="confirm-entity__image confirm-entity__image--shop" />

                        <div>
                            <small>BARBEARIA</small>
                            <strong>{nameOf(draft.barbearia)}</strong>

                            <p>
                                {read(
                                    draft.barbearia,
                                    "endereco",
                                    "Endereco"
                                ) ?? "Endereço não informado"}
                            </p>

                            <Link
                                className="text-link"
                                to="/cliente/inicio"
                            >
                                Trocar barbearia
                            </Link>
                        </div>
                    </div>

                    <div className="divider" />

                    <div className="confirm-entity">
                        <div className="confirm-entity__image confirm-entity__image--service">
                            <Icon name="scissors" size={23} />
                        </div>

                        <div>
                            <small>SERVIÇO</small>
                            <strong>{nameOf(draft.servico)}</strong>

                            <p>
                                {serviceDuration} minutos estimados
                            </p>

                            <Link
                                className="text-link"
                                to={`/cliente/agendar/${barbeariaId}/servico`}
                            >
                                Editar serviço
                            </Link>
                        </div>

                        <strong className="confirm-price">
                            {formatMoney(servicePrice)}
                        </strong>
                    </div>

                    <div className="divider" />

                    <div className="confirm-entity">
                        <div className="confirm-entity__image confirm-entity__image--barber">
                            <Icon name="user" size={23} />
                        </div>

                        <div>
                            <small>BARBEIRO</small>
                            <strong>{nameOf(draft.barbeiro)}</strong>

                            <p>Profissional selecionado</p>

                            <Link
                                className="text-link"
                                to={`/cliente/agendar/${barbeariaId}/barbeiro`}
                            >
                                Trocar barbeiro
                            </Link>
                        </div>
                    </div>
                </section>

                <aside className="panel">
                    <h2 className="summary-title">
                        Data e horário
                    </h2>

                    <div className="confirm-date">
                        <Icon name="calendar" size={22} />

                        <div>
                            <strong>
                                {draft.data
                                    ? formatDate(
                                        `${draft.data}T12:00:00`,
                                        {
                                            weekday: "long",
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )
                                    : "Data não selecionada"}
                            </strong>

                            <span>
                                {draft.hora ??
                                    "Horário não selecionado"}
                            </span>
                        </div>
                    </div>

                    <div className="divider" />

                    <div className="summary-line">
                        <span>Serviço</span>
                        <strong>{formatMoney(servicePrice)}</strong>
                    </div>

                    <div className="summary-line">
                        <span>Duração estimada</span>
                        <strong>{serviceDuration} min</strong>
                    </div>

                    <div className="summary-line summary-total">
                        <span>Total estimado</span>
                        <strong>{formatMoney(servicePrice)}</strong>
                    </div>

                    <Notice type="warning">
                        A API registra o agendamento com status
                        “Pendente”. A disponibilidade e os conflitos
                        de horário devem ser validados no servidor.
                    </Notice>

                    <button
                        type="button"
                        className="btn btn--primary btn--block"
                        onClick={confirm}
                        disabled={loading}
                    >
                        {loading
                            ? "Enviando pedido..."
                            : "Confirmar agendamento"}

                        <Icon name="arrow" size={18} />
                    </button>

                    <p className="page-footnote">
                        Ao confirmar, os dados serão enviados para o
                        backend Barberly.
                    </p>
                </aside>
            </div>

            <div className="page-actions">
                <Link
                    className="btn btn--ghost"
                    to={`/cliente/agendar/${barbeariaId}/horario`}
                >
                    <Icon name="back" size={17} />
                    Voltar
                </Link>
            </div>
        </div>
    );
}
