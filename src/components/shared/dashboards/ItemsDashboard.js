import ItemDashboard from "./ItemDashboard";

const ItemsDashboard = ({ item }) => {
  const { title, items } = item;
  return (
    <div className="">
      <h5
        className="text-size-12 leading-1 font-semibold uppercase text-[#808080] dark:text-contentColor-dark dark:bg-whiteColor-dark px-6 
      py-1 tracking-half"
      >
        {title}
      </h5>
      <ul className="w-full ">
        {items?.map((item1, idx) => (
          <ItemDashboard key={idx} item={item1} />
        ))}
      </ul>
    </div>
  );
};

export default ItemsDashboard;
