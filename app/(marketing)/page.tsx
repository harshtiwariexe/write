import Footer from "./_components/footer";
import Heading from "./_components/Heading";
import Main from "./_components/main";

export default function MarketingPage() {
  return (
    <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
      <div className="flex flex-col items-center justify-center md:justify-start gap-y-8 text-center flex-1 px-6 pb-10">
        <Heading />
        <Main />
      </div>
      <Footer />
    </div>
  );
}
