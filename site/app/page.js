import { CursorDrivenParticleTypography } from "@/components/CursorDrivenParticleTypography";
import { TextMorph } from "@/components/TextMorph";
import { SupernovaSwarm } from "@/components/SupernovaSwarm";
import ScrambledText from "@/components/ScrambledText";

const basePath = process.env.NODE_ENV === "production" ? "/gesture-data-viz-app" : "";

export default function Home() {
  return (
    <main className="relative h-dvh overflow-hidden bg-[#03050c] text-[#eaf0fa]">
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

      <h1 className="sr-only">Experience Data in Motion.</h1>

      <nav
        className="fade-in-up absolute bottom-4 right-4 z-20 sm:bottom-6 sm:right-6"
        style={{ animationDelay: "3.3s" }}
      >
        <a href={`${basePath}/app/index.html`} className="btn">
          Try it now
        </a>
      </nav>

      <div className="relative grid h-full min-h-0 grid-cols-1 grid-rows-3 sm:grid-cols-2 sm:grid-rows-2">
        {/* Divider lines — draw themselves in on entrance instead of appearing instantly */}
        <div
          className="line-grow-y pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-0.5 -translate-x-1/2 bg-yellow-400 sm:block"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="line-grow-x pointer-events-none absolute left-0 top-1/3 z-10 h-0.5 w-full bg-yellow-400 sm:top-1/2 sm:w-1/2"
          style={{ animationDelay: "0.15s" }}
        />
        <div
          className="line-grow-x pointer-events-none absolute left-0 top-2/3 z-10 h-0.5 w-full bg-yellow-400 sm:hidden"
          style={{ animationDelay: "0.3s" }}
        />

        {/* Image */}
        <div className="relative flex min-h-0 flex-col items-center justify-center gap-2 overflow-hidden bg-black p-3 sm:gap-3 sm:p-8">
          <div className="h-full max-h-[130px] w-full sm:max-h-[210px]" aria-hidden="true">
            <CursorDrivenParticleTypography
              text="Experience"
              fontSize={110}
              fontFamily="Inter, sans-serif"
              particleSize={1.2}
              particleDensity={3}
              dispersionStrength={14}
              returnSpeed={0.08}
              entranceScatter={50}
              color="#ffffff"
              className="min-h-0"
            />
          </div>
        </div>

        {/* Particles + DATA / IN MOTION, overlaid in one shared block */}
        <div className="relative min-h-0 touch-none overflow-hidden bg-black sm:col-start-2 sm:row-start-1 sm:row-span-2">
          <SupernovaSwarm className="absolute inset-0 h-full w-full" />
          <div
            className="fade-in-up pointer-events-none absolute inset-0 flex items-center justify-center p-3 sm:p-8"
            style={{ color: "#ffffff", animationDelay: "1.3s" }}
          >
            <TextMorph
              words={["DATA", "IN MOTION"]}
              className="text-6xl font-bold drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] sm:text-8xl"
            />
          </div>
        </div>

        {/* Text: description */}
        <div className="relative flex min-h-0 flex-col items-center justify-center gap-2 overflow-hidden bg-black p-3 text-center sm:p-6">
          <ScrambledText
            radius={100}
            duration={1.2}
            speed={0.5}
            scrambleChars=".:"
            className="fade-in-up max-w-lg text-sm text-white sm:text-xl"
            style={{ animationDelay: "2.3s" }}
          >
            Bring your data to life as an interactive particle visualization.
            Present it with hand gestures and navigate your presentation
            without touching a mouse or clicker.
          </ScrambledText>
        </div>
      </div>
    </main>
  );
}
