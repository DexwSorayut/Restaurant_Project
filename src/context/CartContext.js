import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { placeOrderRound } from '../db/database';

const CartContext = createContext(null);

// ราคาต่อหน่วย = ราคาอาหาร + ราคาบวกเพิ่มที่ติ๊กไว้ (หน่วยสตางค์)
export const itemUnitPrice = it =>
    it.food.price + (it.addons || []).reduce((s, a) => s + a.price, 0);

export const itemTotal = it => it.qty * itemUnitPrice(it);

// แปลงรายการให้ฐานข้อมูลเก็บราคารวมบวกเพิ่ม และจดชื่อบวกเพิ่มไว้ใน note
const toDbItems = items =>
    items.map(it => {
        const addonText = (it.addons || [])
            .map(a => `+${a.name} x${it.qty}`)
            .join(' ');

        const note = [addonText, it.note]
            .filter(Boolean)
            .join(' ');

        return {
            ...it,
            note,
            food: {
                ...it.food,
                price: itemUnitPrice(it)
            }
        };
    });

export function CartProvider({
    db,
    selectedTable,
    children
}) {
    const [cart, setCart] = useState([]);
    const [sealedRounds, setSealedRounds] = useState([]);

    const addItem = useCallback((food, qty, note, addons = []) => {
        setCart(prev => [
            ...prev,
            {
                key: `${food.food_id}-${Date.now()}`,
                food,
                qty,
                note,
                addons
            }
        ]);
    }, []);

    const setItemQty = useCallback((location, itemIndex, qty) => {
        if (location.scope === 'current') {
            setCart(prev => prev.map((it, i) => (i === itemIndex ? { ...it, qty } : it)));
        }
    }, []);

    const removeItem = useCallback((location, itemIndex) => {
        if (location.scope === 'current') {
            setCart(prev => prev.filter((_, i) => i !== itemIndex));
        }
    }, []);

    const roundSubtotal = items => items.reduce((sum, it) => sum + itemTotal(it), 0);

    const placeOrder = useCallback(async () => {
        if (cart.length === 0) return false;
        if (!selectedTable?.bill_id) {
            console.error('No open bill for selected table');
            return false;
        }
        const { roundId, roundNumber } =
            await placeOrderRound(
                db,
                selectedTable.bill_id,
                toDbItems(cart)
            );
        setSealedRounds(prev => [
            ...prev,
            {
                id: roundId,
                roundNumber,
                items: cart
            }
        ]);
        setCart([]);
        return true;
    }, [db, selectedTable, cart]);

    const grandTotal = useMemo(
        () => roundSubtotal(cart) + sealedRounds.reduce((sum, r) => sum + roundSubtotal(r.items), 0),
        [cart, sealedRounds]
    );

    const totalItemCount = useMemo(
        () => cart.length + sealedRounds.reduce((sum, r) => sum + r.items.length, 0),
        [cart, sealedRounds]
    );

    const payNow = useCallback(async () => {
        if (cart.length === 0) {
            return 0;
        }

        const { roundId, roundNumber } =
            await placeOrderRound(
                db,
                selectedTable.bill_id,
                toDbItems(cart)
            );

        setSealedRounds(prev => [
            ...prev,
            {
                id: roundId,
                roundNumber,
                items: cart
            }
        ]);

        setCart([]);

        return roundId;
    }, [db, cart]);

    const value = {
        cart,
        sealedRounds,
        addItem,
        setItemQty,
        removeItem,
        placeOrder,
        payNow,
        grandTotal,
        totalItemCount,
        roundSubtotal,
    };
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
}