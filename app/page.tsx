"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Monitor,
  Cpu,
  Smartphone,
  ChevronRight,
  ArrowUpRight,
  Code2,
  Zap,
  Globe,
  Shield,
  BarChart3,
  Layers,
  Clock,
  Users,
  Star,
} from "lucide-react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

/* ─── Animation Variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

/* ─── Data ─── */
const services = [
  {
    icon: Monitor,
    title: "Desenvolvimento Web",
    text: "Sites institucionais, landing pages e e-commerces de alta performance otimizados para SEO e conversão.",
    gradient: "from-blue-500 to-cyan-500",
    delay: 0,
  },
  {
    icon: Cpu,
    title: "Sistemas Sob Medida",
    text: "ERPs, CRMs e plataformas completas que automatizam e escalam a operação do seu negócio.",
    gradient: "from-violet-500 to-purple-600",
    delay: 0.1,
  },
  {
    icon: Smartphone,
    title: "Aplicativos Mobile",
    text: "Apps nativos e híbridos para iOS e Android com foco em experiência de usuário e performance.",
    gradient: "from-rose-500 to-pink-600",
    delay: 0.2,
  },
];

const projects = [
  {
    tag: "Sistema ERP",
    title: "Plataforma de Gestão Completa",
    desc: "Sistema empresarial robusto com controle de finanças, gestão de afiliações e módulos administrativos.",
    color: "from-blue-600/30 to-cyan-600/10",
    accent: "#3B82F6",
  },
  {
    tag: "Portal Corporativo",
    title: "Site Institucional Dinâmico",
    desc: "Plataforma profissional para empresas com sistema integrado de publicações e notícias diárias.",
    color: "from-violet-600/30 to-purple-600/10",
    accent: "#8B5CF6",
  },
  {
    tag: "App Mobile (IA)",
    title: "Rastreamento Inteligente",
    desc: "Aplicativo mobile para monitoramento e localização de transportes, otimizado com Inteligência Artificial.",
    color: "from-rose-600/30 to-pink-600/10",
    accent: "#F43F5E",
  },
];

const stats = [
  { value: "20+", label: "Anos de mercado", icon: Clock },
  { value: "15+", label: "Projetos entregues", icon: BarChart3 },
  { value: "98%", label: "Satisfação dos clientes", icon: Star },
  { value: "5+", label: "Especialistas", icon: Users },
];

const features = [
  { icon: Zap, text: "Entrega Ágil" },
  { icon: Code2, text: "Código Limpo" },
  { icon: Globe, text: "Stack Moderno" },
  { icon: Shield, text: "Alta Segurança" },
  { icon: Layers, text: "Arquitetura Escalável" },
  { icon: BarChart3, text: "+20 Anos de XP" },
];

/* ─── Noise SVG background ─── */
const NoiseBg = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ─── Magnetic Button Component ─── */
function MagneticButton({
  children,
  className = "",
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void; // <-- Adicionamos a tipagem do onClick aqui
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    setPos({ x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3 });
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick} // <-- Passamos a função para o elemento HTML
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  );
}

