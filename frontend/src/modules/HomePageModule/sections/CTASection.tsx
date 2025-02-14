"use client";
import { useRouter } from 'next/navigation';

const CTASection = () => {
  const router = useRouter();

  return (
    <section className="bg-[#6DC9B8] py-16 px-6 text-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 flex flex-col gap-3">
          <h2 className="text-3xl font-bold">Get Started Today</h2>
          <p>
            Ready to revolutionize your HR management? Streamline processes, enhance employee engagement, and gain full workforce insights with Mantavin.
          </p>
          <button 
            className="px-6 py-3 border border-white text-white rounded-lg mt-2"
            onClick={() => router.push('/login')}
          >
            Log in
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
