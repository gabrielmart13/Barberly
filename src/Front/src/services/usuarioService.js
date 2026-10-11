import api from "../lib/api";
const usuarioService = {
    buscarPorId: async (id) => (await api.get(`/Usuario/${id}`)).data,
    atualizar: async (id, dados) => (await api.put(`/Usuario/${id}`, dados)).data,
    excluir: async (id) => (await api.delete(`/Usuario/${id}`)).data,
};
export default usuarioService;
