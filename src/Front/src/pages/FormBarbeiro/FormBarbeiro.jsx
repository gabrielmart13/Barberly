
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import Notice from "../../components/Notice";
import LoadingState from "../../components/LoadingState";
import Icon from "../../components/Icon";

import barbeiroService from "../../services/barbeiroService";

import {
    apiMessage,
    read,
    nameOf,
    idOf,
} from "../../utils/data";

import {
    getOwnBarbearias,
    getSelectedBarbeariaId,
} from "../../utils/ownerData";

import "./FormBarbeiro.css";

const emptyForm = {
    Nome: "",
    Email: "",
    Contato: "",
    Experiencia: "",
    IdBarbearia: "",
};

export default function FormBarbeiro() {
    const { id } = useParams();
    const edit = Boolean(id);

    const navigate = useNavigate();

    const [shops, setShops] = useState([]);
    const [form, setForm] = useState({ ...emptyForm });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function load() {
            setLoading(true);
            setError("");

            try {
                const result = await getOwnBarbearias();
                const ownShops = Array.isArray(result) ? result : [];

                if (!active) {
                    return;
                }

                setShops(ownShops);

                const defaultShopId = String(
                    getSelectedBarbeariaId(ownShops) ?? ""
                );

                if (!edit) {
                    setForm({
                        ...emptyForm,
                        IdBarbearia: defaultShopId,
                    });

                    return;
                }

                const barber = await barbeiroService.buscarPorId(id);

                if (!active) {
                    return;
                }

                const barberShopId = String(
                    read(
                        barber,
                        "idBarbearia",
                        "IdBarbearia"
                    ) ?? ""
                );

                setForm({
                    Nome: read(barber, "nome", "Nome") ?? "",
                    Email: read(barber, "email", "Email") ?? "",
                    Contato: read(barber, "contato", "Contato") ?? "",
                    Experiencia:
                        read(
                            barber,
                            "experiencia",
                            "Experiencia"
                        ) ?? "",
                    IdBarbearia: barberShopId,
                });

                const belongsToOwnShop = ownShops.some(
                    (shop) =>
                        String(idOf(shop, "barbearia")) ===
                        barberShopId
                );

                if (!belongsToOwnShop) {
                    setError(
                        "Este barbeiro não está vinculado a uma barbearia da sua conta."
                    );
                }
            } catch (err) {
                if (active) {
                    setError(
                        apiMessage(
                            err,
                            "Não foi possível carregar os dados do barbeiro."
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
    }, [id, edit]);

    function update(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function submit(event) {
        event.preventDefault();
        setError("");

        if (!form.Nome.trim()) {
            setError("Informe o nome do barbeiro.");
            return;
        }

        if (!form.Email.trim()) {
            setError("Informe o e-mail do barbeiro.");
            return;
        }

        if (!form.Contato.trim()) {
            setError("Informe o telefone ou contato do barbeiro.");
            return;
        }

        const shopId = Number(form.IdBarbearia);

        if (
            !Number.isInteger(shopId) ||
            shopId <= 0 ||
            !shops.some(
                (shop) =>
                    Number(idOf(shop, "barbearia")) === shopId
            )
        ) {
            setError("Selecione uma barbearia válida da sua conta.");
            return;
        }

        setSaving(true);

        try {
            const payload = {
                Nome: form.Nome.trim(),
                Email: form.Email.trim(),
                Contato: form.Contato.trim(),
                Experiencia: form.Experiencia.trim(),
                IdBarbearia: shopId,
            };

            if (edit) {
                await barbeiroService.atualizar(id, payload);
            } else {
                await barbeiroService.criar(payload);
            }

            navigate("/dono/barbeiros", {
                replace: true,
            });
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível salvar o barbeiro."
                )
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="page">
            <PageHeader
                title={
                    edit
                        ? "Editar barbeiro"
                        : "Adicionar barbeiro"
                }
                subtitle="Preencha os dados do profissional da sua equipe."
                action={
                    <Link
                        className="btn btn--ghost"
                        to="/dono/barbeiros"
                    >
                        <Icon name="back" size={17} />
                        Voltar à equipe
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
                <LoadingState label="Carregando dados do barbeiro..." />
            ) : !shops.length ? (
                <Notice type="warning">
                    Cadastre primeiro uma barbearia na seção Barbearia.
                    Um barbeiro precisa estar vinculado a um estabelecimento.
                    <div style={{ marginTop: 12 }}>
                        <Link
                            className="btn btn--secondary"
                            to="/dono/barbearia"
                        >
                            Configurar barbearia
                        </Link>
                    </div>
                </Notice>
            ) : (
                <form
                    onSubmit={submit}
                    className="panel"
                >
                    <div className="panel__header">
                        <div>
                            <h2>Informações do profissional</h2>
                            <p>
                                Preencha os dados solicitados pela API.
                            </p>
                        </div>

                        <Icon name="user" size={24} />
                    </div>

                    <div className="form-grid">
                        <div className="field field--full">
                            <label htmlFor="Nome">
                                Nome completo *
                            </label>

                            <input
                                id="Nome"
                                name="Nome"
                                value={form.Nome}
                                onChange={update}
                                required
                                maxLength={120}
                                placeholder="Nome do barbeiro"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="Email">
                                E-mail *
                            </label>

                            <input
                                id="Email"
                                name="Email"
                                type="email"
                                value={form.Email}
                                onChange={update}
                                required
                                placeholder="barbeiro@email.com"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="Contato">
                                Telefone / contato *
                            </label>

                            <input
                                id="Contato"
                                name="Contato"
                                type="tel"
                                value={form.Contato}
                                onChange={update}
                                required
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="Experiencia">
                                Experiência
                            </label>

                            <input
                                id="Experiencia"
                                name="Experiencia"
                                value={form.Experiencia}
                                onChange={update}
                                placeholder="Ex.: 5 anos"
                            />

                            <small className="field__hint">
                                Verifique se o endpoint de atualização
                                da API salva este campo.
                            </small>
                        </div>

                        <div className="field">
                            <label htmlFor="IdBarbearia">
                                Barbearia *
                            </label>

                            <select
                                id="IdBarbearia"
                                name="IdBarbearia"
                                value={form.IdBarbearia}
                                onChange={update}
                                required
                            >
                                <option value="" disabled>
                                    Selecione uma barbearia
                                </option>

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
                    </div>

                    <div className="form-actions">
                        <Link
                            className="btn btn--ghost"
                            to="/dono/barbeiros"
                        >
                            Cancelar
                        </Link>

                        <button
                            className="btn btn--primary"
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Salvando..."
                                : "Salvar barbeiro"}

                            <Icon name="check" size={17} />
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
