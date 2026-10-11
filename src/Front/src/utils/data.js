export function read(object, ...keys) {
    if (!object)
        return undefined;
    for (const key of keys) {
        if (object[key] !== undefined && object[key] !== null)
            return object[key];
        const camel = key.charAt(0).toLowerCase() + key.slice(1);
        if (object[camel] !== undefined && object[camel] !== null)
            return object[camel];
    }
    return undefined;
}
export function asArray(value) {
    if (Array.isArray(value))
        return value;
    if (value && Array.isArray(value.$values))
        return value.$values;
    return [];
}
export function idOf(item, kind) {
    const keys = {
        barbearia: ["idBarbearia", "IdBarbearia", "id"],
        barbeiro: ["idBarbeiro", "IdBarbeiro", "id"],
        servico: ["idServico", "IdServico", "id"],
        usuario: ["idUsuario", "IdUsuario", "id"],
        dono: ["idDonoBarbearia", "IdDonoBarbearia", "id"],
        agendamento: ["idAgendamento", "IdAgendamento", "id"],
        categoria: ["idCategoria", "IdCategoria", "idCategoriaServico", "IdCategoriaServico", "id"],
        horario: ["idHorarioFuncionamento", "IdHorarioFuncionamento", "id"],
        avaliacao: ["idAvaliacao", "IdAvaliacao", "id"],
    };
    return read(item, ...(keys[kind] ?? ["id", "Id"]));
}
export function nameOf(item) {
    return read(item, "nome", "Nome") ?? "Sem nome";
}
export function apiMessage(error, fallback = "Não foi possível concluir a operação.") {
    const data = error?.response?.data;
    if (typeof data === "string" && data.trim())
        return data;
    if (data?.mensagem)
        return data.mensagem;
    if (data?.message)
        return data.message;
    if (data?.title)
        return data.title;
    if (data?.errors) {
        const messages = Object.values(data.errors).flat().filter(Boolean);
        if (messages.length)
            return messages.join(" ");
    }
    if (error?.response?.status === 401)
        return "Sua sessão expirou ou você não está autenticado. Entre novamente.";
    if (error?.response?.status === 403)
        return "Sua conta não tem permissão para realizar esta operação.";
    if (error?.response?.status === 404)
        return "O registro solicitado não foi encontrado.";
    if (error?.response?.status === 409)
        return "Já existe um registro com esses dados.";
    if (!error?.response)
        return "Não foi possível conectar à API. Confira se o backend está rodando e se a URL do .env está correta.";
    return fallback;
}
export function formatMoney(value) {
    const amount = Number(value ?? 0);
    return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
export function formatDate(value, options = { day: "2-digit", month: "short", year: "numeric" }) {
    if (!value)
        return "Data não informada";
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return String(value);
    return date.toLocaleDateString("pt-BR", options);
}
export function formatDateTime(value) {
    if (!value)
        return "Data não informada";
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return String(value);
    return `${date.toLocaleDateString("pt-BR")} às ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}
export function formatTime(value) {
    if (!value)
        return "--:--";
    if (typeof value === "string") {
        const match = value.match(/^(\d{1,2}:\d{2})/);
        if (match)
            return match[1].padStart(5, "0");
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime()))
            return parsed.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }
    return String(value);
}
export function formatStatus(status) {
    const normalized = String(status ?? "Pendente").toLocaleLowerCase("pt-BR");
    if (normalized.includes("confirm"))
        return "Confirmado";
    if (normalized.includes("conclu"))
        return "Concluído";
    if (normalized.includes("andamento"))
        return "Em andamento";
    if (normalized.includes("cancel"))
        return "Cancelado";
    return "Pendente";
}
