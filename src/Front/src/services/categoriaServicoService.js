import api from "../lib/api";
const categoriaServicoService = {
    listar: async () => (await api.get("/CategoriaServico")).data,
    buscarPorId: async (id) => (await api.get(`/CategoriaServico/${id}`)).data,
    criar: async (dados) => (await api.post("/CategoriaServico", dados)).data,
    atualizar: async (id, dados) => (await api.put(`/CategoriaServico/${id}`, dados)).data,
    excluir: async (id) => (await api.delete(`/CategoriaServico/${id}`)).data,
};
export default categoriaServicoService;
