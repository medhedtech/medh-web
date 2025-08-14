import React from "react";

const DataSubjectRightsPolicy = () => {
  return (
    <div className="flex flex-col items-center px-4 py-8 bg-gray-100 dark:bg-screen-dark">
      <div className="max-w-4xl w-ful bg">
        <h1 className="text-4xl font-bold text-[#7ECA9D] mb-8 text-center">
          Data Subject Rights Information
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Data Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At MEDH, we respect and uphold your rights regarding your personal data. As per the General Data Protection Regulation (GDPR), you have several important rights that we are committed to honoring.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Right to Access
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You have the right to request a copy of the personal data we hold about you. This includes information about what data we process, why we process it, who we share it with, and how long we intend to store it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Right to Rectification
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you believe that any personal information we hold about you is incorrect or incomplete, you have the right to ask us to correct or update it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Right to Erasure (Right to be Forgotten)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              In certain circumstances, you can request that we delete your personal data. This applies when:
            </p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
              <li>The data is no longer necessary for the purpose it was collected</li>
              <li>You withdraw consent and there is no other legal ground for processing</li>
              <li>You object to the processing and there are no legitimate grounds for continuing</li>
              <li>The data was unlawfully processed</li>
              <li>The data must be erased to comply with a legal obligation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Right to Restrict Processing
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You can request that we temporarily or permanently stop processing some or all of your personal data if:
            </p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
              <li>You contest the accuracy of your personal data</li>
              <li>Our processing is unlawful but you don't want us to erase the data</li>
              <li>You need us to retain data to establish, exercise, or defend legal claims</li>
              <li>You've objected to processing but we need to verify whether we have overriding legitimate grounds</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Right to Data Portability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You have the right to request your personal data in a structured, commonly used, and machine-readable format. You can also ask us to transfer this data directly to another organization where technically feasible.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Right to Object
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You can object to our processing of your personal data:
            </p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
              <li>For direct marketing purposes</li>
              <li>For scientific/historical research or statistical purposes</li>
              <li>When processing is based on our legitimate interests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Rights Related to Automated Decision Making and Profiling
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You have the right not to be subject to decisions based solely on automated processing (including profiling) that produce legal or similarly significant effects, except in certain circumstances permitted by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How to Exercise Your Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              If you wish to exercise any of these rights, please contact us using one of the following methods:
            </p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:privacy@medh.co"
                  className="text-[#7ECA9D] hover:text-[#5DB382] transition-colors duration-200"
                >
                  privacy@medh.co
                </a>
              </li>
              <li>
                <strong>Online Form:</strong> Available in your account dashboard under "Privacy Settings"
              </li>
              <li>
                <strong>Postal Mail:</strong> MEDH Data Protection Officer, [Company Address]
              </li>
            </ul>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">When contacting us, please:</h4>
              <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Clearly state which right(s) you wish to exercise</li>
                <li>Provide sufficient information for us to verify your identity</li>
                <li>Include any details that will help us respond to your request</li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Response Timeline
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We will respond to your request within <strong>07 (seven) days</strong> of receipt. If we need additional time due to the complexity of your request, we'll inform you within the initial 07 days and explain why an extension is necessary.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Fee Required
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You won't be charged a fee to access your personal data or exercise any of your other rights. However, we may charge a reasonable fee if your request is clearly unfounded, repetitive, or excessive.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Right to Complain
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you are not satisfied with our response or believe we are not processing your personal data in accordance with the law, you have the right to lodge a complaint with the relevant supervisory authority in your country of residence.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Policy Updates
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This Data Subject Rights Information was last updated on July 27, 2025. We reserve the right to revise this policy without prior notice.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DataSubjectRightsPolicy;
