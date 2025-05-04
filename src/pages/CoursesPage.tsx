
import Layout from "@/components/layout/Layout";
import CourseList from "@/components/courses/CourseList";

const CoursesPage = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Nos Cours</h1>
            <p className="text-gray-600">
              Découvrez nos formations gratuites en droit numérique, spécialement 
              adaptées au contexte congolais et dispensées par des experts du domaine.
            </p>
          </div>

          <CourseList />
        </div>
      </div>
    </Layout>
  );
};

export default CoursesPage;
