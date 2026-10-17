import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-svh items-center text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <p className="font-mono text-xs tracking-[0.24em] text-gis uppercase">Erro 404</p>
        <h1 className="mt-6 max-w-2xl font-display text-4xl leading-[1.04] font-semibold tracking-tight sm:text-6xl">
          Coordenada não encontrada.
        </h1>
        <p className="mt-6 text-lg text-white/80">Essa página não está no nosso mapa.</p>
        <Button href="/" tone="dark" className="mt-10">
          Voltar ao início
        </Button>
      </div>
    </section>
  );
}
