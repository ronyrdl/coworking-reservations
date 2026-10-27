
export default function HomePage() {
  return (
    <section className="bg-[#F4F1E8] text-[#243D35] mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-20 lg:px-8">
      <div className="max-w-3xl">
        <span className="inline-flex rounded-full bg-[#A7B69A]/30 px-4 py-2 text-sm font-semibold text-[#243D35]">
          Tu espacio, tu productividad
        </span>

        <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-[#243D35] md:text-7xl">
          Encuentra tu espacio.
          <span className="text-[#A7B69A]">
            {" "}Enfócate en lo importante.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-[#243D35]/70">
          Descubre espacios de trabajo diseñados para concentrarte,
          colaborar y llevar tus ideas más lejos.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <a
            href="/espacios"
            className="rounded-full bg-[#243D35] px-8 py-4 font-semibold text-white transition hover:bg-[#36594D]"
          >
            Explorar espacios
          </a>

          <a
            href="/register"
            className="rounded-full border border-[#243D35]/20 px-8 py-4 font-semibold text-[#243D35] transition hover:bg-[#A7B69A]/20"
          >
            Crear una cuenta
          </a>
        </div>
      </div>
    </section>
  );
}
