import { ShimmeringText } from "@anvilkit/ui/components/animate-ui/primitives/texts/shimmering";
import { Marquee } from "@anvilkit/ui/marquee";

const DEVICON_BASE_URL =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

interface LogoCloudItem {
  label: string;
  name: string;
  variant: string;
}

const logoCloudItems = [
  {
    label: "React",
    name: "react",
    variant: "original",
  },
  {
    label: "Tailwind CSS",
    name: "tailwindcss",
    variant: "original",
  },
  {
    label: "Docker",
    name: "docker",
    variant: "original",
  },
  {
    label: "Node.js",
    name: "nodejs",
    variant: "original",
  },
  {
    label: "Amazon Web Services",
    name: "amazonwebservices",
    variant: "plain-wordmark",
  },
  {
    label: "Vue.js",
    name: "vuejs",
    variant: "original",
  },
  {
    label: "Firebase",
    name: "firebase",
    variant: "original",
  },
  {
    label: "GraphQL",
    name: "graphql",
    variant: "plain",
  },
] satisfies readonly LogoCloudItem[];

function getDeviconSource(name: string, variant: string) {
  // Devicon's documented <img> format is /icons/<name>/<name>-<variant>.svg.
  return `${DEVICON_BASE_URL}/${name}/${name}-${variant}.svg`;
}

export interface LogoCloudsProps {
  title: string;
  subtitle: string;
}

export interface LogoCloudsViewProps extends LogoCloudsProps {
  editMode?: boolean;
}

export function LogoClouds({ title, subtitle }: LogoCloudsViewProps) {
  return (
    <section className="anvilkit-logo-clouds__theme mx-auto flex w-full max-w-6xl flex-col items-center overflow-hidden px-4 py-16 text-center text-foreground sm:px-6 sm:py-20 lg:px-8 lg:py-24 [&>:first-child]:mx-auto [&>:first-child]:max-w-3xl [&>:first-child]:text-[clamp(3rem,9vw,4.75rem)] [&>:first-child]:leading-none [&>:first-child]:font-black [&>:first-child]:tracking-[-0.07em] [&>:nth-child(3)]:mt-8 sm:[&>:nth-child(3)]:mt-12 lg:[&>:nth-child(3)]:mt-16">
      <ShimmeringText
        aria-level={2}
        role="heading"
        className="text-4xl font-semibold"
        text={title}
      />

      <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
        {subtitle}
      </p>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee aria-label="Brand logos" className="mt-8">
          {logoCloudItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-center px-4 py-4 sm:px-6 lg:px-8"
            >
              <div className="flex h-20 w-full items-center justify-center px-6">
                <img
                  alt={`${item.label} logo`}
                  className="h-10 w-auto max-w-[11.5rem] object-contain sm:h-11 sm:max-w-[13rem] lg:h-14 lg:max-w-[14.5rem]"
                  decoding="async"
                  loading="lazy"
                  src={getDeviconSource(item.name, item.variant)}
                />
              </div>
            </div>
          ))}
        </Marquee>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent"
        />
      </div>
    </section>
  );
}
