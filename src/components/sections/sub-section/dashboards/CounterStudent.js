import counter1 from "@/assets/images/counter/books.png";
import counter2 from "@/assets/images/counter/Live.png";
import counter3 from "@/assets/images/counter/Student.png";
import CounterDashboard from "@/components/shared/dashboards/CounterDashboard";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

const CounterStudent = () => {
  const counts = [
    {
      name: "Enrolled Courses",
      image: counter1,
      data: 2,
      // symbol: "+",
    },
    {
      name: "Live Courses",
      image: counter2,
      data: 1,
      // symbol: "+",
    },
    {
      name: "Self-paced Courses",
      image: counter3,
      data: 1,
    },
  ];
  return (
    <CounterDashboard counts={counts}>
      {/* <HeadingDashboard></HeadingDashboard> */}
    </CounterDashboard>
  );
};

export default CounterStudent;
