import React from "react";

const CancellationPolicy = () => {
  return (
    <div className="flex flex-col items-center px-4 py-12 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-[#7ECA9D] mb-8 text-center ">
          Cancellation & Refund Policy
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Refund Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We appreciate your purchase of our courses and aim to provide you with
              a rewarding learning experience, whether it&#39;s through
              instructor-led training or self-paced learning. However, we understand
              that circumstances may arise where you may require a refund. Please
              review our Refund Policy along with our Privacy Policy and Terms of
              Use, which govern your purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Self-Paced Learning: Refund Eligibility
            </h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
              <li>
                Submit your refund request within 7 days of purchasing the course at{" "}
                <a
                  href="mailto:care@medh.co"
                  className="text-[#7ECA9D] hover:text-[#5DB382] transition-colors duration-200"
                >
                  care@medh.co
                </a>{" "}
                or at "My Orders" Section.
              </li>
              <li>
                Have consumed less than 25% of the video-learning content and have
                not requested any exam voucher or kit.
              </li>
              <li>
                Any refund request that does not meet these requirements will not be
                accepted, and no refund will be provided.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Instructor-Led Training: Refund Qualifications
            </h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
              <li>
                Submit your refund request within 7 days of purchasing the course at{" "}
                <a
                  href="mailto:care@medh.co"
                  className="text-[#7ECA9D] hover:text-[#5DB382] transition-colors duration-200"
                >
                  care@medh.co
                </a>{" "}
                or at "My Orders" Section.
              </li>
              <li>
                Have not attended more than two (2) live online classes and have not
                requested any exam voucher or kit.
              </li>
              <li>
                Refund requests that do not meet all of these requirements will not
                be accepted, and no refund will be provided.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              University Partnered Programs
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To be eligible for a refund, you must submit your refund request
              within 7 days from the start date of the regular class (Live or
              Recorded, as applicable), whether attended or not at{" "}
              <a
                href="mailto:care@medh.co"
                className="text-[#7ECA9D] hover:text-[#5DB382] transition-colors duration-200"
              >
                care@medh.co
              </a>{" "}
              or at "My Orders" Section. Refund requests failing to meet this
              requirement will not be accepted, and no refund will be provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Class Rescheduling
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              For instructor-led training and University Partnered programs, we
              reserve the right to reschedule or cancel a class/session due to
              unavoidable circumstances. In such cases, we will reschedule any
              cancelled class/session.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Cancellation & Refunds
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We may reschedule or cancel a class/session due to unavoidable
              circumstances, or change the location of a class (if applicable). To
              be eligible for a refund, you must:
            </p>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
              <li>Not have attended any classes.</li>
              <li>
                Submit your refund request within 7 days of purchasing the course.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Refund Request Methods
            </h2>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
              <li>
                From the "My Orders" section, click on "Initiate Refund" for the
                relevant course. This option applies when the item purchase quantity
                is one.
              </li>
              <li>
                If the item purchase quantity is more than one, please reach out to
                our support team at{" "}
                <a
                  href="mailto:support@medh.co"
                  className="text-[#7ECA9D] hover:text-[#5DB382] transition-colors duration-200"
                >
                  support@medh.co
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Duplicate Payment Refunds
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Refunds for duplicate payments will be processed via the same source
              (original method of payment) within 10 working days after you have
              submitted your request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Policy Modification
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to revise this policy without prior notice.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
