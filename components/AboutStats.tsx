// components/AboutStats.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, ShoppingCart, Globe } from "lucide-react";

const stats = [
  {
    label: "إجمالي المبيعات السنوية",
    value: "15+",
    color: "text-[#e30a02]",
    icon: <Briefcase className="w-8 h-8 text-white " />,
  },
  {
    label: "العملاء النشطون على موقعنا",
    value: "700+",
    color: "text-[#e30a02]",
    icon: <Users className="w-8 h-8 text-white " />,
  },
  {
    label: "مبيعات المنتجات الشهرية",
    value: "5000+",
    color: "text-[#e30a02]",
    icon: <ShoppingCart className="w-8 h-8 text-white " />,
  },
  {
    label: "الزائرون النشطون على موقعنا",
    value: "3000+",
    color: "text-[#e30a02]",
    icon: <Globe className="w-8 h-8 text-white " />,
  },
];

const AboutStats = () => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {stats.map((stat, idx) => (
        <Card
          key={idx}
          className="bg-muted/20 p-6 shadow-primary/10 shadow-sm flex flex-col items-center hover:shadow-md transition-shadow border-0"
        >
          <div className="mb-4 rounded-full bg-[#e30a02] p-3">{stat.icon}</div>
          <CardContent className="p-0">
            {/* هنا نضيف الحركة للأرقام */}
            <motion.h3
              className={`text-2xl font-bold ${stat.color}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 * idx, duration: 0.8 }}
            >
              {stat.value}
            </motion.h3>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              {stat.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default AboutStats;
