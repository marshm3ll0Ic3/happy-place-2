import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoNotice, TalentCard, TalentPageHeading } from "@/components/TalentUI";
import { copy, useTalentCopy } from "@/lib/talent-copy";
import { filterTalents, DEMO_AS_OF } from "@/lib/talents";
import { pageMeta } from "@/lib/route-meta";

export const Route = createFileRoute("/talents")({
  head: () => pageMeta("Discover talents", "Explore fictional talent programmes, skills, essential resources and 365-day outcomes."),
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s['q'] === "string" ? s['q'] : "", status: ["active", "funding", "preparation"].includes(String(s['status'])) ? String(s['status']) : "all", resource: ["rent", "software", "connectivity"].includes(String(s['resource'])) ? String(s['resource']) : "all", sort: s['sort'] === "funding" ? "funding" : "recent" }),
  component: Talents,
});
function Talents() {
  const { pathname } = useLocation();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { text, date } = useTalentCopy();
  if (pathname !== "/talents" && pathname !== "/talents/") return <Outlet />;
  const list = filterTalents(search);
  const change = (values: Partial<typeof search>) => navigate({ search: { ...search, ...values }, replace: true });
  return <><DemoNotice /><main className="mx-auto max-w-6xl px-5 pb-28 pt-10 md:pb-16"><TalentPageHeading title={text(copy.explore)} description={text(["Fitness educators with demonstrated work—not a minimum follower count. All records below are fictional examples.", "Des éducateurs sportifs avec un travail démontré, sans minimum d’abonnés. Tous les profils sont des exemples fictifs.", "Educadores con trabajo demostrado, sin mínimos de seguidores. Todos son ejemplos ficticios.", "Преподаватели фитнеса с подтверждённой работой, без минимума подписчиков. Все примеры вымышлены."])} />
  <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-4">
    <label className="space-y-2 text-xs text-muted-foreground">{text(["Search alias or skill", "Chercher un pseudonyme ou une compétence", "Buscar alias o habilidad", "Поиск псевдонима или навыка"])}<Input aria-label={text(["Search talents", "Chercher des talents", "Buscar talentos", "Поиск талантов"])} value={search.q} onChange={e=>change({q:e.target.value})}/></label>
    <label className="space-y-2 text-xs text-muted-foreground">{text(["Programme status", "Statut du programme", "Estado del programa", "Статус программы"])}<select className="talent-select" value={search.status} onChange={e=>change({status:e.target.value})}><option value="all">{text(["All statuses", "Tous les statuts", "Todos los estados", "Все статусы"])}</option>{(["active","funding","preparation"] as const).map(s=><option value={s} key={s}>{text(copy[s])}</option>)}</select></label>
    <label className="space-y-2 text-xs text-muted-foreground">{text(["Resource needed", "Ressource nécessaire", "Recurso necesario", "Нужный ресурс"])}<select className="talent-select" value={search.resource} onChange={e=>change({resource:e.target.value})}><option value="all">{text(["All resources", "Toutes les ressources", "Todos los recursos", "Все ресурсы"])}</option><option value="rent">{text(["Rent", "Loyer", "Alquiler", "Аренда"])}</option><option value="software">{text(["Software", "Logiciels", "Software", "Программы"])}</option><option value="connectivity">{text(["Connectivity", "Connexion", "Conectividad", "Связь"])}</option></select></label>
    <label className="space-y-2 text-xs text-muted-foreground">{text(["Sort", "Trier", "Ordenar", "Сортировка"])}<select className="talent-select" value={search.sort} onChange={e=>change({sort:e.target.value})}><option value="recent">{text(["Recently admitted", "Admission récente", "Admisión reciente", "Недавно принятые"])}</option><option value="funding">{text(["Least funded first", "Moins financés d’abord", "Menos financiados primero", "Меньше всего собрано"])}</option></select></label>
  </div><p className="my-5 text-xs text-muted-foreground">{list.length} / 5 · {text(["Demo snapshot", "Instantané démo", "Instantánea demo", "Демо-снимок"])} · {date(DEMO_AS_OF)}</p>
  {list.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(t=><TalentCard key={t.slug} talent={t}/>)}</div> : <div className="py-16 text-center"><p className="text-muted-foreground">{text(copy.empty)}</p><Button variant="outline" className="mt-4" onClick={()=>change({q:"",status:"all",resource:"all"})}>{text(["Clear filters", "Effacer les filtres", "Borrar filtros", "Сбросить фильтры"])}</Button></div>}
  <Button asChild variant="outline" className="mt-8"><Link to="/apply">{text(copy.apply)}</Link></Button><Outlet /></main></>;
}