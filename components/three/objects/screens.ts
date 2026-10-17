// Telas desenhadas em canvas para os painéis do ato 4. Interfaces genéricas, sem nome de cliente.

import { TOKENS } from "@/lib/color";
import type { ScreenKind } from "./panels";

type Ctx = CanvasRenderingContext2D;

function box(ctx: Ctx, x: number, y: number, w: number, h: number, color: string, r = 6) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function label(ctx: Ctx, text: string, x: number, y: number, size: number, color: string, weight = 600) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.fillText(text, x, y);
}

const MUTED = "rgba(143,163,199,0.35)";
const FAINT = "rgba(143,163,199,0.16)";

function site(ctx: Ctx, w: number) {
  label(ctx, "Sua empresa,", 36, 112, 30, "#FFFFFF", 700);
  label(ctx, "bem apresentada.", 36, 148, 30, TOKENS.gis, 700);
  box(ctx, 36, 166, 220, 10, MUTED, 5);
  box(ctx, 36, 184, 170, 10, FAINT, 5);
  box(ctx, 36, 208, 120, 30, TOKENS.gis, 15);
  for (let i = 0; i < 3; i++) box(ctx, 36 + i * ((w - 72) / 3 + 0), 256, (w - 72) / 3 - 12, 44, FAINT, 8);
}

function portal(ctx: Ctx, w: number) {
  label(ctx, "Notícias", 36, 104, 26, "#FFFFFF", 700);
  for (let i = 0; i < 3; i++) {
    const y = 124 + i * 58;
    box(ctx, 36, y, 64, 46, MUTED, 6);
    box(ctx, 112, y + 6, 190, 10, "rgba(255,255,255,0.75)", 5);
    box(ctx, 112, y + 26, 150, 8, FAINT, 4);
  }
  box(ctx, w - 172, 88, 136, 196, FAINT, 10);
  label(ctx, "Filiação", w - 156, 122, 18, "#FFFFFF", 700);
  label(ctx, "online", w - 156, 144, 18, "#FFFFFF", 700);
  box(ctx, w - 156, 160, 104, 8, MUTED, 4);
  box(ctx, w - 156, 176, 84, 8, MUTED, 4);
  box(ctx, w - 156, 236, 104, 30, TOKENS.gis, 15);
  label(ctx, "Filie-se", w - 132, 257, 14, TOKENS.night, 700);
}

function erp(ctx: Ctx, w: number) {
  box(ctx, 20, 64, 108, 236, FAINT, 10);
  ["Painel", "Financeiro", "Associados", "Relatórios"].forEach((item, i) => {
    if (i === 1) box(ctx, 28, 80 + i * 36, 92, 28, "rgba(127,209,199,0.18)", 6);
    label(ctx, item, 38, 99 + i * 36, 13, i === 1 ? TOKENS.gis : "rgba(255,255,255,0.7)", 600);
  });
  const x0 = 144;
  const tileW = (w - x0 - 20 - 24) / 3;
  ["R$", "%", "#"].forEach((sym, i) => {
    box(ctx, x0 + i * (tileW + 12), 64, tileW, 64, FAINT, 8);
    label(ctx, sym, x0 + i * (tileW + 12) + 14, 104, 22, i === 0 ? TOKENS.gis : "#FFFFFF", 700);
    box(ctx, x0 + i * (tileW + 12) + 14, 112, tileW - 40, 6, MUTED, 3);
  });
  const bars = [0.45, 0.7, 0.55, 0.85, 0.6, 0.95, 0.75];
  bars.forEach((v, i) => box(ctx, x0 + 8 + i * 46, 292 - v * 130, 28, v * 130, i === 5 ? TOKENS.gis : MUTED, 4));
}

function app(ctx: Ctx, w: number, h: number) {
  const pw = 150;
  const px = (w - pw) / 2;
  box(ctx, px, 56, pw, h - 72, "#0B0E16", 22);
  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(px, 56, pw, h - 72, 22);
  ctx.stroke();
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(px + 8, 64, pw - 16, h - 88, 16);
  ctx.clip();
  ctx.strokeStyle = FAINT;
  ctx.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.moveTo(px, 64 + i * 20);
    ctx.lineTo(px + pw, 50 + i * 20);
    ctx.stroke();
  }
  ctx.strokeStyle = TOKENS.gis;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(px + 24, 210);
  ctx.bezierCurveTo(px + 60, 170, px + 90, 190, px + 112, 112);
  ctx.stroke();
  ctx.fillStyle = TOKENS.gis;
  ctx.beginPath();
  ctx.arc(px + 112, 112, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  box(ctx, px + 14, h - 88, pw - 28, 48, "rgba(18,23,37,0.95)", 10);
  label(ctx, "Rastreamento", px + 24, h - 60, 13, "#FFFFFF", 700);
  box(ctx, px + 24, h - 52, 70, 6, MUTED, 3);
}

const TITLES: Record<ScreenKind, string> = {
  site: "Site institucional",
  portal: "Portal sindical",
  erp: "Sistema de gestão",
  app: "Aplicativo",
};

export function drawScreen(ctx: Ctx, kind: ScreenKind, w: number, h: number): void {
  ctx.clearRect(0, 0, w, h);
  box(ctx, 0, 0, w, h, TOKENS.nightSurface, 18);
  // barra do navegador/janela
  box(ctx, 0, 0, w, 40, "rgba(143,163,199,0.1)", 18);
  ["#E06C75", "#E5C07B", TOKENS.gis].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(22 + i * 18, 20, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  label(ctx, TITLES[kind], 86, 25, 13, "rgba(255,255,255,0.6)", 600);
  if (kind === "site") site(ctx, w);
  if (kind === "portal") portal(ctx, w);
  if (kind === "erp") erp(ctx, w);
  if (kind === "app") app(ctx, w, h);
}
