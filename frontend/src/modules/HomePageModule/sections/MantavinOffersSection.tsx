const MantavinOffersSection = () => {
    const features = [
      { title: "Fitur 1", description: "Deskripsi fitur 1 Yappingan TKH" },
      { title: "Fitur 2", description: "Deskripsi fitur 2 Yappingan TKH" },
      { title: "Fitur 3", description: "Deskripsi fitur 3 Yappingan TKH" },
      { title: "Fitur 4", description: "Deskripsi fitur 4 Yappingan TKH" },
      { title: "Fitur 5", description: "Deskripsi fitur 5 Yappingan TKH" },
      { title: "Fitur 6", description: "Deskripsi fitur 6 Yappingan TKH" },
    ];
  
    return (
      <section className="bg-[#F0FFFA] py-16 text-center">
        <h2 className="text-3xl font-bold text-teal-500">What Mantavin offers</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-teal-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center"
            >
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="mt-2 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default MantavinOffersSection;
  