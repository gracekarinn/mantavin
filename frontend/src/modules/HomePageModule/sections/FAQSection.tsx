const FAQSection = () => {
  const faqs = [
    { question: "How does Mantavin help HR teams?", answer: "Mantavin automates HR processes, from verifying employee credentials to tracking training and performance, making workforce management seamless." },
    { question: "Is my data secure with Mantavin?", answer: "Absolutely! We use top-tier encryption and blockchain technology to ensure your HR data remains secure and accessible only to authorized personnel." },
    { question: "Can I integrate Mantavin with my existing tools?", answer: "Yes! Mantavin seamlessly integrates with popular HR and management software, ensuring a smooth transition for your team." },
    { question: "How do I get started?", answer: "Simply sign up for a free demo or contact our team. We'll help you set up Mantavin and transform your HR operations effortlessly!" },
  ];

  return (
    <section className="bg-[#F0FFFA] py-16 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-bold text-teal-500">FAQ</h2>
          <p className="mt-2 text-gray-700">
            Have questions? We've got answers! Discover how Mantavin can revolutionize your HR workflow and simplify management.
          </p>
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
  