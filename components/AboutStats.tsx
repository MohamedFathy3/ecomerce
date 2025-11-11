"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, ShoppingCart, Globe } from "lucide-react";
import { useState, useEffect } from "react";

const stats = [
  {
    value: 15,
    color: "text-[#e30a02]",
    icon: <Briefcase className="w-8 h-8 text-white" />,
  },
  {
    value: 700,
    color: "text-[#e30a02]",
    icon: <Users className="w-8 h-8 text-white" />,
  },
  {
    value: 300,
    color: "text-[#e30a02]",
    icon: <ShoppingCart className="w-8 h-8 text-white" />,
  },
  {
    value: 3000,
    color: "text-[#e30a02]",
    icon: <Globe className="w-8 h-8 text-white" />,
  },
];

const AboutStats = () => {
  const [counts, setCounts] = useState(stats.map(() => 0));

  // Function to animate the number increase for each stat
  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const interval = setInterval(() => {
        setCounts(prev => {
          const newCounts = [...prev];
          if (newCounts[index] < stat.value) {
            newCounts[index] += Math.ceil(stat.value / 50); // Increase by a small fraction
          } else {
            clearInterval(interval); // Stop once we reach the final value
            newCounts[index] = stat.value; // Ensure the number doesn't exceed the target
          }
          return newCounts;
        });
      }, 30); // The interval speed
    });
  };

  useEffect(() => {
    animateCounters();
  }, []); // Run this only once on mount

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {stats.map((stat, idx) => (
        <Card
          key={idx}
          className="bg-muted/20 p-6 shadow-primary/10 shadow-sm flex flex-col items-center hover:shadow-md transition-shadow border-0"
        >
          <div className="mb-4 rounded-full bg-[#e30a02] p-3">{stat.icon}</div>
          <CardContent className="p-0">
            {/* The number counter for each stat */}
            <h3 className={`text-2xl font-bold ${stat.color}`}>
              {counts[idx]} {/* This will display the dynamically increasing number for each stat */}
            </h3>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default AboutStats;