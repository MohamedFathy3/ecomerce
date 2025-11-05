import AboutStats from "@/components/AboutStats";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ServerTranslate } from '@/components/ServerTranslate';

const About = () => {
  return (
    <div className="wrapper mt-8 space-y-16">
      <AboutStats />
      <Separator />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-[#c00201]">
            <ServerTranslate textKey="about.title" />
          </h1>
          <p className="text-muted-foreground leading-loose text-lg">
            <ServerTranslate textKey="about.subtitle" />
          </p>
          
          <h2 className="text-2xl font-bold text-[#c00201]">
            <ServerTranslate textKey="about.mission.title" />
          </h2>
          <p className="text-muted-foreground leading-loose text-lg">
            <ServerTranslate textKey="about.mission.content" />
          </p>

          <h2 className="text-2xl font-bold text-[#c00201]">
            <ServerTranslate textKey="about.process.title" />
          </h2>
          <p className="text-muted-foreground leading-loose text-lg">
            <ServerTranslate textKey="about.process.content" />
          </p>

          <h2 className="text-2xl font-bold text-[#c00201]">
            <ServerTranslate textKey="about.quality.title" />
          </h2>
          <p className="text-muted-foreground leading-loose text-lg">
            <ServerTranslate textKey="about.quality.content" />
          </p>

          <h2 className="text-2xl font-bold text-[#c00201]">
            <ServerTranslate textKey="about.collaboration.title" />
          </h2>
          <p className="text-muted-foreground leading-loose text-lg">
            <ServerTranslate textKey="about.collaboration.content" />
          </p>

          <p className="text-muted-foreground leading-loose text-lg font-semibold">
            <ServerTranslate textKey="about.closing" />
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/vectors/about.svg"
            alt="E-commerce illustration"
            width={320}
            height={320}
            className="rounded-xl object-contain"
          />
        </div>
      </section>
    </div>
  );
};

export default About;