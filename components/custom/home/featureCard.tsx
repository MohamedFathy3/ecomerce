import { Headset, Package, ShieldCheck, TruckElectric } from "lucide-react";
import React from "react";

const features = [
  {
    icon: Headset,
    title: "دعم العملاء طوال أيام الأسبوع",
    description: "الوصول الفوري إلى الدعم",
  },
  {
    icon: TruckElectric,
    title: "شحن مجاني",
    description: "شحن مجاني على جميع طلباتك",
  },
  {
    icon: ShieldCheck,
    title: "دفع آمن 100%",
    description: "نحن نضمن أن أموالك في أمان",
  },
  {
    icon: Package,
    title: "ضمان استرداد الأموال",
    description: "ضمان استرداد الأموال لمدة 30 يومًا",
  },
];

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType;
  title: string;
  description: string;
}) => {
  return (
    <div className="feature-card">
      <div className="text-primary">
        <Icon />
      </div>
      <div className="flex flex-col">
        <p className="feature-title">{title}</p>
        <p className="feature-subtitle">{description}</p>
      </div>
    </div>
  );
};

const FeatureCards = () => {
  return (
    <section>
      <div className="wrapper">
        <div className="bg-background dark:!bg-slate-800 dark:shadow-slate-600/30 !shadow-lg p-8 !rounded-md translate-y-[-20%] sm:translate-y-[-50%] grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon, title, description }, index) => (
            <FeatureCard
              key={index}
              icon={icon}
              title={title}
              description={description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
