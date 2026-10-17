// Onde pôr o objeto 3D principal ao lado do texto (que fica à esquerda), para uma câmera a
// `distance` da origem com fov de 40°. No celular o objeto fica menor e acima do texto;
// em desktop estreito, menor e encostado na borda direita.

export const HALF_FOV_TAN = Math.tan((20 * Math.PI) / 180);

export function heroPlacement(aspect: number, distance = 4.2): { mobile: boolean; x: number; y: number; scale: number } {
  const mobile = aspect < 0.8;
  const k = distance / 4.2;
  if (mobile) return { mobile, x: 0, y: 0.95 * k, scale: 0.4 * k };
  const halfWidth = HALF_FOV_TAN * distance * aspect;
  // Desktop estreito (~800–1000 px): menor e encostado na borda, para não invadir o texto.
  if (aspect < 1.35) return { mobile, x: halfWidth * 0.66, y: 0, scale: 0.42 * k };
  return {
    mobile,
    x: Math.min(1.4 * k, halfWidth * 0.5),
    y: 0,
    scale: Math.min(0.95 * k, Math.max(0.5 * k, halfWidth * 0.34)),
  };
}
