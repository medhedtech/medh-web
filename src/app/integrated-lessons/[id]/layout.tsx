// import lessons from "../../../public/fakedata/lessons.json";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id: paramId } = await params;
  const { id } = lessons?.find(({ id }) => id == paramId) || { id: 1 };
  return {
    title: `Lesson ${id == 1 ? "" : id < 10 ? "0" + id : id} | Medh - Education LMS Template`,
    description: `Lesson ${id == 1 ? "" : "0" + id} | Medh - Education LMS Template`,
  };
}

export default function LessonLayout({ children }) {
  return children;
} 