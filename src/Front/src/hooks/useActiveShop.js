import { useCallback, useState } from "react";
import { getSelectedBarbeariaId } from "../utils/ownerData";

export default function useActiveShop(shops = []) {
    const [selectedShopId, setSelectedShopId] = useState(null);

    const shopId = selectedShopId !== null
        ? Number(selectedShopId) || 0
        : Number(getSelectedBarbeariaId(shops) ?? 0) || 0;

    const changeShop = useCallback((value) => {
        const id = String(value);

        setSelectedShopId(id);
        localStorage.setItem("barberly:active-shop-id", id);
    }, []);

    return {
        shopId,
        changeShop,
    };
}