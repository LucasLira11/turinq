import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Turinq — Tecnologia e Desenvolvimento";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/logo-turinq.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 42%, #FFFFFF 0%, #E9ECF2 45%, #C9CED9 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={801 * 0.9} height={233 * 0.9} alt="" />
        <div style={{ marginTop: 36, fontSize: 30, letterSpacing: 12, color: "#4E5472", fontWeight: 700 }}>
          TECNOLOGIA E DESENVOLVIMENTO
        </div>
      </div>
    ),
    { ...size },
  );
}
