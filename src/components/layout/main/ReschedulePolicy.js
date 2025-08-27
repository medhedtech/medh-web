import React from "react";

const ReschedulePolicy = () => {
  return (
    <div className="flex flex-col items-center px-4 py-12 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-[#7ECA9D] mb-8 text-center">
          Reschedule Policy
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <section className="mb-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At medh.co, we understand that life can be unpredictable and
              circumstances may arise that necessitate rescheduling your course or
              program. We strive to provide flexibility and convenience to our
              learners, and our reschedule policy is designed to accommodate your
              needs while ensuring a smooth learning experience. Please take a
              moment to familiarize yourself with our reschedule policy outlined
              below:
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Reschedule Requests
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Learners are eligible to request a reschedule of their enrolled course
              or program. Reschedule requests must be submitted in writing through
              our official communication channels, such as email or the designated
              reschedule request form on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Deadline for Reschedule Requests
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Reschedule requests must be submitted at least 07 days before the
              scheduled start date of the course or program. This allows us
              sufficient time to process your request and make necessary
              arrangements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Reschedule Processing
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our team will review your reschedule request and endeavor to respond
              within 03 business days. Approval of reschedule requests is subject to
              availability in the desired course or program.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Reschedule Fees
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If the reschedule request is made within the specified deadline and
              availability is confirmed, there will be no reschedule fee. Reschedule
              requests made after the deadline may be subject to a reschedule fee.
              The reschedule fee will be communicated to you at the time of your
              request.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Course/Program Transfer
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              In some cases, instead of rescheduling, learners may have the option
              to transfer to a different course or program within medh.co subject to
              availability and specific transfer policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Multiple Reschedule Requests
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Learners are allowed to submit a reschedule request once within a
              defined period. Additional reschedule requests beyond this limit may
              be subject to further evaluation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Exceptions
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              In rare cases of extenuating circumstances, such as medical
              emergencies or unforeseen personal events, we will do our best to
              accommodate your situation. Please reach out to our support team to
              discuss your specific circumstances.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Refund Policy for Reschedule Requests
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Reschedule requests, when approved, do not automatically qualify for a
              refund. For specific refund eligibility, please refer to our refund
              policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Modification of Reschedule Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              At medh.co the company reserves the right to modify the reschedule
              policy at any time. Any changes to the policy will be updated on our
              website.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              For any reschedule-related queries or to initiate a reschedule
              request, please contact our support team at{" "}
              <a
                href="mailto:care@medh.co"
                className="text-[#7ECA9D] hover:text-[#5DB382] transition-colors duration-200"
              >
                care@medh.co
              </a>
              . We are here to assist you and ensure your learning journey is as
              seamless as possible.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReschedulePolicy;
