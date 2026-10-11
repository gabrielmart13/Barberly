import barbeariaService from "../services/barbeariaService";
import { asArray, read } from "./data";
import { getUserId } from "./session";
export async function getOwnBarbearias() {
    const all = asArray(await barbeariaService.listar());
    const ownerId = getUserId();
    return all.filter((shop) => Number(read(shop, "idDonoBarbearia", "IdDonoBarbearia")) === Number(ownerId));
}
export function getSelectedBarbeariaId(shops) {
    const stored = Number(localStorage.getItem("barberly:active-shop-id"));
    return shops.find((shop) => Number(shop.idBarbearia ?? shop.IdBarbearia) === stored)?.idBarbearia
        ?? shops.find((shop) => Number(shop.idBarbearia ?? shop.IdBarbearia) === stored)?.IdBarbearia
        ?? shops[0]?.idBarbearia
        ?? shops[0]?.IdBarbearia
        ?? null;
}
