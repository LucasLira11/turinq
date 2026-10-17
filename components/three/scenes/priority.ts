// As cenas calculam o estado do quadro (frame, câmera, scanner) antes de os objetos lerem.
// Prioridade negativa roda antes da padrão (0) e, ao contrário de positiva, não tira do R3F a
// renderização — importa no modo sob demanda (movimento reduzido), onde só há um quadro por mudança.
export const DIRECTOR_PRIORITY = -1;
