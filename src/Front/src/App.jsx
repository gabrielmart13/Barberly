
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./utils/ProtectedRoute";

import CustomerLayout from "./layouts/CustomerLayout";
import OwnerLayout from "./layouts/OwnerLayout";

import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";

import HomeCliente from "./pages/HomeCliente/HomeCliente";
import EscolherServico from "./pages/EscolherServico/EscolherServico";
import EscolherBarbeiro from "./pages/EscolherBarbeiro/EscolherBarbeiro";
import EscolherHorario from "./pages/EscolherHorario/EscolherHorario";
import ConfirmarAgendamento from "./pages/ConfirmarAgendamento/ConfirmarAgendamento";
import AgendamentoSucesso from "./pages/AgendamentoSucesso/AgendamentoSucesso";
import MeusAgendamentos from "./pages/MeusAgendamentos/MeusAgendamentos";
import DetalhesAgendamento from "./pages/DetalhesAgendamento/DetalhesAgendamento";
import PerfilCliente from "./pages/PerfilCliente/PerfilCliente";
import Favoritos from "./pages/Favoritos/Favoritos";

import DashboardDono from "./pages/DashboardDono/DashboardDono";
import AgendaDono from "./pages/AgendaDono/AgendaDono";
import GerenciarBarbeiros from "./pages/GerenciarBarbeiros/GerenciarBarbeiros";
import FormBarbeiro from "./pages/FormBarbeiro/FormBarbeiro";
import GerenciarServicos from "./pages/GerenciarServicos/GerenciarServicos";
import FormServico from "./pages/FormServico/FormServico";
import GerenciarCategorias from "./pages/GerenciarCategorias/GerenciarCategorias";
import HorariosFuncionamento from "./pages/HorariosFuncionamento/HorariosFuncionamento";
import ConfigurarBarbearia from "./pages/ConfigurarBarbearia/ConfigurarBarbearia";
import PerfilDono from "./pages/PerfilDono/PerfilDono";

export default function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            {/* Rotas do cliente */}
            <Route element={<ProtectedRoute roles={["Usuario"]} />}>
                <Route path="/cliente" element={<CustomerLayout />}>
                    <Route
                        index
                        element={<Navigate to="inicio" replace />}
                    />

                    <Route path="inicio" element={<HomeCliente />} />

                    <Route
                        path="agendar/:barbeariaId/servico"
                        element={<EscolherServico />}
                    />

                    <Route
                        path="agendar/:barbeariaId/barbeiro"
                        element={<EscolherBarbeiro />}
                    />

                    <Route
                        path="agendar/:barbeariaId/horario"
                        element={<EscolherHorario />}
                    />

                    <Route
                        path="agendar/:barbeariaId/confirmar"
                        element={<ConfirmarAgendamento />}
                    />

                    <Route
                        path="agendamento-confirmado"
                        element={<AgendamentoSucesso />}
                    />

                    <Route
                        path="agendamentos"
                        element={<MeusAgendamentos />}
                    />

                    <Route
                        path="agendamentos/:id"
                        element={<DetalhesAgendamento />}
                    />

                    <Route path="perfil" element={<PerfilCliente />} />
                    <Route path="favoritos" element={<Favoritos />} />
                </Route>
            </Route>

            {/* Rotas do dono da barbearia */}
            <Route element={<ProtectedRoute roles={["DonoBarbearia"]} />}>
                <Route path="/dono" element={<OwnerLayout />}>
                    <Route
                        index
                        element={<Navigate to="inicio" replace />}
                    />

                    <Route path="inicio" element={<DashboardDono />} />
                    <Route path="agenda" element={<AgendaDono />} />

                    <Route
                        path="barbeiros"
                        element={<GerenciarBarbeiros />}
                    />

                    <Route
                        path="barbeiros/novo"
                        element={<FormBarbeiro />}
                    />

                    <Route
                        path="barbeiros/:id/editar"
                        element={<FormBarbeiro />}
                    />

                    <Route
                        path="servicos"
                        element={<GerenciarServicos />}
                    />

                    <Route
                        path="servicos/novo"
                        element={<FormServico />}
                    />

                    <Route
                        path="servicos/:id/editar"
                        element={<FormServico />}
                    />

                    <Route
                        path="categorias"
                        element={<GerenciarCategorias />}
                    />

                    <Route
                        path="horarios"
                        element={<HorariosFuncionamento />}
                    />

                    <Route
                        path="barbearia"
                        element={<ConfigurarBarbearia />}
                    />

                    <Route path="perfil" element={<PerfilDono />} />
                </Route>
            </Route>

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </Routes>
    );
}
