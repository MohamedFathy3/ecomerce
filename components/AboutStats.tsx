"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, ShoppingCart, Globe } from "lucide-react";
import { useState, useEffect } from "react";

const stats = [
  {
    value: 15,
    color: "text-[#e30a02]",
    icon: <Briefcase className="w-8 h-8 text-white " />,
  },
  {
    value: 700,
    color: "text-[#e30a02]",
    icon: <Users className="w-8 h-8 text-white " />,
  },
  {
    value: 5000,
    color: "text-[#e30a02]",
    icon: <ShoppingCart className="w-8 h-8 text-white " />,
  },
  {
    value: 3000,
    color: "text-[#e30a02]",
    icon: <Globe className="w-8 h-8 text-white " />,
  },
];

const AboutStats = () => {
  const [count, setCount] = useState(0); // This will track the current number

  // Function to animate the number increase
  const animateCounter = (finalValue: number) => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev < finalValue) {
          return prev + Math.ceil(finalValue / 100); // Increase by a small fraction
        }
        clearInterval(interval); // Stop once we reach the final value
        return finalValue; // Ensure the number doesn't exceed the target
      });
    }, 50); // The interval speed (change it to adjust how fast the numbers increase)
  };

  useEffect(() => {
    stats.forEach(stat => {
      animateCounter(stat.value); // Start the animation for each stat
    });
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
            {/* The number counter */}
            <h3 className={`text-2xl font-bold ${stat.color}`}>
              {count} {/* This will display the dynamically increasing number */}
            </h3>
          
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default AboutStats;
