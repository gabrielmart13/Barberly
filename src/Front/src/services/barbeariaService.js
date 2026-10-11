import api from "../lib/api";
const barbeariaService = {
    listar: async () => (await api.get("/Barbearia")).data,
    buscarPorId: async (id) => (await api.get(`/Barbearia/${id}`)).data,
    criar: async (dados) => (await api.post("/Barbearia", dados)).data,
    atualizar: async (id, dados) => (await api.put(`/Barbearia/${id}`, dados)).data,
    excluir: async (id) => (await api.delete(`/Barbearia/${id}`)).data,
};
export default barbeariaService;
