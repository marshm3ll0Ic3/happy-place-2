import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, TrendingUp, Users } from "lucide-react";
import { useTalentCopy } from "@/lib/talent-copy";

type Q = readonly [string, string, string, string];

export function TwoLayers() {
  const { text } = useTalentCopy();
  const bullets: Q[] = [
    ["Which emerging trends are gaining momentum.", "Quelles tendances émergentes prennent de l’ampleur.", "Qué tendencias emergentes ganan impulso.", "Какие тренды набирают силу."],
    ["Which undiscovered creators are best positioned to capitalise on them.", "Quels créateurs méconnus sont les mieux placés pour en profiter.", "Qué creadores desconocidos están mejor posicionados.", "Какие неизвестные авторы лучше всего готовы на них заработать."],
    ["Which talents appear undervalued relative to demonstrated progress.", "Quels talents semblent sous-évalués par rapport à leurs progrès.", "Qué talentos parecen infravalorados frente a su progreso.", "Какие таланты недооценены относительно прогресса."],
    ["How the probability of individual success changes as an industry develops.", "Comment la probabilité de réussite évolue avec le secteur.", "Cómo cambia la probabilidad de éxito al desarrollarse la industria.", "Как вероятность успеха меняется с развитием отрасли."],
  ];
  const layers = [
    { to: "/markets" as const, icon: TrendingUp, title: ["Markets", "Marchés", "Mercados", "Рынки"] as Q, body: ["Discover emerging trends and predict future outcomes.", "Découvrez les tendances et prévoyez les résultats.", "Descubre tendencias y predice resultados.", "Находите тренды и прогнозируйте исходы."] as Q },
    { to: "/fund" as const, icon: Users, title: ["Talent / 365", "Talent / 365", "Talent / 365", "Talent / 365"] as Q, body: ["Discover promising talent and predict milestone success.", "Découvrez des talents prometteurs et prévoyez leurs objectifs.", "Descubre talento prometedor y predice sus objetivos.", "Находите таланты и прогнозируйте их цели."] as Q },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <p className="font-mono text-xs uppercase text-primary">DiSTRUB / {text(["Two layers, one exchange", "Deux couches, une bourse", "Dos capas, un mercado", "Два уровня, одна биржа"])}</p>
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold md:text-4xl">{text(["Emerging trends meet emerging human potential.", "Les tendances émergentes rencontrent le potentiel humain.", "Tendencias emergentes y potencial humano emergente.", "Новые тренды встречают новый человеческий потенциал."])}</h2>
      <div className="mt-10 border border-border bg-card p-5 md:p-8">
        <p className="text-center font-semibold">DiSTRUB</p>
        <p className="text-center text-sm text-muted-foreground">{text(["Prediction & Intelligence Exchange", "Bourse de prédiction et d’intelligence", "Mercado de predicción e inteligencia", "Биржа прогнозов и аналитики"])}</p>
        <ArrowDown className="mx-auto my-4 size-4 text-muted-foreground" />
        <div className="grid gap-3 sm:grid-cols-2">
          {layers.map(({ to, icon: Icon, title, body }) => (
            <Link key={to} to={to} className="group border border-border p-5 text-center transition-colors hover:border-primary">
              <Icon className="mx-auto size-5 text-primary" />
              <p className="mt-3 text-lg font-semibold">{text(title)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{text(body)}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary">{text(["Open", "Ouvrir", "Abrir", "Открыть"])} <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </div>
        <ArrowDown className="mx-auto my-4 size-4 text-muted-foreground" />
        <div className="border border-primary/40 bg-primary/10 p-5 text-center">
          <p className="text-lg font-semibold">{text(["Prediction Intelligence", "Intelligence prédictive", "Inteligencia predictiva", "Прогнозная аналитика"])}</p>
          <p className="mt-1 text-sm text-muted-foreground">{text(["Cross-market signals combining trends, talent performance and collective forecasts.", "Signaux croisés combinant tendances, performance des talents et prévisions collectives.", "Señales cruzadas de tendencias, rendimiento del talento y pronósticos colectivos.", "Сигналы на стыке трендов, результатов талантов и коллективных прогнозов."])}</p>
        </div>
      </div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3 border-t border-border pt-3 text-sm"><span className="font-mono text-primary">0{i + 1}</span>{text(b)}</li>
        ))}
      </ul>
    </section>
  );
}
