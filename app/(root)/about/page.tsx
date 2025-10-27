import AboutStats from "@/components/AboutStats";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const About = () => {
  return (
    <div className="wrapper mt-8 space-y-16">
      <AboutStats /> {/* هنا نقوم باستدعاء المكون الجديد */}
      <Separator />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-right">
          <h2 className="text-3xl font-bold text-[#c00201]">من نحن</h2>
          <p className="text-muted-foreground leading-loose text-lg">
            نعتني بصحتك... لأنك تستحق الأفضل
            <br />
            نحرص على تقديم خدمات دوائية وصحية موثوقة، مدعومة بخبرة فريقنا من
            الصيادلة المؤهلين الذين يعملون بكل تفاني لتوفير الرعاية التي
            تستحقها.
          </p>
          <ul className="list-disc pr-5 space-y-2 text-muted-foreground text-base">
            <li>صرف الأدوية بوصفة طبية وبدون وصفة</li>
            <li>استشارات صيدلانية مجانية</li>
            <li>قياس الضغط والسكر</li>
            <li>توفير مستلزمات الأطفال والعناية الشخصية</li>
            <li>عروض خاصة على الفيتامينات والمكملات الغذائية</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/vectors/about.svg"
            alt="medicine illustration"
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
