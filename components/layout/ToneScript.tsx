import { actPalette } from "@/components/three/film/timeline";
import { ROUTES } from "@/content/routes";

const TONES = Object.fromEntries(ROUTES.map((r) => [r.path, r.tone]));

// Roda antes da hidratação: o HTML estático não sabe o tom da página (nem em que ato a home foi
// recarregada), e sem isto texto branco ficaria sobre fundo claro até o JS assumir.
// - Rotas internas: aplica o tom da rota (rota desconhecida = 404, escura).
// - Home: a cada scroll (inclusive o da restauração de posição) pinta a cor assentada do ato
//   atual, até o FilmScroll assumir (window.__turinqFilmReady).
const SCRIPT = `(function(){
var d=document.documentElement,t=${JSON.stringify(TONES)},p=${JSON.stringify(actPalette())};
if(location.pathname!=="/"){d.dataset.tone=t[location.pathname]||"dark";return;}
function sync(){
if(window.__turinqFilmReady){removeEventListener("scroll",sync);return;}
var a=document.querySelectorAll("[data-act]"),id="abertura";
for(var i=0;i<a.length;i++){if(a[i].getBoundingClientRect().top<=1)id=a[i].getAttribute("data-act");}
var c=p[id],b=document.querySelector("[data-backdrop]");
d.dataset.tone=c.tone;if(b)b.style.backgroundColor=c.background;
}
addEventListener("scroll",sync,{passive:true});
})();`;

export default function ToneScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