/* ─── Marquee ─── */
function Marquee({ items }: { items: string[] }) {
  const repeated = [...items, ...items];
  return (
    <div className="overflow-hidden py-4 border-y border-white/5">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="text-sm font-semibold tracking-[0.2em] uppercase text-slate-500 flex-shrink-0">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Page ─── */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[#080B12] text-white font-sans overflow-hidden">

      {/* ── NAV ── */}
      <header className="fixed w-full z-50 top-4 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center px-5 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-6 h-6">
                <Image src="/turinq-icon-branco.png" alt="Turinq" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold tracking-widest text-white">turinq</span>
            </div>

            {/* Links */}
            <nav className="hidden md:flex items-center gap-8">
              {["Início", "Sobre Nós", "Serviços", "Projetos"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "")}`}
                  className="text-xs font-semibold tracking-[0.15em] uppercase text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <MagneticButton
              onClick={() => window.open('https://wa.me/5522997793222', '_blank')}
              className="hidden md:flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl bg-white text-slate-900 hover:bg-blue-50 transition-colors duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Fale Conosco <ChevronRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </motion.div>
      </header>

      {/* ── HERO ── */}
      <section
        id="início"
        ref={heroRef}
        className="relative min-h-[100svh] flex items-center overflow-hidden"
      >
        {/* Background layers */}
        <NoiseBg />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B12] via-transparent to-[#080B12] z-10 pointer-events-none" />

        {/* Orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-15%] top-[-10%] w-[900px] h-[900px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute left-[-20%] bottom-[10%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
        />

        {/* Grid lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-8">
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-blue-400 border border-blue-500/20 bg-blue-500/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Mais de 20 anos de Inovação em Software
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
            >
              <span className="block text-white">O futuro do</span>
              <span className="block text-white">seu negócio,</span>
              <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-blue-300 bg-clip-text text-transparent">
                codificado hoje.
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed mb-12"
            >
              Produzimos sites, sistemas robustos e aplicativos de forma moderna, rápida e profissional.{" "}
              <span className="text-slate-300">A excelência que a sua marca exige.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <MagneticButton
                onClick={() => window.open('https://wa.me/5522997793222?text=Olá, gostaria de falar sobre um projeto.', '_blank')}
                className="flex items-center justify-center gap-2 bg-white text-slate-900 font-bold px-8 py-4 rounded-2xl text-sm shadow-[0_0_40px_rgba(255,255,255,0.12)] hover:bg-blue-50 transition-colors duration-200"
              >
                Iniciar um Projeto
                <ChevronRight className="w-4 h-4" />
              </MagneticButton>

              <MagneticButton
                onClick={() => document.getElementById('projetos')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-2xl text-sm border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-sm transition-colors duration-200"
              >
                Ver nosso trabalho
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="bg-[#080B12]/80 backdrop-blur-sm p-6 md:p-8 flex flex-col gap-1 group hover:bg-white/[0.03] transition-colors"
              >
                <s.icon className="w-4 h-4 text-slate-600 mb-1 group-hover:text-blue-400 transition-colors" />
                <span className="text-3xl md:text-4xl font-black tracking-tight text-white">{s.value}</span>
                <span className="text-xs text-slate-500 font-medium tracking-wide">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee
        items={[
          "Next.js",
          "React Native",
          "Node.js",
          "TypeScript",
          "PostgreSQL",
          "AWS",
          "Docker",
          "Kubernetes",
          "GraphQL",
          "Tailwind CSS",
        ]}
      />

      {/* ── SOBRE NÓS ── */}
      <section id="sobrenós" className="py-32 relative">
        <NoiseBg />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400 mb-4">
                Sobre Nós
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-[1.05]">
                Tradição que{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  impulsiona
                </span>{" "}
                o moderno.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-4">
                A Turinq não é apenas uma fábrica de software. Somos parceiros estratégicos de tecnologia. Com mais de duas
                décadas de atuação sólida, já vimos tecnologias nascerem, evoluírem e se tornarem obsoletas.
              </motion.p>
              <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-10">
                Aplicamos as melhores práticas globais de arquitetura de software para garantir que o seu sistema seja
                rápido, escalável e extremamente seguro.
              </motion.p>

              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-blue-500/20 hover:bg-blue-500/[0.03] transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-300">{f.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right – abstract visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-br from-slate-900 to-[#080B12] aspect-square flex items-center justify-center shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
                {/* Decorative rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {[280, 220, 160, 100].map((size, i) => (
                    <motion.div
                      key={i}
                      className="absolute border border-white/[0.04] rounded-full"
                      style={{ width: size, height: size }}
                      animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                      transition={{ duration: 40 + i * 10, repeat: Infinity, ease: "linear" }}
                    />
                  ))}
                </div>

                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-violet-600/10 pointer-events-none" />

                {/* Logo */}
                <div className="relative z-10 opacity-60 w-32 h-32">
                  <Image src="/turinq-icon-branco.png" alt="Turinq" fill className="object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.8)]" />
                </div>

                {/* Corner accents */}
                <div className="absolute top-6 right-6 w-24 h-24 border-t border-r border-blue-500/20 rounded-tr-xl pointer-events-none" />
                <div className="absolute bottom-6 left-6 w-24 h-24 border-b border-l border-violet-500/20 rounded-bl-xl pointer-events-none" />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-xl"
              >
                <p className="text-2xl font-black text-white">20+</p>
                <p className="text-xs text-slate-400 font-medium">Anos de experiência</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section id="serviços" className="py-32 relative border-t border-white/5">
        <NoiseBg />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.p variants={fadeUp} className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400 mb-4">
              Serviços
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight mb-5">
              O que construímos
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-xl mx-auto">
              De landing pages de alta conversão a sistemas complexos de gestão empresarial.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-5"
          >
            {services.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="relative group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden cursor-default"
              >
                {/* Subtle glow on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none rounded-3xl`}
                />

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.gradient} p-0.5 mb-6 shadow-lg`}>
                  <div className="w-full h-full rounded-2xl bg-[#080B12] flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{s.text}</p>

              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROJETOS ── */}
      <section id="projetos" className="py-32 relative border-t border-white/5">
        <NoiseBg />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          >
            <div>
              <motion.p variants={fadeUp} className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400 mb-4">
                Portfólio
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tight">
                Projetos de Destaque
              </motion.h2>
            </div>
            <motion.p variants={fadeUp} className="text-slate-400 max-w-xs">
              Sistemas e produtos que saíram das nossas telas para transformar o mercado.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {projects.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="group relative rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden cursor-pointer h-72 flex flex-col justify-end p-8 hover:border-white/10 transition-all duration-300"
              >
                {/* BG glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `linear-gradient(${p.accent} 1px, transparent 1px), linear-gradient(90deg, ${p.accent} 1px, transparent 1px)`,
                    backgroundSize: "32px 32px",
                  }}
                />

                {/* Corner dots */}
                <div className="absolute top-6 right-6 flex gap-1.5">
                  {[0, 1, 2].map((d) => (
                    <div key={d} className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" style={{ transitionDelay: `${d * 50}ms` }} />
                  ))}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <span
                    className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full mb-3 border"
                    style={{ color: p.accent, borderColor: `${p.accent}40`, background: `${p.accent}10` }}
                  >
                    {p.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-white/5">
        <NoiseBg />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative"
        >
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-blue-600/10 blur-3xl rounded-full pointer-events-none" />

          <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400 mb-6">Pronto para começar?</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.05]">
            Vamos construir algo{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              extraordinário
            </span>{" "}
            juntos.
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Fale com nossa equipe e descubra como podemos transformar sua ideia em realidade.
          </p>
          <MagneticButton
            onClick={() => window.open('https://wa.me/5522997793222?text=Olá, estava vendo o site da Turinq e gostaria de iniciar uma conversa sobre um projeto.', '_blank')}
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-10 py-4 rounded-2xl text-sm shadow-[0_0_60px_rgba(255,255,255,0.1)] hover:bg-blue-50 transition-colors duration-200"
          >
            Iniciar uma Conversa <ArrowUpRight className="w-4 h-4" />
          </MagneticButton>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="relative w-5 h-5">
                <Image src="/turinq-icon-branco.png" alt="Turinq" fill className="object-contain" />
              </div>
              <span className="text-lg font-bold tracking-widest text-white">turinq</span>
            </div>

            <nav className="flex gap-8">
              {["Início", "Sobre Nós", "Serviços", "Projetos"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "")}`}
                  className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} Turinq. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}