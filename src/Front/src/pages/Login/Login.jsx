
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Icon from "../../components/Icon";
import Notice from "../../components/Notice";

import authService from "../../services/authService";

import { apiMessage } from "../../utils/data";
import { homeForRole } from "../../utils/session";

import "./Login.css";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        Email: "",
        Senha: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [success, setSuccess] = useState(
        location.state?.registered
            ? "Conta criada com sucesso. Entre com suas credenciais."
            : ""
    );

    function update(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    }

    async function submit(event) {
        event.preventDefault();

        if (loading) {
            return;
        }

        setError("");
        setSuccess("");

        const email = form.Email.trim();

        if (!email || !form.Senha) {
            setError("Informe seu e-mail e sua senha.");
            return;
        }

        setLoading(true);

        try {
            const data = await authService.login({
                Email: email,
                Senha: form.Senha,
            });

            const role =
                data?.tipoUsuario ?? data?.TipoUsuario;

            const fallback = homeForRole(role);

            if (!fallback) {
                setError(
                    "Não foi possível identificar o tipo da sua conta. Verifique a resposta da API."
                );
                return;
            }

            const requestedPath =
                location.state?.from?.pathname;

            const destination =
                requestedPath &&
                    requestedPath !== "/login" &&
                    requestedPath !== "/cadastro"
                    ? requestedPath
                    : fallback;

            navigate(destination, {
                replace: true,
                state: null,
            });
        } catch (err) {
            setError(
                apiMessage(
                    err,
                    "Não foi possível entrar. Confira suas credenciais e tente novamente."
                )
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout quote="Mais que um corte, uma experiência.">
            <section className="auth-card auth-login">
                <div className="auth-card__top">
                    <Link to="/" className="inline">
                        <Icon name="back" size={18} />
                        <span>Voltar</span>
                    </Link>

                    <span>BARBERLY / ACESSO</span>
                </div>

                <h1>Bem-vindo de volta</h1>

                <p className="auth-card__subtitle">
                    Faça login para continuar no Barberly.
                </p>

                {success && (
                    <Notice type="success">
                        {success}
                    </Notice>
                )}

                {error && (
                    <Notice
                        type="error"
                        onClose={() => setError("")}
                    >
                        {error}
                    </Notice>
                )}

                <form onSubmit={submit}>
                    <div className="field">
                        <label htmlFor="Email">
                            E-mail
                        </label>

                        <div className="auth-input-icon">
                            <Icon name="mail" size={18} />

                            <input
                                id="Email"
                                name="Email"
                                type="email"
                                autoComplete="email"
                                placeholder="seu@email.com"
                                value={form.Email}
                                onChange={update}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="Senha">
                            Senha
                        </label>

                        <div className="auth-input-icon auth-input-icon--password">
                            <Icon name="lock" size={18} />

                            <input
                                id="Senha"
                                name="Senha"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                autoComplete="current-password"
                                placeholder="Sua senha"
                                value={form.Senha}
                                onChange={update}
                                required
                                disabled={loading}
                            />

                            <button
                                type="button"
                                aria-label={
                                    showPassword
                                        ? "Ocultar senha"
                                        : "Mostrar senha"
                                }
                                aria-pressed={showPassword}
                                onClick={() =>
                                    setShowPassword(
                                        (previous) => !previous
                                    )
                                }
                                disabled={loading}
                            >
                                <Icon
                                    name={
                                        showPassword
                                            ? "eye-off"
                                            : "eye"
                                    }
                                    size={18}
                                />
                            </button>
                        </div>

                        <div className="auth-forgot">
                            <span className="muted tiny">
                                Use a conta cadastrada na API.
                            </span>

                            <button
                                type="button"
                                className="text-button"
                                onClick={() =>
                                    setError(
                                        "A recuperação de senha ainda não está implementada no backend."
                                    )
                                }
                            >
                                Esqueceu a senha?
                            </button>
                        </div>
                    </div>

                    <button
                        className="btn btn--primary btn--block auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Entrando..."
                            : "Entrar"}

                        <Icon name="arrow" size={19} />
                    </button>
                </form>

                <div className="auth-or">
                    <span />
                    ou
                    <span />
                </div>

                <p className="auth-note">
                    Entre com o e-mail e a senha cadastrados no
                    Barberly. O tipo de conta é identificado pelo
                    backend.
                </p>

                <div className="auth-card__bottom">
                    Não tem uma conta?{" "}
                    <Link to="/cadastro">
                        Criar conta
                        <Icon name="arrow" size={14} />
                    </Link>
                </div>
            </section>
        </AuthLayout>
    );
}
