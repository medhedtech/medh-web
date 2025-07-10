import { redirect } from 'next/navigation';
import { notFound } from "next/navigation";
// import lessons from "@/../public/fakedata/lessons.json";

export async function generateMetadata({ params }) {
  const { id } = lessons?.find(({ id }) => id == params.id) || { id: 1 };
  return {
    title: `Lesson ${
      id == 1 ? "" : id < 10 ? "0" + id : id
    } | Medh - Education LMS Template`,
    description: `Lesson ${
      id == 1 ? "" : "0" + id
    } | Medh - Education LMS Template`,
  };
}

const Lesson = ({ params }) => {
  const { id } = params;
  const isExistLesson = lessons?.find(({ id: id1 }) => id1 === parseInt(id));
  
  if (!isExistLesson) {
    notFound();
  }
  
  // Redirect to the new integrated lessons page
  redirect(`/integrated-lessons/${id}`);
};

export default Lesson;
