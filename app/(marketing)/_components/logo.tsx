import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function Logo() {
  return (
    <div className="hidden md:flex items-center gap-x-1">
      <Image
        src="/logo.svg"
        height="50"
        width="50"
        alt="Logo"
        className="dark:hidden"
      />
      <Image
        src="/logo-darkmode.svg"
        height="50"
        width="50"
        alt="Logo"
        className="dark:block hidden"
      />
      <p className={cn("font-semibold", font.className)}>Write</p>
    </div>
  );
}
