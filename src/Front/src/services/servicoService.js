import api from "../lib/api";
const servicoService = {
    listar: async () => (await api.get("/Servico")).data,
    buscarPorId: async (id) => (await api.get(`/Servico/${id}`)).data,
    criar: async (dados) => (await api.post("/Servico", dados)).data,
    atualizar: async (id, dados) => (await api.put(`/Servico/${id}`, dados)).data,
    excluir: async (id) => (await api.delete(`/Servico/${id}`)).data,
};
export default servicoService;
