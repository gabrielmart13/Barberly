import api from "../lib/api";
const agendamentoService = {
    listar: async () => (await api.get("/Agendamento")).data,
    buscarPorId: async (id) => (await api.get(`/Agendamento/${id}`)).data,
    criar: async (dados) => (await api.post("/Agendamento", dados)).data,
    excluir: async (id) => (await api.delete(`/Agendamento/${id}`)).data,
};
export default agendamentoService;
