import { useT, type Lang } from "@/lib/i18n";

export type Copy = readonly [string, string, string, string];
export function translate(copy: readonly string[], lang: Lang) { return copy[lang === "fr" ? 1 : lang === "es" ? 2 : lang === "ru" ? 3 : 0] ?? copy[0] ?? ""; }
export function useTalentCopy() {
  const { lang } = useT();
  return { lang, text: (copy: readonly string[]) => translate(copy, lang), money: (amount: number) => new Intl.NumberFormat(lang, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount), date: (date: string) => new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeStyle: "short" }).format(new Date(date)) };
}

export const copy = {
  demo: ["Demo · Fictional programmes · No real money", "Démo · Programmes fictifs · Aucun argent réel", "Demo · Programas ficticios · Sin dinero real", "Демо · Вымышленные программы · Без реальных денег"],
  talents: ["Talents", "Talents", "Talentos", "Таланты"],
  forecasts: ["Forecasts", "Prévisions", "Pronósticos", "Прогнозы"],
  progress: ["Progress", "Progrès", "Progreso", "Прогресс"],
  how: ["How it works", "Fonctionnement", "Cómo funciona", "Как это работает"],
  trust: ["Trust & privacy", "Confiance et confidentialité", "Confianza y privacidad", "Доверие и приватность"],
  apply: ["Apply as a talent", "Candidater comme talent", "Solicitar como talento", "Подать заявку"],
  explore: ["Explore talents", "Découvrir les talents", "Explorar talentos", "Открыть таланты"],
  sub: ["Essential resources. A clear milestone. Exactly 365 days to make progress.", "Des ressources essentielles. Un objectif précis. Exactement 365 jours pour progresser.", "Recursos esenciales. Un objetivo claro. Exactamente 365 días para progresar.", "Необходимые ресурсы. Чёткая цель. Ровно 365 дней для прогресса."],
  active: ["Active · Demo", "En cours · Démo", "Activo · Demo", "Активна · Демо"],
  funding: ["Funding · Demo", "Financement · Démo", "Financiación · Demo", "Сбор средств · Демо"],
  preparation: ["Preparation · Demo", "Préparation · Démo", "Preparación · Demo", "Подготовка · Демо"],
  milestone: ["Outcome milestone", "Objectif final", "Objetivo final", "Итоговая цель"],
  budget: ["Resource budget", "Budget des ressources", "Presupuesto de recursos", "Бюджет ресурсов"],
  received: ["Received · Demo", "Reçu · Démo", "Recibido · Demo", "Получено · Демо"],
  committed: ["Committed · Demo", "Engagé · Démo", "Comprometido · Demo", "Обещано · Демо"],
  paid: ["Paid · Simulated", "Payé · Simulé", "Pagado · Simulado", "Оплачено · Симуляция"],
  reserved: ["Reserved · Demo", "Réservé · Démo", "Reservado · Demo", "Зарезервировано · Демо"],
  estimate: ["Forecast estimate · Simulation", "Estimation de prévision · Simulation", "Estimación · Simulación", "Оценка прогноза · Симуляция"],
  rules: ["Outcome rules", "Règles du résultat", "Reglas del resultado", "Правила исхода"],
  back: ["Back to talents", "Retour aux talents", "Volver a talentos", "Назад к талантам"],
  evidence: ["Skill evidence", "Preuves de compétences", "Pruebas de habilidades", "Подтверждение навыков"],
  selection: ["Selection summary · Fictional assessment", "Sélection · Évaluation fictive", "Selección · Evaluación ficticia", "Отбор · Вымышленная оценка"],
  credits: ["Free simulation credits have no cash value. They cannot be purchased, transferred, withdrawn or used for services or prizes.", "Les crédits de simulation gratuits n’ont aucune valeur monétaire. Ils ne peuvent être achetés, transférés, retirés ni utilisés pour des services ou des prix.", "Los créditos gratuitos no tienen valor monetario. No pueden comprarse, transferirse, retirarse ni pagar servicios o premios.", "Бесплатные кредиты не имеют денежной стоимости. Их нельзя купить, передать, вывести или использовать для услуг и призов."],
  unavailable: ["Real payments are unavailable. No funds are being collected.", "Les paiements réels sont indisponibles. Aucun fonds n’est collecté.", "Los pagos reales no están disponibles. No se recaudan fondos.", "Реальные платежи недоступны. Средства не собираются."],
  support: ["Support", "Soutien", "Apoyo", "Поддержка"],
  commercial: ["Commercial opportunities", "Opportunités commerciales", "Oportunidades comerciales", "Коммерческие возможности"],
  archived: ["Legacy prototype · Archived balances and intentions; not money or executed trades.", "Ancien prototype · Soldes et intentions archivés ; ni argent ni transactions exécutées.", "Prototipo anterior · Saldos e intenciones archivados; no son dinero ni operaciones ejecutadas.", "Старый прототип · Архивные балансы и заявки; не деньги и не исполненные сделки."],
  view: ["View programme", "Voir le programme", "Ver programa", "Открыть программу"],
  empty: ["No matching talents. Try different filters.", "Aucun talent trouvé. Essayez d’autres filtres.", "No hay talentos coincidentes. Cambia los filtros.", "Таланты не найдены. Измените фильтры."],
  overview: ["Overview", "Aperçu", "Resumen", "Обзор"],
} satisfies Record<string, Copy>;