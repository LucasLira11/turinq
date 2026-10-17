import type { Tone } from "@/content/routes";
import { whatsappUrl } from "@/content/site";
import Button from "./Button";

export default function CtaBand({ title, message, tone }: { title: string; message?: string; tone: Tone }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
      <h2 className="mx-auto max-w-2xl font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      <Button href={whatsappUrl(message)} external tone={tone} className="mt-9">
        Conversar no WhatsApp
      </Button>
    </div>
  );
}
