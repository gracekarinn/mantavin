const FAQSection = () => {
    const faqs = [
      { question: "Nanya apa gitu", answer: "Jawab apa gitu ye kayak lorem ipsum atau gimana gitu" },
      { question: "Nanya apa gitu", answer: "Jawab apa gitu ye kayak lorem ipsum atau gimana gitu" },
      { question: "Nanya apa gitu", answer: "Jawab apa gitu ye kayak lorem ipsum atau gimana gitu" },
      { question: "Nanya apa gitu", answer: "Jawab apa gitu ye kayak lorem ipsum atau gimana gitu" },
    ];
  
    return (
      <section className="bg-[#F0FFFA] py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold text-teal-500">FAQ</h2>
            <p className="mt-2 text-gray-700">
              Yap alert Lorem ipsum dolor sit amet consectetur. Lobortis fermentum dis nam vestibulum nisl.
            </p>
            <button className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg">
              Reach out
            </button>
          </div>
          <div>
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-lg">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default FAQSection;
  