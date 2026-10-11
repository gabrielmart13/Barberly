export function getSession() {
    try {
        const stored = localStorage.getItem("usuario");
        return stored ? JSON.parse(stored) : null;
    }
    catch {
        return null;
    }
}
export function getToken() {
    return localStorage.getItem("token");
}
export function getRole() {
    const user = getSession();
    return user?.tipoUsuario ?? user?.TipoUsuario ?? null;
}
export function getUserId() {
    const user = getSession();
    const id = user?.id ?? user?.Id;
    return id == null ? null : Number(id);
}
export function homeForRole(role = getRole()) {
    return role === "DonoBarbearia" ? "/dono/inicio" : "/cliente/inicio";
}
export function normalizeText(value) {
    return String(value ?? "").trim().toLocaleLowerCase("pt-BR");
}
