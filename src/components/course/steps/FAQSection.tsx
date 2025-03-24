import React from 'react';
import { UseFormRegister, UseFormSetValue, FormState } from 'react-hook-form';
import { ICourseFormData } from '@/types/course.types';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface FAQSectionProps {
  register: UseFormRegister<ICourseFormData>;
  setValue: UseFormSetValue<ICourseFormData>;
  formState: {
    errors: FormState<ICourseFormData>['errors'];
  };
  watch: any;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const FAQ_CATEGORIES = [
  'Course Content',
  'Prerequisites',
  'Technical Requirements',
  'Pricing & Payment',
  'Certification',
  'Support',
  'Other'
];

const FAQSection: React.FC<FAQSectionProps> = ({
  register,
  setValue,
  formState: { errors },
  watch
}) => {
  const [faqs, setFaqs] = React.useState<FAQ[]>([
    {
      question: '',
      answer: '',
      category: ''
    }
  ]);

  // Update form data whenever FAQs change
  React.useEffect(() => {
    setValue('faqs', faqs);
  }, [faqs, setValue]);

  const addFAQ = () => {
    setFaqs([
      ...faqs,
      {
        question: '',
        answer: '',
        category: ''
      }
    ]);
  };

  const removeFAQ = (index: number) => {
    const updatedFAQs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFAQs);
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    const updatedFAQs = [...faqs];
    updatedFAQs[index] = {
      ...updatedFAQs[index],
      [field]: value
    };
    setFaqs(updatedFAQs);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add common questions and answers to help potential students understand your course better.
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={faq.category}
                      onChange={(e) => updateFAQ(index, 'category', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                    >
                      <option value="">Select category</option>
                      {FAQ_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.faqs?.[index]?.category && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.faqs[index].category?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Question</label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                      placeholder="e.g., What are the prerequisites for this course?"
                    />
                    {errors.faqs?.[index]?.question && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.faqs[index].question?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Answer</label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-customGreen focus:ring-customGreen"
                      placeholder="Provide a clear and concise answer..."
                    />
                    {errors.faqs?.[index]?.answer && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.faqs[index].answer?.message}
                      </p>
                    )}
                  </div>
                </div>

                {faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFAQ(index)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    <MinusCircle size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addFAQ}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-customGreen bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customGreen"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add FAQ
      </button>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900">FAQ Guidelines</h3>
        <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
          <li>Keep questions clear and specific</li>
          <li>Provide comprehensive yet concise answers</li>
          <li>Group related questions under appropriate categories</li>
          <li>Address common concerns about course requirements, content, and outcomes</li>
          <li>Include technical requirements and support information</li>
        </ul>
      </div>
    </div>
  );
};

export default FAQSection; 