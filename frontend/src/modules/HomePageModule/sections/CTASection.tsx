const CTASection = () => {
    return (
      <section className="bg-[#6DC9B8] py-16 px-6 text-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold">CTA Section</h2>
            <p className="mt-2">
              Yap alert Lorem ipsum dolor sit amet consectetur. Lobortis fermentum dis nam vestibulum nisl.
            </p>
            <button className="mt-4 px-4 py-2 border border-white text-white rounded-lg">
              Log in
            </button>
          </div>
          <div className="w-full md:w-1/2 mt-6 md:mt-0 flex justify-center">
            <div className="bg-white rounded-lg p-8 text-gray-600 text-lg shadow-md">
              mungkin reach out form
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default CTASection;
  