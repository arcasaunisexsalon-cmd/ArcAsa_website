import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/*
  Keeps the services a visitor adds with the "+" button.
  Both the Services page and the Appointment page read the same list.
  It is also saved in the browser (localStorage) so a refresh does not lose it.

  Each saved service looks like:
  { id, sid, name, price, priceLabel, scope, group }
*/

const BookingContext = createContext(null);
const STORAGE_KEY = "arcasa-booking-services";

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Ensure existing legacy items without a `qty` property default to qty = 1
    return Array.isArray(parsed)
      ? parsed.map((item) => ({ ...item, qty: item.qty ?? 1 }))
      : [];
  } catch {
    return [];// storage blocked or corrupted: start empty
  }
};

export const BookingProvider = ({ children }) => {
  const [services, setServices] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    } catch {
      /* private mode or storage full: the list still works until the page closes */
    }
  }, [services]);

  // Read current quantity for any service ID
  const getQty = useCallback(
    (id) => services.find((s) => s.id === id)?.qty ?? 0,
    [services]
  );

  // Directly sets/updates quantity or removes the item if qty <= 0
  const updateQty = useCallback((id, nextQty, serviceData) => {
    setServices((prev) => {
      if (nextQty <= 0) {
        return prev.filter((s) => s.id !== id);
      }

      const exists = prev.some((s) => s.id === id);
      if (exists) {
        return prev.map((s) =>
          s.id === id ? { ...s, qty: nextQty } : s
        );
      }

      // If item wasn't in cart yet, add it with the provided metadata and qty
      return serviceData ? [...prev, { ...serviceData, qty: nextQty }] : prev;
    });
  }, []);

  const toggleService = useCallback((service) => {
    setServices((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, { ...service, qty: service.qty ?? 1 }]
      );
    }, []);

  const removeService = useCallback((id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearServices = useCallback(() => setServices([]), []);

  const value = useMemo(
    () => {
      // Sum of all individual item quantities
    const totalCount = services.reduce((sum, s) => sum + (s.qty || 1), 0);

    // Sum of price * qty
    const totalPrice = services.reduce(
      (sum, s) =>
        sum + (typeof s.price === "number" ? s.price * (s.qty || 1) : 0),
      0
    );
    return {
      services,
      count: totalCount,
      total: totalPrice,
      isSelected: (id) => services.some((s) => s.id === id),
      getQty,
      updateQty,
      toggleService,
      removeService,
      clearServices,
    };
  },
    [services, getQty, updateQty ,toggleService, removeService, clearServices]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
};