
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Icon from "../../components/Icon";
import Notice from "../../components/Notice";

import authService from "../../services/authService";
import { apiMessage } from "../../utils/data";

import "./Cadastro.css";

export default function Cadastro() {
    const [tipo, setTipo] = useState("Usuario");

    const [form, setForm] = useState({
        Nome: "",
        Email: "",
        Contato: "",
        Senha: "",
        ConfirmarSenha: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [terms, setTerms] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

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

        if (form.Senha.length < 8) {
            setError("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (form.Senha !== form.ConfirmarSenha) {
            setError("As senhas não coincidem.");
            return;
        }

        if (!terms) {
            setError("É necessário concordar com os termos para continuar.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                Nome: form.Nome.trim(),
                Email: form.Email.trim(),
                Contato: form.Contato.trim(),
                Senha: form.Senha,
            };

            if (tipo === "Usuario") {
                await authService.criarUsuario(payload);
            } else {
                await authService.criarDono(payload);
            }

            navigate("/login", {
                replace: true,
                state: { registered: true },
            });
        } catch (err) {
            setError(
                apiMessage(err, "Não foi possível criar a conta.")
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout quote="Boas histórias começam com um bom corte.">
            <section className="auth-card auth-register">
                <div className="auth-card__top">
                    <Link to="/login" className="inline">
                        <Icon name="back" size={18} />
                        <span>Voltar</span>
                    </Link>

                    <span>
                        Já tem uma conta?{" "}
                        <Link to="/login">Fazer login</Link>
                    </span>
                </div>

                <h1>Criar conta</h1>

                <p className="auth-card__subtitle">
                    Junte-se ao Barberly e viva uma nova experiência.
                </p>

                {error && <Notice type="error">{error}</Notice>}

                <form onSubmit={submit}>
                    <div className="field">
                        <label htmlFor="Nome">Nome completo</label>

                        <input
                            id="Nome"
                            name="Nome"
                            placeholder="Seu nome completo"
                            value={form.Nome}
                            onChange={update}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="form-grid">
                        <div className="field">
                            <label htmlFor="Email">E-mail</label>

                            <input
                                id="Email"
                                name="Email"
                                type="email"
                                placeholder="seu@email.com"
                                value={form.Email}
                                onChange={update}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="Contato">Telefone</label>

                            <input
                                id="Contato"
                                name="Contato"
                                type="tel"
                                placeholder="(00) 00000-0000"
                                value={form.Contato}
                                onChange={update}
                                autoComplete="tel"
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="Senha">Senha</label>

                        <div className="auth-input-icon auth-input-icon--password">
                            <Icon name="lock" size={18} />

                            <input
                                id="Senha"
                                name="Senha"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Mínimo de 8 caracteres"
                                minLength={8}
                                value={form.Senha}
                                onChange={update}
                                required
                            />

                            <button
                                type="button"
                                aria-label={
                                    showPassword
                                        ? "Ocultar senha"
                                        : "Mostrar senha"
                                }
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                            >
                                <Icon
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={18}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="ConfirmarSenha">
                            Confirmar senha
                        </label>

                        <input
                            id="ConfirmarSenha"
                            name="ConfirmarSenha"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Digite a senha novamente"
                            value={form.ConfirmarSenha}
                            onChange={update}
                            required
                        />
                    </div>

                    <div className="field">
                        <span className="field__label">Tipo de conta</span>

                        <div className="role-options">
                            <div className="role-option">
                                <input
                                    type="radio"
                                    name="tipo"
                                    id="tipo-usuario"
                                    value="Usuario"
                                    checked={tipo === "Usuario"}
                                    onChange={() => setTipo("Usuario")}
                                />

                                <label htmlFor="tipo-usuario">
                                    <Icon name="user" size={24} />
                                    <strong>Cliente</strong>
                                    <small>
                                        Quero agendar serviços em barbearias.
                                    </small>
                                </label>
                            </div>

                            <div className="role-option">
                                <input
                                    type="radio"
                                    name="tipo"
                                    id="tipo-dono"
                                    value="DonoBarbearia"
                                    checked={tipo === "DonoBarbearia"}
                                    onChange={() => setTipo("DonoBarbearia")}
                                />

                                <label htmlFor="tipo-dono">
                                    <Icon name="store" size={24} />
                                    <strong>Dono da barbearia</strong>
                                    <small>
                                        Quero gerenciar minha barbearia no sistema.
                                    </small>
                                </label>
                            </div>
                        </div>
                    </div>

                    <label className="checkbox-line">
                        <input
                            type="checkbox"
                            checked={terms}
                            onChange={(event) =>
                                setTerms(event.target.checked)
                            }
                        />

                        <span>
                            Concordo com os{" "}
                            <button
                                type="button"
                                className="text-button"
                                onClick={() =>
                                    setError(
                                        "Os termos de uso ainda precisam ser publicados pelo projeto."
                                    )
                                }
                            >
                                Termos de Uso
                            </button>{" "}
                            e a{" "}
                            <button
                                type="button"
                                className="text-button"
                                onClick={() =>
                                    setError(
                                        "A política de privacidade ainda precisa ser publicada pelo projeto."
                                    )
                                }
                            >
                                Política de Privacidade
                            </button>
                            .
                        </span>
                    </label>

                    <button
                        type="submit"
                        className="btn btn--primary btn--block auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Criando conta..." : "Criar conta"}
                        <Icon name="arrow" size={19} />
                    </button>
                </form>

                <div className="auth-card__bottom">
                    Já tem uma conta? <Link to="/login">Fazer login</Link>
                </div>
            </section>
        </AuthLayout>
    );
}
