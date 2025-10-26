import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen m-auto">
      <Image
        src="/images/logos/Logo.svg"
        alt={`${APP_NAME} logo`}
        height={48}
        width={48}
        priority
      />
      <div className="p-8 w-1/3 rounded-xl shadow-sm flex flex-col items-center space-y-2">
        <h1 className="text-2xl font-bold">Not Found</h1>
        <p className="text-destructive">
          The page you are looking for does not exist.
        </p>
        <Button asChild variant={"outline"}>
          <Link href="/">Back Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
