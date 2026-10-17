// Roda `fn` quando o navegador fica ocioso (ou depois de `timeout` ms), mas só depois de o conteúdo
// principal (LCP) estar pintado. Devolve o cancelamento. Usado para tirar do caminho crítico tudo o
// que não é texto: 3D, scroll suave, animações — nada pesado é pedido antes da pintura principal.

function afterMainPaint(cb: () => void): () => void {
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    setTimeout(cb, 0);
  };
  // A entrada de LCP só chega depois de o quadro ser apresentado; `buffered` cobre o caso de já ter
  // acontecido. Sem suporte (Safari), dois quadros garantem que ao menos um foi desenhado.
  if (typeof PerformanceObserver !== "undefined" && PerformanceObserver.supportedEntryTypes?.includes("largest-contentful-paint")) {
    const po = new PerformanceObserver(() => {
      po.disconnect();
      go();
    });
    po.observe({ type: "largest-contentful-paint", buffered: true });
    return () => {
      done = true;
      po.disconnect();
    };
  }
  const frame = requestAnimationFrame(() => requestAnimationFrame(go));
  return () => {
    done = true;
    cancelAnimationFrame(frame);
  };
}

export function onIdle(fn: () => void, timeout = 2000): () => void {
  let cancelIdle = () => {};
  const cancelPaint = afterMainPaint(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(fn, { timeout });
      cancelIdle = () => window.cancelIdleCallback(id);
    } else {
      const t = setTimeout(fn, Math.min(timeout, 1200));
      cancelIdle = () => clearTimeout(t);
    }
  });
  return () => {
    cancelPaint();
    cancelIdle();
  };
}
