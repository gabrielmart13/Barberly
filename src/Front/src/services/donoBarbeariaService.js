import api from "../lib/api";
const donoBarbeariaService = {
    buscarPorId: async (id) => (await api.get(`/DonoBarbearia/${id}`)).data,
    atualizar: async (id, dados) => (await api.put(`/DonoBarbearia/${id}`, dados)).data,
    excluir: async (id) => (await api.delete(`/DonoBarbearia/${id}`)).data,
};
export default donoBarbeariaService;
