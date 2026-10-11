import api from "../lib/api";
const horarioFuncionamentoService = {
    listar: async () => (await api.get("/HorarioFuncionamento")).data,
    buscarPorId: async (id) => (await api.get(`/HorarioFuncionamento/${id}`)).data,
    criar: async (dados) => (await api.post("/HorarioFuncionamento", dados)).data,
    atualizar: async (id, dados) => (await api.put(`/HorarioFuncionamento/${id}`, dados)).data,
    excluir: async (id) => (await api.delete(`/HorarioFuncionamento/${id}`)).data,
};
export default horarioFuncionamentoService;
