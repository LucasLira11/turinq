// Linha do tempo do plano-sequência da home: cada ato ocupa um trecho do progresso (0–1).

export type ActId = "abertura" | "anos" | "planeta" | "territorio" | "telas" | "fechamento";
export type Act = { id: ActId; label: string; start: number; end: number };

export const ACTS: readonly Act[] = [
  { id: "abertura", label: "Abertura", start: 0, end: 0.03 },
  { id: "anos", label: "20+ anos", start: 0.03, end: 0.2 },
  { id: "planeta", label: "Planeta", start: 0.2, end: 0.4 },
  { id: "territorio", label: "Território", start: 0.4, end: 0.62 },
  { id: "telas", label: "Telas", start: 0.62, end: 0.82 },
  { id: "fechamento", label: "Fechamento", start: 0.82, end: 1 },
];

// Altura total de scroll do filme, em svh; cada ato recebe a sua fração.
export const FILM_HEIGHT_SVH = 700;
