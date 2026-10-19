import type { Copy } from "./talent-copy";
import { programmeEnd } from "./programme";

export const DEMO_AS_OF = "2026-10-19T12:00:00.000Z";
export const BUDGET = [
  { label: ["Rent", "Loyer", "Alquiler", "Аренда"] as Copy, amount: 3600 },
  { label: ["Utilities", "Charges", "Servicios", "Коммунальные услуги"] as Copy, amount: 720 },
  { label: ["Software", "Logiciels", "Software", "Программы"] as Copy, amount: 480 },
  { label: ["Connectivity", "Connexion", "Conectividad", "Связь"] as Copy, amount: 360 },
  { label: ["Contingency", "Imprévus", "Contingencia", "Резерв"] as Copy, amount: 840 },
];

export type Talent = {
  slug: string; alias: string; skill: Copy; evidence: Copy; status: "active" | "funding" | "preparation";
  start: string | null; end: string | null; received: number; committed: number; paid: number; audience: number; members: number;
  probability: number; admitted: string; resource: "rent" | "software" | "connectivity";
};
const start = "2026-09-03T12:00:00.000Z";
export const talents: Talent[] = [
  { slug: "atlasfit", alias: "AtlasFit", skill: ["Accessible strength coaching for first-time lifters.", "Coaching de force accessible aux débutants.", "Entrenamiento de fuerza accesible para principiantes.", "Доступные силовые тренировки для начинающих."], evidence: ["A 6-session beginner programme with technique demonstrations and accessible alternatives.", "Un programme débutant de 6 séances avec démonstrations et alternatives accessibles.", "Programa de 6 sesiones con demostraciones y alternativas accesibles.", "Программа из 6 занятий с демонстрацией техники и доступными альтернативами."], status: "active", start, end: programmeEnd(start), received: 6000, committed: 6000, paid: 660, audience: 420, members: 12, probability: 58, admitted: "2026-09-01", resource: "rent" },
  { slug: "motionlab", alias: "MotionLab", skill: ["Short mobility lessons for people working at desks.", "Leçons de mobilité pour les personnes travaillant au bureau.", "Movilidad para personas que trabajan en escritorios.", "Короткие занятия подвижностью для офисных работников."], evidence: ["Eight original mobility lessons, with seated modifications.", "Huit leçons originales avec adaptations assises.", "Ocho lecciones originales con adaptaciones sentadas.", "Восемь оригинальных занятий с вариантами сидя."], status: "funding", start: null, end: null, received: 2400, committed: 3600, paid: 0, audience: 180, members: 3, probability: 49, admitted: "2026-10-12", resource: "software" },
  { slug: "steadystep", alias: "SteadyStep", skill: ["Low-impact movement classes with thoughtful pacing.", "Cours à faible impact et rythme adapté.", "Clases de bajo impacto a un ritmo adecuado.", "Занятия с низкой нагрузкой и продуманным темпом."], evidence: ["A four-week lesson plan and three annotated class recordings.", "Un plan de quatre semaines et trois vidéos annotées.", "Plan de cuatro semanas y tres clases comentadas.", "План на четыре недели и три записи с пояснениями."], status: "preparation", start: null, end: null, received: 0, committed: 1200, paid: 0, audience: 95, members: 0, probability: 42, admitted: "2026-10-16", resource: "connectivity" },
  { slug: "formfirst", alias: "FormFirst", skill: ["Clear bodyweight technique without expensive equipment.", "Technique au poids du corps sans équipement coûteux.", "Técnica con peso corporal sin equipos costosos.", "Техника упражнений без дорогого оборудования."], evidence: ["Ten technique walkthroughs with progressions for beginners.", "Dix démonstrations avec progressions pour débutants.", "Diez demostraciones con progresiones para principiantes.", "Десять разборов техники с вариантами для начинающих."], status: "funding", start: null, end: null, received: 3900, committed: 4200, paid: 0, audience: 310, members: 8, probability: 64, admitted: "2026-10-08", resource: "rent" },
  { slug: "everydaypace", alias: "EverydayPace", skill: ["Consistent movement habits for busy schedules.", "Habitudes de mouvement pour les emplois du temps chargés.", "Hábitos de movimiento para horarios ocupados.", "Привычки движения для насыщенного расписания."], evidence: ["A habit-building workbook and five guided sessions.", "Un carnet d’habitudes et cinq séances guidées.", "Cuaderno de hábitos y cinco sesiones guiadas.", "Дневник привычек и пять занятий с сопровождением."], status: "preparation", start: null, end: null, received: 0, committed: 0, paid: 0, audience: 72, members: 0, probability: 36, admitted: "2026-10-18", resource: "software" },
];

export const outcome: Copy = ["Reach 100 distinct paying members, each retained for 60 consecutive days, before the 365-day deadline.", "Atteindre 100 membres payants distincts, chacun retenu pendant 60 jours consécutifs, avant l’échéance des 365 jours.", "Alcanzar 100 miembros de pago distintos, cada uno retenido 60 días consecutivos, antes del plazo de 365 días.", "Достичь 100 разных платящих участников, каждый из которых остаётся 60 дней подряд, до окончания 365 дней."];

export function filterTalents(search: { q: string; status: string; resource: string; sort: string }) {
  const query = search.q.toLowerCase();
  return talents.filter(t => `${t.alias} fitness ${t.skill.join(" ")}`.toLowerCase().includes(query) && (search.status === "all" || t.status === search.status) && (search.resource === "all" || t.resource === search.resource)).sort((a, b) => search.sort === "funding" ? a.received - b.received : b.admitted.localeCompare(a.admitted));
}