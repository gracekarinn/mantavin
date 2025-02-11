const DemoSection = () => {
    return (
      <section className="bg-[#6DC9B8] py-16 text-white">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold">Demo Section</h2>
            <p className="mt-4">
              Yap alert Lorem ipsum dolor sit amet consectetur. Lobortis
              fermentum dis nam vestibulum nisl.
            </p>
          </div>
          <div className="w-full md:w-1/2 mt-6 md:mt-0 flex justify-center">
            <div className="bg-white rounded-lg p-8 text-gray-600 text-lg shadow-md">
              either video <br />
              atau illustration <br />
              atau bs juga <br />
              bikin gif gt si
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default DemoSection;
  