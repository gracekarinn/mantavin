import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center pt-16 pb-0 bg-[#F0FFFA] overflow-hidden">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 tracking-wider">
        <Image src="/logo.svg" alt="Mantavin Logo" width={25} height={32} />
        MANTAVIN
      </h2>
      <h1 className="text-5xl font-bold text-gray-900 mt-2">
        The HR Department’s Best Friend
      </h1>
      <p className="text-gray-600 mt-4 max-w-2xl">
        Lorem ipsum dolor sit amet consectetur. Lobortis fermentum dis nam
        vestibulum nisl.
      </p>
      <div className="mt-6 space-x-4">
        <button className="px-6 py-2 border border-teal-600 text-teal-600 rounded-lg">
          Log in
        </button>
        <button className="px-6 py-2 bg-teal-500 text-white rounded-lg">
          Get started
        </button>
      </div>
      <div className="relative w-full max-w-4xl mt-12 flex justify-center items-center ">
        <Image
          src="/detail.svg"
          alt="Decorative Detail"
          width={800}
          height={400}
          className="w-full h-auto z-0 right-0 transform translate-x-[10%]"
        />
        <Image
          src="/detail.svg"
          alt="Second Decorative Detail"
          width={700}
          height={350}
          className="w-full h-auto absolute top-10 left-0 transform -translate-x-[10%] z-10"
        />
      </div>
    </section>
  );
};

export default HeroSection;
