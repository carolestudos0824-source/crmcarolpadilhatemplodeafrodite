import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminSidebar, { type AdminSection } from "@/components/admin/AdminSidebar";
import AdminModules from "@/components/admin/AdminModules";
import AdminLessons from "@/components/admin/AdminLessons";
import AdminArcanos from "@/components/admin/AdminArcanos";
import AdminQuizzes from "@/components/admin/AdminQuizzes";
import AdminReviews from "@/components/admin/AdminReviews";
import AdminChallenges from "@/components/admin/AdminChallenges";
import AdminExtras from "@/components/admin/AdminExtras";
import AdminAccess from "@/components/admin/AdminAccess";
import AdminStudents from "@/components/admin/AdminStudents";
import AdminAnalytics from "@/components/admin/AdminAnalytics";

const sectionComponents: Record<AdminSection, React.ComponentType> = {
  modules: AdminModules,
  lessons: AdminLessons,
  arcanos: AdminArcanos,
  quizzes: AdminQuizzes,
  reviews: AdminReviews,
  challenges: AdminChallenges,
  extras: AdminExtras,
  access: AdminAccess,
  students: AdminStudents,
  analytics: AdminAnalytics,
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>("modules");

  const ActiveComponent = sectionComponents[activeSection];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/30 sticky top-0 z-20">
        <div className="px-6 py-3 flex items-center gap-4">
          <button onClick={() => navigate("/app")} className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-lg text-foreground tracking-wider">Painel Administrativo</h1>
        </div>
      </header>

      <div className="flex">
        <AdminSidebar active={activeSection} onChange={setActiveSection} />
        <main className="flex-1 p-8 max-w-4xl">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
