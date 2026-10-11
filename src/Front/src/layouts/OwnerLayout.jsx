
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import Brand from "../components/Brand";
import Icon from "../components/Icon";

import authService from "../services/authService";
import { getSession } from "../utils/session";

const links = [
    { to: "/dono/inicio", label: "Início", icon: "home", end: true },
    { to: "/dono/agenda", label: "Agenda", icon: "calendar" },
    { to: "/dono/servicos", label: "Serviços", icon: "scissors" },
    { to: "/dono/barbeiros", label: "Barbeiros", icon: "users" },
    { to: "/dono/horarios", label: "Horários", icon: "clock" },
    { to: "/dono/barbearia", label: "Barbearia", icon: "store" },
    { to: "/dono/perfil", label: "Perfil", icon: "settings" },
];

export default function OwnerLayout() {
    const navigate = useNavigate();
    const session = getSession();

    function logout() {
        authService.logout();
        navigate("/login", { replace: true });
    }

    return (
        <div className="app-shell owner-shell">
            <header className="topbar">
                <NavLink
                    to="/dono/inicio"
                    className="brand-link"
                >
                    <Brand compact />
                </NavLink>

                <div className="topbar__right">
                    <span className="topbar__greeting">
                        Painel do proprietário
                    </span>

                    <button
                        type="button"
                        className="avatar-button"
                        title={`Sair (${session?.nome ?? "conta"})`}
                        aria-label="Sair da conta"
                        onClick={logout}
                    >
                        {(session?.nome ?? "D")
                            .slice(0, 1)
                            .toUpperCase()}
                    </button>
                </div>
            </header>

            <nav
                className="owner-nav"
                aria-label="Navegação do proprietário"
            >
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            `owner-nav__item ${isActive ? "is-active" : ""
                            }`
                        }
                    >
                        <Icon name={link.icon} size={19} />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <main className="app-content app-content--owner">
                <Outlet />
            </main>
        </div>
    );
}
