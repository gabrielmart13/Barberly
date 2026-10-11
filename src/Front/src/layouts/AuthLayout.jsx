
import { Link } from "react-router-dom";
import Brand from "../components/Brand";

export default function AuthLayout({
    children,
    quote = "Boas histórias começam com um bom corte.",
}) {
    return (
        <div className="auth-shell">
            <aside className="auth-visual">
                <div className="auth-visual__shade" />

                <div className="auth-visual__content">
                    <Link to="/login" aria-label="Ir para login">
                        <Brand />
                    </Link>

                    <div className="auth-visual__quote">
                        <p>“{quote}”</p>
                        <span />
                    </div>
                </div>
            </aside>

            <main className="auth-main">
                <div className="auth-card-wrap">
                    {children}
                </div>
            </main>
        </div>
    );
}
