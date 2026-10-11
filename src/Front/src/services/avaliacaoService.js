import api from "../lib/api";
const avaliacaoService = {
    listar: async () => (await api.get("/Avaliacao")).data,
    buscarPorId: async (id) => (await api.get(`/Avaliacao/${id}`)).data,
    criar: async (dados) => (await api.post("/Avaliacao", dados)).data,
    atualizar: async (id, dados) => (await api.put(`/Avaliacao/${id}`, dados)).data,
    excluir: async (id) => (await api.delete(`/Avaliacao/${id}`)).data,
};
export default avaliacaoService;
