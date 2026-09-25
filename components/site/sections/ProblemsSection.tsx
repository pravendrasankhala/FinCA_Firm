import { DynamicIcon } from "@/components/DynamicIcon";
import { renderRichText } from "@/lib/rich-text";

const PROBLEMS = [
  {
    icon: "building",
    text: "Business setup stays **complicated and slow** because of too many steps, registrations and departments.",
  },
  {
    icon: "file-text",
    text: "GST and tax compliance stay **confusing** because no one explains them in simple language.",
  },
  {
    icon: "wallet",
    text: "You end up **paying more** because most consultants just file returns and don't do strategic tax planning.",
  },
  {
    icon: "handshake",
    text: "You pay multiple service providers, but no one takes **full ownership** in case things go wrong.",
  },
  {
    icon: "clock",
    text: "You're constantly in fear of **missing something or getting a notice**, despite spending lakhs.",
  },
  {
    icon: "users",
    text: "You're **stuck coordinating different experts** because no one offers end-to-end support.",
  },
];

export function ProblemsSection() {
  return (
    <section className="relative overflow-hidden bg-secondary/40 py-24 before:absolute before:inset-0 before:z-0 before:bg-[url('/problems.png')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-20 before:content-['']">
      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-navy-950 sm:text-4xl">
            7 Out Of 10 Indian Business Owners Face These
          </h2>
          <p className="mt-2 text-3xl font-bold text-gold-500 sm:text-4xl">
            Problems Even After Spending Lakhs!
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((problem, i) => (
            <div
              key={i}
              className="rounded-[4px_50px_4px_50px] border border-border bg-card  shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-[4px_50px_50px_4px] bg-[#0b111c] text-white mt-2">
                  <DynamicIcon iconName={problem.icon} className="h-10 w-10" />
                </div>
                <span
                  className="text-5xl leading-none font-bold text-transparent pr-6 mt-2"
                  style={{ WebkitTextStroke: "1.5px var(--border)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="m-8 text-[15px] leading-relaxed text-foreground/90">
                {renderRichText(problem.text)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
