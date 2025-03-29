import lessons from "@/../public/fakedata/lessons.json";

export async function generateMetadata({ params }) {
  const { id } = lessons?.find(({ id }) => id == params.id) || { id: 1 };
  return {
    title: `Lesson ${id == 1 ? "" : id < 10 ? "0" + id : id} | Medh - Education LMS Template`,
    description: `Lesson ${id == 1 ? "" : "0" + id} | Medh - Education LMS Template`,
  };
}

export async function generateStaticParams() {
  return lessons?.map(({ id }) => ({ id: id.toString() }));
}

export default function LessonLayout({ children }) {
  return children;
} 