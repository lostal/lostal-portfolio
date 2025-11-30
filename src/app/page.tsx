"use client";

import Marquee from "@/components/Marquee";
import Image from "next/image";
import Link from "next/link";
import FloatingContact from "@/components/FloatingContact";

const projects = [
  {
    id: "parking_gruposiete",
    title: "Parking Gruposiete",
    category: "WEB APP / INTERNAL TOOL",
    year: "2025",
    deploy: "https://gruposiete-parking.vercel.app/",
    repo: "https://github.com/lostal/gruposiete-parking",
    image: "parking_gruposiete",
    color: "#363f47"
  },
  {
    id: "vivenza_redesign",
    title: "Rediseño Vivenza Expo",
    category: "LANDING PAGE",
    year: "2025",
    deploy: "https://vivenza.netlify.app/",
    repo: "https://github.com/lostal/vivenza-redesign",
    image: "vivenza_redesign",
    color: "#2e6380"
  },
  {
    id: "creative_hands",
    title: "Creative Hands",
    category: "ECOMMERCE / PWA",
    year: "2024",
    deploy: "https://creative-hands-cjzg.onrender.com/",
    repo: "https://github.com/lostal/creative-hands",
    image: "creative_hands",
    color: "#b06445"
  }
];

export default function Home() {

  return (
    <>
      <main>
        {/* Hero Section: RE-DISEÑADO CON FOTO CENTRAL Y TEXTO ORIGINAL */}
        <section id="hero" className="min-h-screen flex flex-col justify-center items-center px-6 md:px-10 pt-32 pb-20 relative text-center">

          {/* Intro Text */}
          <div className="relative z-10">
            <h1 className="font-sans text-5xl md:text-7xl font-bold uppercase tracking-tighter">
              Hola, soy <span className="font-serif italic text-acid">Álvaro Lostal</span>
            </h1>
          </div>

          {/* Central Image Placeholder */}
          <div className="my-12 relative z-10 hoverable">
            <Image
              src="/alvaro.jpg"
              alt="Retrato de Álvaro Lostal"
              width={224}
              height={224}
              className="w-48 h-48 md:w-56 md:h-56 rounded-2xl object-cover border-4 border-paper shadow-2xl shadow-acid/20 transition-all duration-300 hover:scale-105 hover:shadow-acid/40"
              priority
            />
          </div>

          {/* Description */}
          <div className="relative z-10 max-w-xl mx-auto">
            <p className="font-sans text-xl md:text-2xl text-gray-300 leading-relaxed">
              Ingeniero Informático especializado en <strong className="text-white">Desarrollo Web Frontend</strong>.
              <br />
              Me inspiran el <span className="font-serif italic">diseño</span> y la <span className="font-serif italic">simplicidad</span>.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-12 relative z-10">
            <Link href="#contact" className="hoverable text-ink bg-acid px-8 py-3 rounded-full font-mono font-bold tracking-wide transition-all duration-300 hover:bg-paper">
              Contactar
            </Link>
            <Link href="#projects" className="hoverable text-paper border border-paper/30 px-8 py-3 rounded-full font-mono transition-all duration-300 hover:bg-paper hover:text-ink">
              Ver portafolio
            </Link>
          </div>

          {/* Decorative big element (conservado) */}
          <div className="absolute top-1/4 right-[10%] w-64 h-64 border border-acid rounded-full opacity-20 blur-3xl animate-pulse"></div>
        </section>

        {/* Projects: The Hover Reveal List (RESTORED & FIXED) */}
        <section id="projects" className="py-32 px-6 md:px-20 max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between mb-20">
            <h2 className="text-5xl md:text-7xl font-serif italic text-acid">Proyectos</h2>
            <p className="font-mono text-sm mt-6 md:mt-0 text-gray-400 max-w-xs text-right">
              Estos proyectos web reflejan mi enfoque en el diseño minimalista, una UX cuidada y buenas prácticas de desarrollo.
            </p>
          </div>

          <div className="flex flex-col">
            {projects.map((project, index) => (
              <div
                key={index}
                className="project-item group py-12 flex flex-col md:flex-row justify-between items-center border-t border-white/10 last:border-b"
                data-color={project.color}
                data-image={project.image}
              >
                {/* Main Link: Deploy */}
                <a
                  href={project.deploy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grow text-4xl md:text-6xl font-sans font-bold uppercase tracking-tighter group-hover:translate-x-4 transition-transform cursor-none hoverable"
                >
                  {project.title}
                </a>

                <div className="project-meta safe-hover-zone flex gap-10 items-center font-mono text-xs md:text-sm text-gray-500 mt-4 md:mt-0 relative z-50 mr-12">
                  <span>{project.category}</span>

                  {/* Secondary Link: Repo */}
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hoverable p-2 transition-transform hover:scale-110 cursor-none"
                    title="Ver código en GitHub"
                  >
                    <i className="fab fa-github text-2xl"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Infinite Skills Marquee */}
        <Marquee />

        {/* About & Timeline Mixed (ACTUALIZADO CON TEXTO ORIGINAL) */}
        <section id="recorrido" className="py-20 px-6 md:px-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Sticky Title */}
          <div className="md:col-span-4 md:sticky md:top-32">
            <h2 className="text-6xl font-sans font-bold mb-6">RE<span className="text-acid font-serif italic">CORRIDO</span></h2>
            <div className="w-20 h-1 bg-white mb-6"></div>
            <p className="font-mono text-sm text-gray-400 leading-relaxed mb-16">
              Experiencia profesional y académica que define mi perfil técnico y mis competencias.
            </p>
          </div>

          {/* Timeline Content */}
          <div className="md:col-span-8 space-y-20 md:pl-8">
            {/* Item: Experiencia */}
            <div className="group">
              <span className="font-mono text-acid text-sm mb-2 block">EXPERIENCIA</span>
              <h3 className="text-4xl font-serif italic mb-4">Prácticas en Desarrollo Web</h3>
              <h4 className="text-2xl font-sans text-gray-300 mb-4">Eurocastalia <span className="text-lg text-gray-500 ml-2">(Sep 2025 - Actualidad)</span></h4>
              <p className="text-xl font-sans font-light leading-relaxed text-gray-300 mb-4">
                Prácticas centradas en WordPress, con algo de Liferay y desarrollo en PHP, usando HTML, CSS y JavaScript. Participé en todo el ciclo de diseño y despliegue, tratando con clientes y priorizando accesibilidad y rendimiento.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="border border-white/20 rounded-full px-3 py-1 text-xs font-mono">WordPress</span>
                <span className="border border-white/20 rounded-full px-3 py-1 text-xs font-mono">PHP</span>
                <span className="border border-white/20 rounded-full px-3 py-1 text-xs font-mono">Liferay</span>
                <span className="border border-white/20 rounded-full px-3 py-1 text-xs font-mono">SEO</span>
              </div>
            </div>

            {/* Item: Educación */}
            <div className="group">
              <span className="font-mono text-acid text-sm mb-2 block">EDUCACIÓN</span>
              <h3 className="text-4xl font-serif italic mb-4">Grado en Ingeniería Informática</h3>
              <h4 className="text-2xl font-sans text-gray-300 mb-4">Universidad Europea del Atlántico <span className="text-lg text-gray-500 ml-2">(Sep 2022 - Jun 2026)</span></h4>
              <p className="text-xl font-sans font-light leading-relaxed text-gray-300 mb-4">
                Programa integral de informática, con formación en distintas áreas del desarrollo y la tecnología.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="border border-white/20 rounded-full px-3 py-1 text-xs font-mono">Desarrollo Web</span>
                <span className="border border-white/20 rounded-full px-3 py-1 text-xs font-mono">Ingeniería del Software</span>
                <span className="border border-white/20 rounded-full px-3 py-1 text-xs font-mono">Seguridad</span>
              </div>
            </div>

            {/* Item: Certificación */}
            <div className="group">
              <span className="font-mono text-acid text-sm mb-2 block">CERTIFICACIÓN</span>
              <h3 className="text-4xl font-serif italic mb-4">B2 First (FCE)</h3>
              <h4 className="text-2xl font-sans text-gray-300 mb-4">Cambridge Assessment English <span className="text-lg text-gray-500 ml-2">(2021)</span></h4>
              <p className="text-xl font-sans font-light leading-relaxed text-gray-300 mb-4">
                Certificación oficial B2 (FCE).
              </p>
            </div>
          </div>
        </section>



        {/* Footer / Contact (RE-DISEÑADO) */}
        <section id="contact" className="section-alt min-h-[80vh] flex flex-col justify-between px-6 md:px-20 pt-32 pb-10 bg-paper text-ink mt-20 relative overflow-hidden">
          {/* Abstract decoration */}
          <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-black to-transparent opacity-20"></div>

          <div className="grow flex flex-col justify-center items-center text-center contact-content">

            {/* Intro Text */}
            <div className="max-w-xl section-header fade-in">
              <span className="font-mono text-sm tracking-widest text-black/50 mb-4 block section-label" data-i18n="contact.label">CONTACTO</span>
              <h2 className="text-6xl md:text-8xl font-sans font-bold leading-none mb-6 section-title" data-i18n="contact.title">
                Cone<span className="font-serif italic">cte</span>mos
              </h2>
              <p className="font-sans text-xl leading-relaxed text-black/70 section-description" data-i18n="contact.description">
                ¿Tienes algo en mente? Ponte en contacto conmigo.
              </p>
            </div>

            {/* Links (Jerarquía Equilibrada) */}
            <div className="flex justify-center gap-[14px] mt-8 flex-wrap fade-in" id="main-contact-links">
              <a
                href="mailto:alvarolostal04@gmail.com"
                className="hoverable flex items-center justify-center w-12 h-12 bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-full text-[#1d1d1f] dark:text-[#f5f5f7] text-xl border border-[#d2d2d7] dark:border-[#424245] transition-all duration-300
                  hover:bg-gold hover:text-black hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(213,189,55,0.3)] hover:border-gold"
                title="Email"
                data-contact="email"
              >
                <i className="fas fa-envelope"></i>
              </a>

              <a
                href="https://github.com/lostal"
                target="_blank"
                rel="noopener noreferrer"
                className="hoverable flex items-center justify-center w-12 h-12 bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-full text-[#1d1d1f] dark:text-[#f5f5f7] text-xl border border-[#d2d2d7] dark:border-[#424245] transition-all duration-300
                  hover:bg-gold hover:text-black hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(213,189,55,0.3)] hover:border-gold"
                title="GitHub"
                data-contact="github"
              >
                <i className="fab fa-github"></i>
              </a>

              <a
                href="https://linkedin.com/in/alvarolostal"
                target="_blank"
                rel="noopener noreferrer"
                className="hoverable flex items-center justify-center w-12 h-12 bg-[#f5f5f7] dark:bg-[#1d1d1f] rounded-full text-[#1d1d1f] dark:text-[#f5f5f7] text-xl border border-[#d2d2d7] dark:border-[#424245] transition-all duration-300
                  hover:bg-gold hover:text-black hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(213,189,55,0.3)] hover:border-gold"
                title="LinkedIn"
                data-contact="linkedin"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>

          </div>

          {/* Footer (al final de la sección) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-end border-t border-black/10 pt-10 mt-20">
            <div className="font-mono text-sm">
              {/* Links removed as requested */}
            </div>

            <div className="font-serif italic text-2xl text-center md:text-left">
              &quot;Buscar la belleza de lo simple<br />y distinguir lo simple de la simpleza.&quot;
            </div>

            <div className="text-right font-mono text-xs">
              © 2025 Álvaro Lostal.<br />
              Hecho con ❤️ en Santander, España.
            </div>
          </div>
        </section>
      </main>
      <FloatingContact />
    </>
  );
}
