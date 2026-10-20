import { z } from "zod";
export const DEMO_TOPUPS = [1000, 5000, 25000, 100000] as const;
export const demoActionSchema = z.discriminatedUnion("action", [
 z.object({ action: z.literal("topup"), key: z.string().uuid(), amount: z.union([z.literal(1000), z.literal(5000), z.literal(25000), z.literal(100000)]), bucket: z.enum(["forecast", "resource"]) }),
 z.object({ action: z.literal("place"), key: z.string().uuid(), marketSlug: z.string().regex(/^[a-z0-9-]{3,64}$/), marketQuestion: z.string().min(1).max(200), marketCategory: z.string().max(60), side: z.enum(["yes", "no"]), priceCents: z.number().int().min(1).max(99), shares: z.number().int().min(1).max(1000000) }),
 z.object({ action: z.literal("cancel"), key: z.string().uuid(), orderId: z.string().uuid() }),
 z.object({ action: z.literal("spend"), key: z.string().uuid(), amountCents: z.number().int().min(1).max(10000000), purpose: z.enum(["support", "commercial"]) }),
 z.object({ action: z.literal("refund"), key: z.string().uuid(), transactionId: z.string().uuid() }),
]);
export type DemoAction = z.infer<typeof demoActionSchema>;
export const orderCostCents = (priceCents: number, shares: number) => priceCents * shares;
export const demoCopy = {
 title: ["Demo wallet", "Portefeuille démo", "Cartera demo", "Демо-кошелёк"],
 notice: ["Simulation only · No real money, charges or withdrawals. Forecast credits and resource units are separate.", "Simulation uniquement · Aucun argent réel, frais ou retrait. Crédits de prévision et unités de ressources séparés.", "Solo simulación · Sin dinero real, cargos ni retiros. Créditos y recursos separados.", "Только симуляция · Без реальных денег, списаний и вывода. Кредиты прогнозов и ресурсы разделены."],
 forecast: ["Forecast credits", "Crédits de prévision", "Créditos de pronóstico", "Кредиты прогнозов"],
 resource: ["Resource units", "Unités de ressources", "Unidades de recursos", "Единицы ресурсов"],
 add: ["Add free demo credits", "Ajouter des crédits démo gratuits", "Añadir créditos demo gratis", "Добавить бесплатные демо-кредиты"],
 free: ["Free", "Gratuit", "Gratis", "Бесплатно"],
 payment: ["Demo payment", "Paiement démo", "Pago demo", "Демо-платёж"],
 support: ["Talent support · Test", "Soutien talent · Test", "Apoyo a talento · Prueba", "Поддержка таланта · Тест"],
 commercial: ["Commercial booking · Test", "Réservation commerciale · Test", "Reserva comercial · Prueba", "Коммерческий заказ · Тест"],
 amount: ["Amount in resource units", "Montant en unités de ressources", "Importe en unidades de recursos", "Сумма в единицах ресурсов"],
 pay: ["Confirm demo payment", "Confirmer le paiement démo", "Confirmar pago demo", "Подтвердить демо-платёж"],
 history: ["Demo transactions", "Transactions démo", "Transacciones demo", "Демо-транзакции"],
 empty: ["No demo transactions yet", "Aucune transaction démo", "Aún no hay transacciones demo", "Демо-транзакций пока нет"],
 refund: ["Refund", "Rembourser", "Reembolsar", "Вернуть"],
 refunded: ["Refunded", "Remboursé", "Reembolsado", "Возвращено"],
 topup: ["Free demo top-up", "Ajout démo gratuit", "Recarga demo gratis", "Бесплатное пополнение"],
 order: ["Forecast order · Demo", "Ordre de prévision · Démo", "Orden de pronóstico · Demo", "Заявка прогноза · Демо"],
 cancel: ["Order cancellation · Refund", "Annulation · Remboursement", "Cancelación · Reembolso", "Отмена заявки · Возврат"],
 done: ["Demo transaction saved", "Transaction démo enregistrée", "Transacción demo guardada", "Демо-транзакция сохранена"],
 invalid: ["Enter a positive amount with at most two decimals", "Saisissez un montant positif avec deux décimales maximum", "Introduce un importe positivo con hasta dos decimales", "Введите положительную сумму с двумя знаками после запятой"],
 archived: ["Previous prototype · Archived balances", "Ancien prototype · Soldes archivés", "Prototipo anterior · Saldos archivados", "Старый прототип · Архивные балансы"],
 sandbox: ["Talent / 365 remains a separate device-local simulation. These test payments do not fund a creator or create a booking.", "Talent / 365 reste une simulation locale séparée. Ces paiements tests ne financent aucun créateur et ne créent aucune réservation.", "Talent / 365 sigue siendo una simulación local separada. Estos pagos de prueba no financian creadores ni crean reservas.", "Talent / 365 остаётся отдельной локальной симуляцией. Тестовые платежи не финансируют авторов и не создают заказов."],
} as const;
