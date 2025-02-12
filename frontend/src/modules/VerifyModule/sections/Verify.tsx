import Image from "next/image";
import Link from "next/link";
import VerifyForm from "./VerifyForm";

const VerifyPage = () => {
  return (
    <div className="min-h-screen bg-[#F0FFFA] flex flex-col items-center px-6 py-12">
      <section className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-left">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 tracking-wider mb-3">
                <Image src="/logo.svg" alt="Mantavin Logo" width={25} height={32} />
                MANTAVIN
            </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Check your applicant’s proof of work
          </h1>
          <p className="text-gray-600 mt-4">
            Lorem ipsum dolor sit amet consectetur. Lobortis fermentum dis nam vestibulum nisl.
          </p>
        </div>
        <VerifyForm />
      </section>
    </div>
  );
};

export default VerifyPage;
