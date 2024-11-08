import counter1 from "@/assets/images/counter/card-1.png";
import counter2 from "@/assets/images/counter/card-1.png";
import counter3 from "@/assets/images/counter/card-2.png";
import counter4 from "@/assets/images/counter/card-3.png";
import counter5 from "@/assets/images/counter/card-4.png";
import counter6 from "@/assets/images/counter/card-5.png";
import CounterDashboard from "@/components/shared/dashboards/CounterDashboard";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
const CounterAdmin = () => {
  const counts = [
    {
      name: "Enrolled Courses",
      image: counter1,
      data: 900,
      symbol: "+",
    },
    {
      name: "Active Students",
      image: counter2,
      data: 500,
      symbol: "+",
    },
    {
      name: "Total Instructors ",
      image: counter3,
      data: 300,
      symbol: "k",
    },
    {
      name: "Total Courses",
      image: counter4,
      data: 1500,
      symbol: "+",
    },
    {
      name: "Cooporate Employee",
      image: counter5,
      data: 30,
      symbol: "k",
    },
    {
      name: "School/Institute",
      image: counter6,
      data: 90,
      symbol: ",000k+",
    },
  ];
  return (
    <CounterDashboard counts={counts}>
      <HeadingDashboard>Dashboard</HeadingDashboard>
    </CounterDashboard>
  );
};

export default CounterAdmin;
