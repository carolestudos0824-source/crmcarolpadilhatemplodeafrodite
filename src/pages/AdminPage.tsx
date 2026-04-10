import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminSidebar, { type AdminSection } from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminSubscriptions from "@/components/admin/AdminSubscriptions";
import AdminGiftCodes from "@/components/admin/AdminGiftCodes";
import AdminModules from "@/components/admin/AdminModules";
import AdminArcanos from "@/components/admin/AdminArcanos";
import AdminQuizzes from "@/components/admin/AdminQuizzes";
import AdminChallenges from "@/components/admin/AdminChallenges";
import AdminAccess from "@/components/admin/AdminAccess";
import AdminUsage from "@/components/admin/AdminUsage";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminSupport from "@/components/admin/AdminSupport";
import AdminSettings from "@/components/admin/AdminSettings";

const sectionComponents: Record<AdminSection, React.ComponentType> = {
  overview: AdminOverview,
  users: AdminUsers,
  subscriptions: AdminSubscriptions,
  "gift-codes": AdminGiftCodes,
  modules: AdminModules,
  arcanos: AdminArcanos,
  quizzes: AdminQuizzes,
  challenges: AdminChallenges,
  access: AdminAccess,
  usage: AdminUsage,
  analytics: AdminAnalytics,
  support: AdminSupport,
  settings: AdminSettings,
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

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
