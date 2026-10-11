import api from "../lib/api";
const authService = {
    criarUsuario: async (dados) => {
        const { data } = await api.post("/Auth/usuario", dados);
        return data;
    },
    criarDono: async (dados) => {
        const { data } = await api.post("/Auth/dono", dados);
        return data;
    },
    login: async (credenciais) => {
        const { data } = await api.post("/Auth/login", credenciais);
        const token = data.token ?? data.Token;
        if (token) {
            localStorage.setItem("token", token);
            localStorage.setItem("usuario", JSON.stringify({
                id: data.id ?? data.Id,
                nome: data.nome ?? data.Nome,
                email: data.email ?? data.Email,
                tipoUsuario: data.tipoUsuario ?? data.TipoUsuario,
                expiraEmUtc: data.expiraEmUtc ?? data.ExpiraEmUtc,
            }));
        }
        return data;
    },
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
    },
};
export default authService;
