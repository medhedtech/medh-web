import counter from "@/assets/images/counter/icons_badge.svg";
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
      image: counter,
      data: 100,
      symbol: "+",
    },
    {
      name: "Active Students",
      image: counter2,
      data: 50,
      symbol: "+",
    },
    {
      name: "Total Instructors ",
      image: counter3,
      data: 50,
      symbol: "+",
    },
    {
      name: "Total Courses",
      image: counter4,
      data: 150,
      symbol: "+",
    },
    {
      name: "Cooporate Employee",
      image: counter5,
      data: 30,
      symbol: "",
    },
    {
      name: "School/Institute",
      image: counter6,
      data: 10,
      symbol: "",
    },
  ];
  return (
    <CounterDashboard counts={counts}>
      <HeadingDashboard>Dashboard</HeadingDashboard>
    </CounterDashboard>
  );
};

export default CounterAdmin;
