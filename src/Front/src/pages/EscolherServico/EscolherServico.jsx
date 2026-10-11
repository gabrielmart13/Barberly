
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";

import barbeariaService from "../../services/barbeariaService";
import servicoService from "../../services/servicoService";

import {
    apiMessage,
    asArray,
    formatMoney,
    read,
    nameOf,
    idOf,
} from "../../utils/data";

import { saveBookingDraft } from "../../utils/bookingDraft";

import "./EscolherServico.css";

export default function EscolherServico() {
    const { barbeariaId } = useParams();
    const navigate = useNavigate();

    const [shop, setShop] = useState(null);
    const [services, setServices] = useState([]);
    const [selected, setSelected] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function load() {
            setLoading(true);
            setError("");
            setSelected(null);

            try {
                const [shopData, serviceData] = await Promise.all([
                    barbeariaService.buscarPorId(barbeariaId),
                    servicoService.listar(),
                ]);

                if (!active) {
                    return;
                }

                setShop(shopData);

                setServices(
                    asArray(serviceData).filter(
                        (service) =>
                            Number(
                                read(
                                    service,
                                    "idBarbearia",
                                    "IdBarbearia"
                                )
                            ) === Number(barbeariaId)
                    )
                );
            } catch (err) {
                if (active) {
                    setError(
                        apiMessage(
                            err,
                            "Não foi possível carregar os serviços."
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
            setError("Selecione um serviço para continuar.");
            return;
        }

        const serviceId = Number(idOf(selected, "servico"));

        if (
            !Number.isFinite(serviceId) ||
            serviceId <= 0 ||
            Number(idOf(shop, "barbearia")) !== Number(barbeariaId)
        ) {
            setError(
                "Não foi possível validar o serviço ou a barbearia selecionada."
            );
            return;
        }

        saveBookingDraft({
            barbeariaId: Number(barbeariaId),
            barbearia: shop,
            servicoId: serviceId,
            servico: selected,
            barbeiroId: null,
            barbeiro: null,
            data: null,
            hora: null,
        });

        navigate(`/cliente/agendar/${barbeariaId}/barbeiro`);
    }

    return (
        <div className="page">
            <PageHeader
                eyebrow="NOVO AGENDAMENTO · 1 DE 4"
                title="Escolha o serviço"
                subtitle={
                    shop
                        ? `Selecione o que deseja fazer em ${nameOf(shop)}.`
                        : "Selecione um serviço para continuar."
                }
                action={
                    <Link
                        className="btn btn--ghost"
                        to="/cliente/inicio"
                    >
                        <Icon name="back" size={17} />
                        Voltar às barbearias
                    </Link>
                }
            />

            <div className="wizard-steps">
                <div className="wizard-step is-active">
                    <span className="wizard-step__number">1</span>
                    Serviço
                </div>

                <span className="wizard-step__line" />

                <div className="wizard-step">
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
                <LoadingState label="Carregando serviços..." />
            ) : services.length > 0 ? (
                <>
                    <div className="service-selection">
                        {services.map((service) => {
                            const id = idOf(service, "servico");

                            const isSelected =
                                Number(id) ===
                                Number(idOf(selected, "servico"));

                            const duration = read(
                                service,
                                "tempoEstimado",
                                "TempoEstimado"
                            );

                            return (
                                <button
                                    key={id}
                                    type="button"
                                    className={`choice-card service-choice ${isSelected ? "is-selected" : ""
                                        }`}
                                    onClick={() => {
                                        setSelected(service);
                                        setError("");
                                    }}
                                    aria-pressed={isSelected}
                                >
                                    <span className="choice-card__symbol">
                                        <Icon
                                            name="scissors"
                                            size={25}
                                        />
                                    </span>

                                    <span className="choice-card__body">
                                        <strong>{nameOf(service)}</strong>

                                        <p>
                                            {duration
                                                ? `${duration} min estimados`
                                                : "Atendimento profissional"}
                                        </p>
                                    </span>

                                    <strong className="choice-card__price">
                                        {formatMoney(
                                            read(
                                                service,
                                                "valor",
                                                "Valor"
                                            )
                                        )}
                                    </strong>

                                    <span className="choice-check">
                                        {isSelected && (
                                            <Icon
                                                name="check"
                                                size={17}
                                            />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="page-actions">
                        <Link
                            to="/cliente/inicio"
                            className="btn btn--ghost"
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
                                Continuar para barbeiros
                                <Icon name="arrow" size={17} />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <EmptyState
                    title="Nenhum serviço cadastrado"
                    text="Esta barbearia ainda não publicou serviços ou a API não retornou resultados."
                    action={
                        <Link
                            className="btn btn--secondary"
                            to="/cliente/inicio"
                        >
                            Voltar
                        </Link>
                    }
                />
            )}
        </div>
    );
}
