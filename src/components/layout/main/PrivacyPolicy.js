import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col items-center px-4 py-12 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-[#7ECA9D] mb-8 text-center">
          Privacy Policy
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At MEDH ("we," "us," or "our"), we are committed to safeguarding your privacy and protecting your personal data. This Privacy Policy outlines how we collect, use, share, and secure the personal information you provide when using our website (medh.co) and associated mobile applications (collectively, "Services").
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              By accessing and using our Services, you acknowledge that you have read and understood this Privacy Policy and agree to be bound by its terms, alongside our Terms and Conditions.
            </p>
          </section>

          {/* Definitions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Definitions
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              For the purposes of this Privacy Policy:
            </p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
              <li>
                <strong>"Personal Information"</strong> refers to any information that identifies or can be used to identify an individual, directly or indirectly.
              </li>
              <li>
                <strong>"Sensitive Personal Data or Information"</strong> refers to personal information as defined under applicable privacy laws, including but not limited to financial information, passwords, and biometric data.
              </li>
              <li>
                <strong>"Services"</strong> refers to our website (medh.co) and associated mobile applications mentioned on the website.
              </li>
              <li>
                <strong>"Client"</strong> refers to an entity or individual who creates accounts on behalf of End-Users.
              </li>
              <li>
                <strong>"End-User"</strong> refers to individuals whose information is provided to us by a Client.
              </li>
            </ul>
          </section>

          {/* Scope */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Scope of This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This Privacy Policy applies to all personal information collected through our Services. If you do not agree with the terms of this Privacy Policy, please refrain from using our Services.
            </p>
          </section>

          {/* Notice to End Users */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Notice to End Users
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              In certain cases, an administrator may create an account on behalf of an "End-User" and provide their personal information to us. In such instances, the administrator, who may be the End-User's employer or an Authorized Training Partner (ATP), acts as our "Client." We collect and process information under the direction of our Clients and have no direct relationship with the End-User whose personal data we process.
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              International Data Transfers
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may store and process your personal data in your region and in other countries where we or our data sub-processors operate facilities. By using our Services, you consent to the transfer of your data to such locations, including data centers in the United States, India, United Kingdom, and Singapore. We implement appropriate safeguards to ensure that your data remains protected in accordance with this Privacy Policy, regardless of location.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Information We Collect
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Personal Identifiable Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We may collect the following personal information from you:
            </p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
              <li>
                When you visit our website or mobile apps and voluntarily provide contact information, business information, and account details during a purchase or registration process.
              </li>
              <li>
                When you use our Learning Management System, mobile applications, or support system, we may collect contact information and unique identifiers.
              </li>
            </ul>
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-600 rounded-lg p-4 mt-4">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> All payment transactions are processed through secure payment gateway providers. We do not store any card information (other than the last 4 digits of your card) on our servers.
              </p>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How We Use Your Information?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We may utilize the personal information collected from various sources, including the website, chatbox, mobile applications, email, or when you use our Service(s), for the following purposes:
            </p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Providing you with the Service(s) you have requested</li>
              <li>Sending you communications related to the Service(s)</li>
              <li>Assessing the needs of your business to suggest suitable products</li>
              <li>Sending you requested product or service information</li>
              <li>Responding to customer service requests</li>
              <li>Administering your account</li>
              <li>Sending you promotional and marketing communications</li>
              <li>Facilitating your transactions with other users when using our Service(s)</li>
              <li>Performing statistical analyses of user behavior and characteristics at an aggregate level to measure interest in and usage of different areas of the site</li>
            </ul>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-600 rounded-lg p-4 mt-4">
              <p className="text-yellow-800 dark:text-yellow-200">
                By agreeing to this Privacy Policy, you give explicit permission for communication related to our services, including information regarding content, courseware, products, inquiries, and services through various channels such as phone, email, and chat. Even if you are registered under "Do Not Disturb" or similar services, you authorize us to contact you for the aforementioned purposes.
              </p>
            </div>
          </section>

          {/* Data Retention Period */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Data Retention Period
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              MEDH retains personal data only for as long as necessary to fulfill the purposes for which it was collected, including for satisfying any legal, accounting, or reporting requirements. Different categories of data may be kept for different periods based on legal requirements, industry standards, and business needs.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Retention Periods by Data Category
            </h3>
            
            <div className="space-y-6">
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-[#7ECA9D] mb-3">Student Academic and Financial Records</h4>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Active Period:</strong> Throughout the student's enrollment and active engagement with courses</li>
                  <li><strong>Post-Completion Period:</strong> 8 years from course completion or last interaction for financial records (as required by accounting regulations)</li>
                  <li><strong>Academic Records:</strong> Permanent records of course completion and certifications are maintained indefinitely</li>
                  <li><strong>Placement Records:</strong> Records related to job placement are maintained for 3 years after the 180-day guarantee period ends</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-[#7ECA9D] mb-3">Marketing Communications Data</h4>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Prospects:</strong> 2 years from last interaction</li>
                  <li><strong>Newsletter Subscribers:</strong> Until subscription withdrawal</li>
                  <li><strong>Removed upon request:</strong> Data will be removed within 30 days of receiving a valid erasure request</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-[#7ECA9D] mb-3">Website Usage and Analytics Data</h4>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Cookie Data:</strong> As specified in Cookie Policy, typically 12 months</li>
                  <li><strong>Anonymized Analytics:</strong> May be retained indefinitely once properly anonymized</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
              Legal Basis for Retention
            </h3>
            
            <div className="space-y-6">
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-[#7ECA9D] mb-3">GDPR Compliance (For EEA Residents)</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  In accordance with Articles 5(1)(e) and 13(2)(a) of the GDPR:
                </p>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Personal data is stored in a form that permits identification of data subjects for no longer than necessary for the purposes for which the data was collected</li>
                  <li>Specific retention periods are transparent and communicated to data subjects</li>
                  <li>Data subjects have the right to:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Access their personal data (Article 15)</li>
                      <li>Request erasure ("right to be forgotten") when retention is no longer necessary (Article 17)</li>
                      <li>Object to processing based on legitimate interests (Article 21)</li>
                      <li>Data portability (Article 20)</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-[#7ECA9D] mb-3">IT Act 2000 and Indian Data Protection Compliance</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  In accordance with the IT Act 2000 and its amendments (particularly the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011):
                </p>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Personal data is retained only as long as necessary for the purposes for which it was collected</li>
                  <li>Sensitive personal data is subject to enhanced security measures during its retention</li>
                  <li>Data subjects have the right to:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Access their personal information</li>
                      <li>Correct inaccurate or deficient data</li>
                      <li>Withdraw consent for continued processing</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
              Retention Period Determination Criteria
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Retention periods are determined based on:
            </p>
            <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Legal Requirements:</strong> Statutory obligations for record-keeping</li>
              <li><strong>Contractual Obligations:</strong> Duration of service agreements plus applicable limitation periods</li>
              <li><strong>Business Needs:</strong> Time required to resolve disputes or complete transaction-related activities</li>
              <li><strong>Individual Expectations:</strong> How long individuals would reasonably expect MEDH to retain their data</li>
              <li><strong>Risk Assessment:</strong> Balance between retention needs and potential risks to data subject rights</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
              Data Deletion and Anonymization
            </h3>
            
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h4 className="font-semibold text-[#7ECA9D] mb-3">Deletion Procedures</h4>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                <li>At the end of the retention period, personal data is securely deleted or anonymized</li>
                <li>Secure deletion methods include digital shredding and physical destruction of media</li>
                <li>Deletion certificates are maintained where required by law</li>
              </ul>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-[#7ECA9D] mb-3">Exceptions to Standard Retention</h4>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Legal holds for litigation or investigation purposes</li>
                <li>Archiving in the public interest, scientific or historical research purposes</li>
                <li>Statistical purposes with appropriate safeguards (anonymization)</li>
              </ul>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-[#7ECA9D] mb-3">Review of Retention Periods</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                MEDH reviews and updates retention periods annually to ensure continued compliance with:
              </p>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Changes in applicable laws and regulations</li>
                <li>Evolving industry best practices</li>
                <li>Organizational needs and technological capabilities</li>
              </ul>
            </div>

            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-[#7ECA9D] mb-3">Individual Rights Regarding Retention</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Individuals may request:
              </p>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Information about retention periods applicable to their data</li>
                <li>Early deletion of their data (subject to legal requirements)</li>
                <li>Extension of retention in specific circumstances</li>
                <li>Data portability to another service provider</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Rights
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Rights to Access, Correction, and Deletion
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              You have certain rights regarding your Personal Information:
            </p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Right to Access:</strong> You can request access to your Personal Information to confirm its accuracy.</li>
              <li><strong>Right to Correction:</strong> You can request updates or corrections to your Personal Information.</li>
              <li><strong>Right to Deletion:</strong> You can request the deletion of your Personal Information, subject to certain legal exemptions.</li>
              <li><strong>Right to Withdraw Consent:</strong> If your Personal Information is processed based on your consent, you have the right to withdraw that consent by submitting a written request to our Grievance Officer.</li>
            </ul>
            <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-600 rounded-lg p-4 mt-4">
              <p className="text-orange-800 dark:text-orange-200">
                Please note that certain exemptions may apply to such requests based on legal and regulatory purposes or obligations.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access. These measures include:
            </p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication procedures</li>
              <li>Staff training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-600 rounded-lg p-4 mt-4">
              <p className="text-red-800 dark:text-red-200">
                While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. Therefore, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Changes to This Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will post the revised policy on our website and update the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              If you have any questions, concerns, or complaints regarding this Privacy Policy or our data practices, please contact our Grievance Officer at:
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                  <a 
                    href="mailto:care@medh.co" 
                    className="text-[#7ECA9D] hover:text-[#5DB382] transition-colors duration-200"
                  >
                    care@medh.co
                  </a>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Postal Address</h3>
                  <div className="text-gray-700 dark:text-gray-300">
                    <p>eSampark Tech Solutions Private Limited</p>
                    <p className="font-medium text-[#7ECA9D]">MEDH – LEARN. UPSKILL. ELEVATE</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-8">
            <p className="text-center text-gray-600 dark:text-gray-300 font-medium">
              Last Updated: August 26, 2025
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
