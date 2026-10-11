
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import Brand from "../components/Brand";
import Icon from "../components/Icon";

import authService from "../services/authService";
import { getSession } from "../utils/session";

const links = [
    { to: "/cliente/inicio", label: "Início", icon: "home", end: true },
    {
        to: "/cliente/agendamentos",
        label: "Agendamentos",
        icon: "calendar",
    },
    { to: "/cliente/favoritos", label: "Favoritos", icon: "heart" },
    { to: "/cliente/perfil", label: "Perfil", icon: "user" },
];

export default function CustomerLayout() {
    const navigate = useNavigate();
    const session = getSession();

    function logout() {
        authService.logout();
        navigate("/login", { replace: true });
    }

    return (
        <div className="app-shell customer-shell">
            <header className="topbar">
                <NavLink
                    to="/cliente/inicio"
                    className="brand-link"
                >
                    <Brand compact />
                </NavLink>

                <div className="topbar__right">
                    <span className="topbar__greeting">
                        Olá, {session?.nome ?? "cliente"}
                    </span>

                    <button
                        type="button"
                        className="avatar-button"
                        title="Sair da conta"
                        aria-label="Sair da conta"
                        onClick={logout}
                    >
                        {(session?.nome ?? "C")
                            .slice(0, 1)
                            .toUpperCase()}
                    </button>
                </div>
            </header>

            <main className="app-content">
                <Outlet />
            </main>

            <nav
                className="bottom-nav"
                aria-label="Navegação do cliente"
            >
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            `bottom-nav__item ${isActive ? "is-active" : ""
                            }`
                        }
                    >
                        <Icon name={link.icon} size={21} />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
