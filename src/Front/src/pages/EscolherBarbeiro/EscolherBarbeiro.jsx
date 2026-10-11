
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";

import barbeiroService from "../../services/barbeiroService";
import barbeariaService from "../../services/barbeariaService";

import {
    apiMessage,
    asArray,
    read,
    nameOf,
    idOf,
} from "../../utils/data";

import {
    getBookingDraft,
    saveBookingDraft,
} from "../../utils/bookingDraft";

import "./EscolherBarbeiro.css";

const barberImages = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
];

export default function EscolherBarbeiro() {
    const { barbeariaId } = useParams();
    const navigate = useNavigate();

    const [draft, setDraft] = useState(() => getBookingDraft());

    const [shop, setShop] = useState(null);
    const [barbers, setBarbers] = useState([]);
    const [selected, setSelected] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function load() {
            setLoading(true);
            setError("");

            try {
                const [barberData, shopData] = await Promise.all([
                    barbeiroService.listar(),
                    barbeariaService.buscarPorId(barbeariaId),
                ]);

                if (!active) {
                    return;
                }

                const currentShopId = Number(barbeariaId);

                setShop(shopData);

                setBarbers(
                    asArray(barberData).filter(
                        (barber) =>
                            Number(
                                read(
                                    barber,
                                    "idBarbearia",
                                    "IdBarbearia"
                                )
                            ) === currentShopId
                    )
                );

                setDraft(getBookingDraft());
            } catch (err) {
                if (active) {
                    setError(
                        apiMessage(
                            err,
                            "Não foi possível carregar os barbeiros."
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

    function next() {
        if (!selected) {
            setError("Selecione um barbeiro para continuar.");
            return;
        }

        if (
            Number(idOf(selected, "barbeiro")) <= 0 ||
            Number(idOf(shop, "barbearia")) !== Number(barbeariaId)
        ) {
            setError(
                "Não foi possível validar o barbeiro ou a barbearia selecionada."
            );
            return;
        }

        saveBookingDraft({
            ...draft,
            barbeariaId: Number(barbeariaId),
            barbearia: shop,
            barbeiroId: Number(idOf(selected, "barbeiro")),
            barbeiro: selected,
            data: null,
            hora: null,
        });

        navigate(`/cliente/agendar/${barbeariaId}/horario`);
    }

    return (
        <div className="page">
            <PageHeader
                eyebrow="NOVO AGENDAMENTO · 2 DE 4"
                title="Escolha o barbeiro"
                subtitle="Conheça a equipe e escolha o profissional para seu atendimento."
            />

            <div className="booking-shop-strip">
                <div className="booking-shop-strip__image" />

                <div className="grow">
                    <strong>{nameOf(shop)}</strong>

                    <p>
                        {read(shop, "endereco", "Endereco") ??
                            "Endereço não informado"}
                    </p>

                    <span className="muted tiny">
                        Serviço: {nameOf(draft.servico)}
                    </span>
                </div>

                <Link
                    className="btn btn--ghost btn--small"
                    to={`/cliente/agendar/${barbeariaId}/servico`}
                >
                    Trocar serviço
                </Link>
            </div>

            <div className="wizard-steps">
                <div className="wizard-step is-complete">
                    <span className="wizard-step__number">✓</span>
                    Serviço
                </div>

                <span className="wizard-step__line" />

                <div className="wizard-step is-active">
                    <span className="wizard-step__number">2</span>
                    Barbeiro
                </div>

                <span className="wizard-step__line" />

                <div className="wizard-step">
                    <span className="wizard-step__number">3</span>
                    Data e horário
                </div>

                <span className="wizard-step__line" />

                <div className="wizard-step">
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

            {loading ? (
                <LoadingState label="Carregando equipe..." />
            ) : barbers.length > 0 ? (
                <>
                    <div className="barber-choice-grid">
                        {barbers.map((barber, index) => {
                            const id = idOf(barber, "barbeiro");

                            const isSelected =
                                Number(id) ===
                                Number(idOf(selected, "barbeiro"));

                            const experience = read(
                                barber,
                                "experiencia",
                                "Experiencia"
                            );

                            const contact = read(
                                barber,
                                "contato",
                                "Contato"
                            );

                            return (
                                <button
                                    type="button"
                                    key={id}
                                    className={`barber-choice ${isSelected ? "is-selected" : ""
                                        }`}
                                    onClick={() => {
                                        setSelected(barber);
                                        setError("");
                                    }}
                                    aria-pressed={isSelected}
                                >
                                    <img
                                        src={
                                            barberImages[
                                            index % barberImages.length
                                            ]
                                        }
                                        alt={`Foto ilustrativa de ${nameOf(barber)}`}
                                        loading="lazy"
                                    />

                                    <div className="barber-choice__body">
                                        <strong>{nameOf(barber)}</strong>

                                        <p>
                                            {experience
                                                ? `${experience} de experiência`
                                                : "Profissional da equipe"}
                                        </p>

                                        <small>
                                            {contact ??
                                                "Atendimento na barbearia selecionada"}
                                        </small>
                                    </div>

                                    <span className="barber-choice__check">
                                        {isSelected && (
                                            <Icon
                                                name="check"
                                                size={18}
                                            />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="page-actions">
                        <Link
                            className="btn btn--ghost"
                            to={`/cliente/agendar/${barbeariaId}/servico`}
                        >
                            <Icon name="back" size={17} />
                            Voltar
                        </Link>

                        <div className="page-actions__right">
                            <button
                                type="button"
                                className="btn btn--primary"
                                disabled={!selected}
                                onClick={next}
                            >
                                Escolher data e horário
                                <Icon name="arrow" size={17} />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <EmptyState
                    title="Nenhum barbeiro disponível"
                    text="Cadastre barbeiros nesta barbearia antes de permitir o agendamento."
                    action={
                        <Link
                            className="btn btn--secondary"
                            to={`/cliente/agendar/${barbeariaId}/servico`}
                        >
                            Voltar ao serviço
                        </Link>
                    }
                />
            )}
        </div>
    );
}
