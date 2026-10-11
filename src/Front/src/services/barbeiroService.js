import api from "../lib/api";
const barbeiroService = {
    listar: async () => (await api.get("/Barbeiro")).data,
    buscarPorId: async (id) => (await api.get(`/Barbeiro/${id}`)).data,
    criar: async (dados) => (await api.post("/Barbeiro", dados)).data,
    atualizar: async (id, dados) => (await api.put(`/Barbeiro/${id}`, dados)).data,
    excluir: async (id) => (await api.delete(`/Barbeiro/${id}`)).data,
};
export default barbeiroService;
