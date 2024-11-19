import React from "react";

const CancellationPolicy = () => {
  return (
    <div className="flex flex-col px-40 py-8 bg-gray-100 dark:bg-screen-dark">
      <h1 className="text-2xl font-bold text-[#7ECA9D] mb-6">
        Cancellation & Refund Policy
      </h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-[#252525] mb-2">
          Refund Policy
        </h2>
        <p className="text-gray-600">
          We appreciate your purchase of our courses and aim to provide you with
          a rewarding learning experience, whether it's through instructor-led
          training or self-paced learning. However, we understand that
          circumstances may arise where you may require a refund. Please review
          our Refund Policy along with our Privacy Policy and Terms of Use,
          which govern your purchase.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-[#252525] mb-2">
          Self-Paced Learning: To be eligible for a refund, you must
        </h3>
        <ul className="list-disc list-inside text-gray-600">
          <li>
            Submit your refund request within 7 days of purchasing the course at{" "}
            <span className="font-medium text-gray-800">care@medh.co</span> or
            at "My Orders" Section.
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

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-[#252525] mb-2">
          Instructor-Led Training: To qualify for a refund, you must
        </h3>
        <ul className="list-disc list-inside text-gray-600">
          <li>
            Submit your refund request within 7 days of purchasing the course at{" "}
            <span className="font-medium text-gray-800">care@medh.co</span> or
            at "My Orders" Section.
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

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-[#252525] mb-2">
          University Partnered Programs
        </h3>
        <p className="text-gray-600">
          To be eligible for a refund, you must submit your refund request
          within 7 days from the start date of the regular class (Live or
          Recorded, as applicable), whether attended or not at{" "}
          <span className="font-medium text-gray-800">care@medh.co</span> or at
          "My Orders" Section. Refund requests failing to meet this requirement
          will not be accepted, and no refund will be provided.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-[#252525] mb-2">
          For instructor-led training and University Partnered programs
        </h3>
        <p className="text-gray-600">
          We reserve the right to reschedule or cancel a class/session due to
          unavoidable circumstances. In such cases, we will reschedule any
          cancelled class/session.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-[#252525] mb-2">
          Cancellation & Refunds
        </h2>
        <p className="text-gray-600">
          We may reschedule or cancel a class/session due to unavoidable
          circumstances, or change the location of a class (if applicable). To
          be eligible for a refund, you must:
        </p>
        <ul className="list-disc list-inside text-gray-600">
          <li>Not have attended any classes.</li>
          <li>
            Submit your refund request within 7 days of purchasing the course.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-[#252525] mb-2">
          You can initiate a refund request in two ways
        </h3>
        <ul className="list-disc list-inside text-gray-600">
          <li>
            From the "My Orders" section, click on "Initiate Refund" for the
            relevant course. This option applies when the item purchase quantity
            is one.
          </li>
          <li>
            If the item purchase quantity is more than one, please reach out to
            our support team at{" "}
            <span className="font-medium">support@medh.co</span>.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-[#252525] mb-2">
          Refunds: Duplicate Payment
        </h3>
        <p className="text-gray-600">
          Refunds for duplicate payments will be processed via the same source
          (original method of payment) within 10 working days after you have
          submitted your request.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-[#252525] mb-2">
          We reserve the right to revise this policy without prior notice.
        </h3>
      </section>
    </div>
  );
};

export default CancellationPolicy;
