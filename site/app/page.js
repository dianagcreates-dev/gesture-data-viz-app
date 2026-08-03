import { CursorDrivenParticleTypography } from "@/components/CursorDrivenParticleTypography";

const FEATURES = [
  {
    title: "Gesture control",
    desc: "Point to rotate, open your palm to zoom, make a fist to reset, peace sign for the next slide, thumbs up for the last one. No mouse, no clicker.",
  },
  {
    title: "Four 3D chart styles",
    desc: "Nebula, Galaxy, Starlight, and Neural — particle-based 3D visualizations that turn a plain table of numbers into something worth looking at.",
  },
  {
    title: "Built for presenting",
    desc: "Multi-slide decks, custom titles, legends, callouts, and backgrounds — including a mesh-gradient editor for a background that's actually yours.",
  },
  {
    title: "Runs in your browser",
    desc: "No install, no account, no upload. Hand tracking happens locally on your device — your webcam feed never leaves your computer.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03050c] text-[#eaf0fa]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 55% at 18% 20%, rgba(38,240,200,0.25) 0%, transparent 70%)," +
            "radial-gradient(55% 55% at 82% 15%, rgba(90,169,255,0.22) 0%, transparent 70%)," +
            "radial-gradient(60% 60% at 50% 90%, rgba(255,93,138,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pt-28 pb-20 text-center sm:pt-36">
        <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-medium tracking-wide text-[#7e8fb0]">
          Free · Browser-based · No account needed
        </span>

        <h1 className="sr-only">Experience Data in Motion.</h1>
        <div className="mt-7 h-[160px] w-full sm:h-[240px]" aria-hidden="true">
          <CursorDrivenParticleTypography
            text="Experience Data in Motion."
            fontSize={125}
            fontFamily="Inter, sans-serif"
            particleSize={1.4}
            particleDensity={3}
            dispersionStrength={18}
            returnSpeed={0.08}
            color="#5ad1c4"
            className="min-h-0"
          />
        </div>

        <p className="mt-6 max-w-2xl text-lg text-[#9fb0cf] sm:text-xl">
          A gesture-controlled 3D data visualization tool. Turn a table of
          numbers into an interactive scene, then rotate, zoom, and step
          through it using nothing but your webcam and your hand.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="app/"
            className="rounded-full bg-[#5ad1c4] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-[#062019] transition hover:brightness-95"
          >
            Launch the app
          </a>
          <span className="text-sm text-[#7e8fb0]">
            Works best in Chrome or Edge, with a webcam
          </span>
        </div>
      </div>

      <section className="relative mx-auto max-w-5xl px-6 pb-28">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
            >
              <h3 className="text-base font-semibold text-[#eaf0fa]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8b9bbd]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative border-t border-white/10 px-6 py-8 text-center text-xs text-[#54648a]">
        Built with Three.js and MediaPipe Hands.
      </footer>
    </main>
  );
}
