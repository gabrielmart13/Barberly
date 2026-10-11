const KEY = "barberly:booking-draft";
const CONFIRM_KEY = "barberly:last-booking";
export function getBookingDraft() {
    try {
        return JSON.parse(sessionStorage.getItem(KEY) || "{}");
    }
    catch {
        return {};
    }
}
export function saveBookingDraft(patch) {
    const next = { ...getBookingDraft(), ...patch };
    sessionStorage.setItem(KEY, JSON.stringify(next));
    return next;
}
export function clearBookingDraft() {
    sessionStorage.removeItem(KEY);
}
export function saveLastBooking(booking) {
    sessionStorage.setItem(CONFIRM_KEY, JSON.stringify(booking));
}
export function getLastBooking() {
    try {
        return JSON.parse(sessionStorage.getItem(CONFIRM_KEY) || "null");
    }
    catch {
        return null;
    }
}
export function toDayLabel(date) {
    return date.toLocaleDateString("pt-BR", { weekday: "long" });
}
export function generateTimeSlots(hours, date, durationMinutes = 30) {
    const weekday = toDayLabel(date).toLocaleLowerCase("pt-BR");
    const schedule = hours.filter((item) => {
        const day = String(item.diaSemana ?? item.DiaSemana ?? "").toLocaleLowerCase("pt-BR");
        return day === weekday || day === weekday.replace("-feira", "") || day.startsWith(weekday.slice(0, 3));
    });
    const slots = [];
    const now = new Date();
    for (const item of schedule) {
        const start = String(item.horaAbertura ?? item.HoraAbertura ?? "").slice(0, 5);
        const end = String(item.horaFechamento ?? item.HoraFechamento ?? "").slice(0, 5);
        if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end))
            continue;
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);
        for (let minutes = sh * 60 + sm; minutes + durationMinutes <= eh * 60 + em; minutes += 30) {
            const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
            const minute = String(minutes % 60).padStart(2, "0");
            const candidate = new Date(date);
            candidate.setHours(Number(hour), Number(minute), 0, 0);
            if (candidate > now)
                slots.push(`${hour}:${minute}`);
        }
    }
    return [...new Set(slots)].sort();
}
