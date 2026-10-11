
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";

import horarioService from "../../services/horarioFuncionamentoService";

import {
    apiMessage,
    asArray,
    formatMoney,
    read,
    nameOf,
} from "../../utils/data";

import {
    getBookingDraft,
    saveBookingDraft,
} from "../../utils/bookingDraft";

import "./EscolherHorario.css";

function today() {
    const date = new Date();

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

function getWeekday(raw) {
    if (raw === null || raw === undefined || String(raw).trim() === "") {
        return null;
    }

    const numeric = Number(raw);

    if (Number.isInteger(numeric) && numeric >= 0 && numeric <= 6) {
        return numeric;
    }

    const normalized = String(raw)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace("-feira", "")
        .trim();

    const weekdays = {
        domingo: 0,
        dom: 0,
        segunda: 1,
        seg: 1,
        terca: 2,
        ter: 2,
        quarta: 3,
        qua: 3,
        quinta: 4,
        qui: 4,
        sexta: 5,
        sex: 5,
        sabado: 6,
        sab: 6,
    };

    return weekdays[normalized] ?? null;
}

function getTimeInMinutes(value) {
    const match = String(value ?? "")
        .match(/^(\d{2}):(\d{2})(?::\d{2})?$/);

    if (!match) {
        return null;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (hours > 23 || minutes > 59) {
        return null;
    }

    return hours * 60 + minutes;
}

export default function EscolherHorario() {
    const { barbeariaId } = useParams();
    const navigate = useNavigate();

    const [draft, setDraft] = useState(() => getBookingDraft());

    const [hours, setHours] = useState([]);
    const [date, setDate] = useState(
        () => getBookingDraft().data || today()
    );
    const [time, setTime] = useState(
        () => getBookingDraft().hora || ""
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function load() {
            setLoading(true);
            setError("");

            try {
                const result = await horarioService.listar();

                if (!active) {
                    return;
                }

                setHours(
                    asArray(result).filter(
                        (item) =>
                            Number(
                                read(
                                    item,
                                    "idBarbearia",
                                    "IdBarbearia"
                                )
                            ) === Number(barbeariaId)
                    )
                );

                setDraft(getBookingDraft());
            } catch (err) {
                if (active) {
                    setError(
                        apiMessage(
                            err,
                            "Não foi possível carregar os horários de funcionamento."
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
    }, [barbeariaId]);

    const duration = Math.max(
        15,
        Number(
            read(
                draft.servico,
                "tempoEstimado",
                "TempoEstimado"
            ) || 30
        )
    );

    const slots = useMemo(() => {
        if (!date || date < today()) {
            return [];
        }

        const target = new Date(`${date}T12:00:00`);

        if (Number.isNaN(target.getTime())) {
            return [];
        }

        const weekday = target.getDay();
        const now = new Date();
        const output = [];

        const matchingHours = hours.filter(
            (item) =>
                getWeekday(
                    read(item, "diaSemana", "DiaSemana")
                ) === weekday
        );

        for (const item of matchingHours) {
            const start = getTimeInMinutes(
                read(item, "horaAbertura", "HoraAbertura")
            );

            const end = getTimeInMinutes(
                read(item, "horaFechamento", "HoraFechamento")
            );

            if (
                start === null ||
                end === null ||
                end <= start
            ) {
                continue;
            }

            for (
                let minutes = start;
                minutes + duration <= end;
                minutes += 30
            ) {
                const hour = String(
                    Math.floor(minutes / 60)
                ).padStart(2, "0");

                const minute = String(
                    minutes % 60
                ).padStart(2, "0");

                const slot = `${hour}:${minute}`;
                const slotDate = new Date(`${date}T${slot}:00`);

                if (slotDate > now) {
                    output.push(slot);
                }
            }
        }

        return [...new Set(output)].sort();
    }, [hours, date, duration]);

    function next() {
        setError("");

        if (!draft.servicoId || !draft.barbeiroId) {
            setError(
                "Seu agendamento está incompleto. Volte e selecione um serviço e um barbeiro."
            );
            return;
        }

        if (
            !date ||
            date < today() ||
            !time ||
            !slots.includes(time)
        ) {
            setError(
                "Selecione uma data e um horário válido antes de continuar."
            );
            return;
        }

        saveBookingDraft({
            ...draft,
            barbeariaId: Number(barbeariaId),
            data: date,
            hora: time,
        });

        navigate(`/cliente/agendar/${barbeariaId}/confirmar`);
    }

    const chosenDay = date
        ? new Date(`${date}T12:00:00`).toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        )
        : "";

    return (
        <div className="page">
            <PageHeader
                eyebrow="NOVO AGENDAMENTO · 3 DE 4"
                title="Escolha a data e o horário"
                subtitle="Os horários são calculados a partir do expediente cadastrado para a barbearia."
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

                <div className="wizard-step is-active">
                    <span className="wizard-step__number">3</span>
                    Data e horário
                </div>

                <span className="wizard-step__line" />

                <div className="wizard-step">
                    <span className="wizard-step__number">4</span>
                    Confirmação
                </div>
            </div>

            <div className="booking-summary-strip">
                <div className="booking-mini-image" />

                <div className="grow">
                    <strong>{nameOf(draft.servico)}</strong>
                    <p>
                        {nameOf(draft.barbeiro)} ·{" "}
                        {nameOf(draft.barbearia)}
                    </p>
                </div>

                <strong className="choice-card__price">
                    {formatMoney(
                        read(draft.servico, "valor", "Valor")
                    )}
                </strong>
            </div>

            {error && (
                <Notice
                    type="error"
                    onClose={() => setError("")}
                >
                    {error}
                </Notice>
            )}

            {loading ? (
                <LoadingState label="Consultando horário de funcionamento..." />
            ) : (
                <div className="content-grid content-grid--2 schedule-selection">
                    <section className="panel">
                        <div className="panel__header">
                            <div>
                                <h2>Escolha o dia</h2>
                                <p>Selecione uma data futura.</p>
                            </div>

                            <Icon name="calendar" size={23} />
                        </div>

                        <div className="field">
                            <label htmlFor="booking-date">
                                Data do agendamento
                            </label>

                            <input
                                type="date"
                                id="booking-date"
                                min={today()}
                                value={date}
                                onChange={(event) => {
                                    setDate(event.target.value);
                                    setTime("");
                                    setError("");
                                }}
                            />
                        </div>

                        <div className="selected-date">
                            <Icon name="calendar" size={18} />

                            <span>
                                {chosenDay
                                    ? chosenDay[0].toUpperCase() +
                                    chosenDay.slice(1)
                                    : "Selecione uma data"}
                            </span>
                        </div>

                        <div className="callout">
                            Os horários são calculados pelo expediente
                            cadastrado. A disponibilidade real e os
                            conflitos de agenda precisam ser validados
                            pelo backend antes de confirmar o agendamento.
                        </div>
                    </section>

                    <section className="panel">
                        <div className="panel__header">
                            <div>
                                <h2>Horários disponíveis</h2>
                                <p>
                                    Duração estimada: {duration} minutos.
                                </p>
                            </div>

                            <Icon name="clock" size={23} />
                        </div>

                        {!hours.length ? (
                            <EmptyState
                                title="Horários não cadastrados"
                                text="O proprietário ainda não cadastrou o expediente desta barbearia."
                            />
                        ) : !slots.length ? (
                            <EmptyState
                                title="Nenhum horário neste dia"
                                text="Escolha outra data ou peça para a barbearia configurar os horários."
                            />
                        ) : (
                            <div className="time-grid">
                                {slots.map((slot) => (
                                    <button
                                        type="button"
                                        key={slot}
                                        className={`time-slot ${time === slot
                                                ? "is-selected"
                                                : ""
                                            }`}
                                        aria-pressed={time === slot}
                                        onClick={() => {
                                            setTime(slot);
                                            setError("");
                                        }}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}

            <div className="page-actions">
                <Link
                    className="btn btn--ghost"
                    to={`/cliente/agendar/${barbeariaId}/barbeiro`}
                >
                    <Icon name="back" size={17} />
                    Voltar
                </Link>

                <div className="page-actions__right">
                    <button
                        type="button"
                        className="btn btn--primary"
                        disabled={!date || !time || loading}
                        onClick={next}
                    >
                        Revisar agendamento
                        <Icon name="arrow" size={17} />
                    </button>
                </div>
            </div>
        </div>
    );
}
