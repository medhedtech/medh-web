import Link from "next/link";

const BlogArchive = () => {
  const posts = [
    {
      id: 1,
      date: "23 December 2024",
    },
    {
      id: 2,
      date: "23 December 2024",
    },
    {
      id: 3,
      date: "23 December 2024",
    },
    {
      id: 4,
      date: "23 December 2024",
    },
  ];

  return (
    <div className="p-5 md:p-8 lg:p-5 2xl:p-8 mb-8 border ">
      <h4 className="text-lg text-[#252525] border-dashed border-l-2  dark:text-blackColor-dark font-bold pl-2 mb-6">
        Archive
      </h4>
      <ul className="flex flex-col gap-y-6">
        {posts.map(({ date, id }) => (
          <li className="flex items-center" key={id}>
              <div className=" px-3 relative">
              <span className=" h-2 w-2  rounded-[50%]  bg-[#F2277E] absolute left-0 ">
              </span>
            </div>
            <div className="w-3/5 mt-1">
              <Link
                href={`blogs/${id}`}
                className="w-full text-sm text-contentColor font-medium dark:text-contentColor-dark hover:text-primaryColor"
              >
                {date}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogArchive;
