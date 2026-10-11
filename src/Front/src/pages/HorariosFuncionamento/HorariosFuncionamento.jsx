
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";

import horarioService from "../../services/horarioFuncionamentoService";

import {
    apiMessage,
    asArray,
    idOf,
    nameOf,
    read,
    formatTime,
} from "../../utils/data";

import {
    getOwnBarbearias,
    getSelectedBarbeariaId,
} from "../../utils/ownerData";

import useActiveShop from "../../hooks/useActiveShop";

import "./HorariosFuncionamento.css";

const days = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
];

const emptyForm = {
    DiaSemana: "Segunda-feira",
    HoraAbertura: "08:00",
    HoraFechamento: "18:00",
    IdBarbearia: "",
};

function normalizeTime(value) {
    const formatted = formatTime(value);

    return /^\d{2}:\d{2}$/.test(formatted)
        ? formatted
        : "";
}

function toApiTime(value) {
    return `${value}:00`;
}

export default function HorariosFuncionamento() {
    const [shops, setShops] = useState([]);
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ ...emptyForm });

    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const { shopId, changeShop } = useActiveShop(shops);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [shopResult, hoursResult] = await Promise.all([
                getOwnBarbearias(),
                horarioService.listar(),
            ]);

            const ownShops = Array.isArray(shopResult)
                ? shopResult
                : [];

            setShops(ownShops);
            setItems(asArray(hoursResult));

            const selectedId = getSelectedBarbeariaId(ownShops);

            setForm((previous) => ({
                ...previous,
                IdBarbearia: String(
                    previous.IdBarbearia || selectedId || ""
                ),
            }));
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível carregar o expediente."
                )
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    const activeShopId = Number(shopId) || 0;

    const own = items.filter(
        (item) =>
            Number(
                read(item, "idBarbearia", "IdBarbearia")
            ) === activeShopId
    );

    const activeShop =
        shops.find(
            (shop) =>
                Number(idOf(shop, "barbearia")) === activeShopId
        ) ?? shops[0];

    function update(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (name === "IdBarbearia") {
            changeShop(value);
        }
    }

    function beginEdit(item) {
        const id = idOf(item, "horario");

        if (!id) {
            setError(
                "Não foi possível identificar o horário selecionado."
            );
            return;
        }

        setError("");
        setMessage("");
        setEditId(id);

        setForm({
            DiaSemana:
                read(item, "diaSemana", "DiaSemana") ??
                "Segunda-feira",
            HoraAbertura: normalizeTime(
                read(item, "horaAbertura", "HoraAbertura")
            ),
            HoraFechamento: normalizeTime(
                read(item, "horaFechamento", "HoraFechamento")
            ),
            IdBarbearia: String(
                read(item, "idBarbearia", "IdBarbearia") ??
                activeShopId
            ),
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    function reset() {
        setEditId(null);

        setForm({
            ...emptyForm,
            IdBarbearia: String(activeShopId || ""),
        });
    }

    async function submit(event) {
        event.preventDefault();

        if (saving || deletingId !== null) {
            return;
        }

        setError("");
        setMessage("");

        const selectedShopId = Number(form.IdBarbearia);

        if (
            !Number.isInteger(selectedShopId) ||
            selectedShopId <= 0 ||
            !shops.some(
                (shop) =>
                    Number(idOf(shop, "barbearia")) ===
                    selectedShopId
            )
        ) {
            setError("Selecione uma barbearia válida.");
            return;
        }

        if (!days.includes(form.DiaSemana)) {
            setError("Selecione um dia da semana válido.");
            return;
        }

        if (
            !/^\d{2}:\d{2}$/.test(form.HoraAbertura) ||
            !/^\d{2}:\d{2}$/.test(form.HoraFechamento)
        ) {
            setError("Informe horários de abertura e fechamento válidos.");
            return;
        }

        if (form.HoraFechamento <= form.HoraAbertura) {
            setError(
                "A hora de fechamento precisa ser posterior à hora de abertura."
            );
            return;
        }

        setSaving(true);

        try {
            const payload = {
                DiaSemana: form.DiaSemana,
                HoraAbertura: toApiTime(form.HoraAbertura),
                HoraFechamento: toApiTime(form.HoraFechamento),
                IdBarbearia: selectedShopId,
            };

            if (editId !== null) {
                await horarioService.atualizar(editId, payload);
                setMessage("Horário atualizado com sucesso.");
            } else {
                await horarioService.criar(payload);
                setMessage("Horário cadastrado com sucesso.");
            }

            reset();
            await load();
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível salvar o horário."
                )
            );
        } finally {
            setSaving(false);
        }
    }

    async function remove(item) {
        const id = idOf(item, "horario");

        if (!id || saving || deletingId !== null) {
            return;
        }

        const day = read(item, "diaSemana", "DiaSemana");
        const opening = formatTime(
            read(item, "horaAbertura", "HoraAbertura")
        );
        const closing = formatTime(
            read(item, "horaFechamento", "HoraFechamento")
        );

        const confirmed = window.confirm(
            `Deseja excluir o expediente de ${day} (${opening}–${closing})?`
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setMessage("");
        setDeletingId(id);

        try {
            await horarioService.excluir(id);

            if (String(editId) === String(id)) {
                reset();
            }

            setMessage("Horário excluído com sucesso.");
            await load();
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível excluir o horário."
                )
            );
        } finally {
            setDeletingId(null);
        }
    }

    const sortedHours = own.slice().sort((a, b) => {
        const dayA = days.indexOf(
            read(a, "diaSemana", "DiaSemana")
        );
        const dayB = days.indexOf(
            read(b, "diaSemana", "DiaSemana")
        );

        if (dayA !== dayB) {
            return (dayA < 0 ? 99 : dayA) -
                (dayB < 0 ? 99 : dayB);
        }

        return normalizeTime(
            read(a, "horaAbertura", "HoraAbertura")
        ).localeCompare(
            normalizeTime(
                read(b, "horaAbertura", "HoraAbertura")
            )
        );
    });

    return (
        <div className="page">
            <PageHeader
                eyebrow="CONFIGURAÇÕES"
                title="Gerenciar horários"
                subtitle="Defina os períodos de atendimento cadastrados para sua barbearia."
                action={
                    <Link
                        className="btn btn--secondary"
                        to="/dono/barbearia"
                    >
                        <Icon name="store" size={17} />
                        Ver barbearia
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

            {loading ? (
                <LoadingState />
            ) : shops.length === 0 ? (
                <EmptyState
                    title="Cadastre sua barbearia"
                    text="Os horários precisam estar vinculados a um estabelecimento."
                    action={
                        <Link
                            className="btn btn--primary"
                            to="/dono/barbearia"
                        >
                            Cadastrar barbearia
                        </Link>
                    }
                />
            ) : (
                <>
                    <div className="content-grid content-grid--2 hours-top">
                        <form
                            className="panel"
                            onSubmit={submit}
                        >
                            <div className="panel__header">
                                <div>
                                    <h2>
                                        {editId !== null
                                            ? "Editar período"
                                            : "Adicionar horário"}
                                    </h2>

                                    <p>
                                        Um registro representa um intervalo
                                        de expediente em um dia.
                                    </p>
                                </div>

                                <Icon name="clock" size={24} />
                            </div>

                            {shops.length > 1 && (
                                <div className="field">
                                    <label htmlFor="IdBarbearia">
                                        Barbearia
                                    </label>

                                    <select
                                        id="IdBarbearia"
                                        name="IdBarbearia"
                                        value={form.IdBarbearia}
                                        onChange={update}
                                        required
                                        disabled={editId !== null}
                                    >
                                        <option value="" disabled>
                                            Selecione uma barbearia
                                        </option>

                                        {shops.map((shop) => (
                                            <option
                                                key={idOf(
                                                    shop,
                                                    "barbearia"
                                                )}
                                                value={idOf(
                                                    shop,
                                                    "barbearia"
                                                )}
                                            >
                                                {nameOf(shop)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="field">
                                <label htmlFor="DiaSemana">
                                    Dia da semana *
                                </label>

                                <select
                                    id="DiaSemana"
                                    name="DiaSemana"
                                    value={form.DiaSemana}
                                    onChange={update}
                                    required
                                >
                                    {days.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>

                                <small className="field__hint">
                                    Confirme se a API recebe o dia da
                                    semana como texto ou como número.
                                </small>
                            </div>

                            <div
                                className="form-grid"
                                style={{ marginTop: 14 }}
                            >
                                <div className="field">
                                    <label htmlFor="HoraAbertura">
                                        Abertura *
                                    </label>

                                    <input
                                        id="HoraAbertura"
                                        name="HoraAbertura"
                                        type="time"
                                        value={form.HoraAbertura}
                                        onChange={update}
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="HoraFechamento">
                                        Fechamento *
                                    </label>

                                    <input
                                        id="HoraFechamento"
                                        name="HoraFechamento"
                                        type="time"
                                        value={form.HoraFechamento}
                                        onChange={update}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                {editId !== null && (
                                    <button
                                        type="button"
                                        className="btn btn--ghost"
                                        onClick={reset}
                                        disabled={saving}
                                    >
                                        Cancelar edição
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn--primary"
                                    disabled={
                                        saving ||
                                        deletingId !== null
                                    }
                                >
                                    {saving
                                        ? "Salvando..."
                                        : editId !== null
                                            ? "Salvar alterações"
                                            : "Adicionar horário"}
                                </button>
                            </div>
                        </form>

                        <section className="panel">
                            <div className="panel__header">
                                <div>
                                    <h2>Expediente cadastrado</h2>

                                    <p>
                                        {own.length} intervalo(s) para{" "}
                                        {nameOf(activeShop)}.
                                    </p>
                                </div>
                            </div>

                            {own.length === 0 ? (
                                <EmptyState
                                    title="Nenhum horário cadastrado"
                                    text="Adicione o primeiro período de funcionamento."
                                />
                            ) : (
                                <div className="data-list">
                                    {sortedHours.map((item, index) => {
                                        const itemId = idOf(
                                            item,
                                            "horario"
                                        );

                                        const deleting =
                                            String(deletingId) ===
                                            String(itemId);

                                        return (
                                            <div
                                                className="data-row"
                                                key={itemId ?? index}
                                            >
                                                <span className="hours-icon">
                                                    <Icon
                                                        name="clock"
                                                        size={18}
                                                    />
                                                </span>

                                                <div className="data-row__main">
                                                    <strong>
                                                        {read(
                                                            item,
                                                            "diaSemana",
                                                            "DiaSemana"
                                                        )}
                                                    </strong>

                                                    <p>
                                                        {formatTime(
                                                            read(
                                                                item,
                                                                "horaAbertura",
                                                                "HoraAbertura"
                                                            )
                                                        )}
                                                        {" — "}
                                                        {formatTime(
                                                            read(
                                                                item,
                                                                "horaFechamento",
                                                                "HoraFechamento"
                                                            )
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="data-row__actions">
                                                    <button
                                                        type="button"
                                                        className="icon-button"
                                                        title="Editar horário"
                                                        aria-label="Editar horário"
                                                        disabled={
                                                            saving ||
                                                            deletingId !== null
                                                        }
                                                        onClick={() =>
                                                            beginEdit(item)
                                                        }
                                                    >
                                                        <Icon
                                                            name="edit"
                                                            size={16}
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="icon-button"
                                                        title="Excluir horário"
                                                        aria-label="Excluir horário"
                                                        disabled={
                                                            saving ||
                                                            deletingId !== null
                                                        }
                                                        onClick={() =>
                                                            remove(item)
                                                        }
                                                    >
                                                        <Icon
                                                            name="trash"
                                                            size={16}
                                                        />
                                                    </button>

                                                    {deleting && (
                                                        <span>
                                                            Excluindo...
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </div>

                    <Notice type="warning">
                        Cadastrar o expediente não garante disponibilidade
                        real. O backend precisa validar o horário de
                        funcionamento, os horários dos barbeiros e os
                        conflitos entre agendamentos.
                    </Notice>
                </>
            )}
        </div>
    );
}
