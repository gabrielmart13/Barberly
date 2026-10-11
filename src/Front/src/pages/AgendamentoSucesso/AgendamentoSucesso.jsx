
import { Link, Navigate } from "react-router-dom";

import Icon from "../../components/Icon";

import { getLastBooking } from "../../utils/bookingDraft";
import {
    formatDateTime,
    formatMoney,
    read,
    nameOf,
} from "../../utils/data";

import "./AgendamentoSucesso.css";

export default function AgendamentoSucesso() {
    const result = getLastBooking();

    if (!result) {
        return (
            <Navigate
                to="/cliente/agendamentos"
                replace
            />
        );
    }

    const appointment = result.agendamento ?? {};

    const date =
        read(appointment, "dataHora", "DataHora") ??
        result.dataHora;

    const shopName = nameOf(result.barbearia);
    const serviceName = nameOf(result.servico);
    const barberName = nameOf(result.barbeiro);

    const shopAddress =
        read(result.barbearia, "endereco", "Endereco") ??
        "Endereço não informado";

    const servicePrice = read(
        result.servico,
        "valor",
        "Valor"
    );

    return (
        <div className="page booking-success">
            <div className="success-mark">
                <Icon name="check" size={38} />
            </div>

            <div className="eyebrow">
                BARBERLY · PEDIDO ENVIADO
            </div>

            <h1>Agendamento solicitado!</h1>

            <p className="booking-success__subtitle">
                Seu pedido foi enviado. A API registrou o status
                inicial como pendente.
            </p>

            <section className="panel booking-success__details">
                <h2>Detalhes do agendamento</h2>

                <div className="success-shop">
                    <div className="confirm-entity__image confirm-entity__image--shop" />

                    <div>
                        <strong>{shopName}</strong>
                        <p>{shopAddress}</p>
                    </div>
                </div>

                <div className="divider" />

                <div className="success-row">
                    <span>Serviço</span>
                    <strong>{serviceName}</strong>
                </div>

                <div className="success-row">
                    <span>Barbeiro</span>
                    <strong>{barberName}</strong>
                </div>

                <div className="success-row">
                    <span>Data e horário</span>
                    <strong>{formatDateTime(date)}</strong>
                </div>

                <div className="success-row">
                    <span>Valor estimado</span>
                    <strong>{formatMoney(servicePrice)}</strong>
                </div>

                <div className="success-row">
                    <span>Status</span>

                    <span className="appointment-status appointment-status--pendente">
                        Pendente
                    </span>
                </div>
            </section>

            <div className="booking-success__actions">
                <Link
                    className="btn btn--primary"
                    to="/cliente/agendamentos"
                >
                    Ver meus agendamentos
                    <Icon name="arrow" size={17} />
                </Link>

                <Link
                    className="btn btn--secondary"
                    to="/cliente/inicio"
                >
                    <Icon name="home" size={17} />
                    Voltar para início
                </Link>
            </div>
        </div>
    );
}
