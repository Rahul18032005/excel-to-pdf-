
import React from 'react';

const features = [
  {
    title: "AI Vision Analysis",
    description: "Uses Gemini 3 Flash Vision to scan documents and identify complex table borders, merged cells, and multi-line headers with superhuman accuracy.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: "SheetJS Processing",
    description: "Binary spreadsheet generation happens entirely in your browser using SheetJS, ensuring your data never leaves the temporary processing context.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Contextual Extraction",
    description: "Unlike static scripts, our AI understands the context of the data, correctly categorizing currency, dates, and nested hierarchies into Excel columns.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Secure Privacy",
    description: "We don't store your documents. Conversions are processed in a stateless session and deleted immediately after the download link is generated.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  }
];

const FeatureGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, idx) => (
        <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 group">
          <div className="w-12 h-12 bg-[#f1f5f3] text-[#2d4a3e] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#2d4a3e] group-hover:text-white transition-colors">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureGrid;
