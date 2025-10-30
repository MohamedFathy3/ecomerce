import AboutStats from "@/components/AboutStats";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const About = () => {
  return (
    <div className="wrapper mt-8 space-y-16">
      <AboutStats /> {/* Calling the stats component */}
      <Separator />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#c00201]">About Us</h2>
          <p className="text-muted-foreground leading-loose text-lg">
            Your Trusted E-Commerce Partner... Because You Deserve the Best
            <br />
            We are committed to delivering exceptional online shopping experiences, 
            backed by our team of dedicated professionals who work tirelessly to 
            provide the service you deserve.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-base">
            <li>Wide range of quality products at competitive prices</li>
            <li>Fast and reliable shipping nationwide</li>
            <li>Secure payment options and easy returns</li>
            <li>24/7 customer support and personalized assistance</li>
            <li>Exclusive deals and seasonal promotions</li>
            <li>User-friendly shopping experience across all devices</li>
          </ul>
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

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex justify-center order-2 md:order-1">
          <Image
            src="/images/vectors/shopping.svg"
            alt="Online shopping experience"
            width={320}
            height={320}
            className="rounded-xl object-contain"
          />
        </div>
        <div className="space-y-4 order-1 md:order-2">
          <h2 className="text-3xl font-bold text-[#c00201]">Our Mission</h2>
          <p className="text-muted-foreground leading-loose text-lg">
            To revolutionize online shopping by providing seamless access to 
            quality products with unmatched customer service. We believe in 
            making e-commerce accessible, reliable, and enjoyable for everyone.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-[#c00201]">Fast Delivery</h4>
              <p className="text-sm text-muted-foreground">2-5 Business Days</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-[#c00201]">Secure Payments</h4>
              <p className="text-sm text-muted-foreground">100% Protected</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;