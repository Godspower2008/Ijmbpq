import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Play, 
  GraduationCap, 
  LayoutGrid,
  Award,
  TrendingUp,
  Users,
  Database,
  Zap,
  LogOut,
  User,
  ChevronRight,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/firebase/config';
import { getDashboardStats } from '@/services/progressService';
import type { DashboardStats } from '@/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, userData, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      const data = await getDashboardStats(user?.uid);
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, [isAuthenticated, navigate, user?.uid]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  // Responsive: Desktop (>720px) shows sidebar + content, Mobile shows stacked
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a0e1a' }}>
      {/* Sidebar - Desktop Only (>720px) */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#2d3748]" style={{ backgroundColor: '#111827' }}>
        {/* Logo */}
        <div className="p-6 border-b border-[#2d3748]">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#6366f1] to-[#818cf8]">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-white">IJMB</span>
              <span className="text-[#6366f1]">PRO</span>
            </span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#6366f1]/20 text-[#818cf8] font-medium">
            <LayoutGrid className="w-5 h-5" />
            Dashboard
          </a>
          <a href="/subjects" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9ca3af] hover:bg-[#1a2235] hover:text-white transition-colors">
            <BookOpen className="w-5 h-5" />
            Subjects
          </a>
          <a href="/questions" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9ca3af] hover:bg-[#1a2235] hover:text-white transition-colors">
            <GraduationCap className="w-5 h-5" />
            Past Questions
          </a>
          <a href="/exams" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9ca3af] hover:bg-[#1a2235] hover:text-white transition-colors">
            <Play className="w-5 h-5" />
            Take Exam
          </a>
          <a href="/progress" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#9ca3af] hover:bg-[#1a2235] hover:text-white transition-colors">
            <BarChart3 className="w-5 h-5" />
            My Progress
          </a>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[#2d3748]">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{userData?.displayName || 'Student'}</p>
              <p className="text-[#6b7280] text-sm truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#ef4444] hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-[#2d3748]" style={{ backgroundColor: '#111827' }}>
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#6366f1] to-[#818cf8]">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">
              <span className="text-white">IJMB</span>
              <span className="text-[#6366f1]">PRO</span>
            </span>
          </a>
          <button onClick={handleLogout} className="p-2 text-[#ef4444]">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome back, {userData?.displayName?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-[#9ca3af]">Ready to smash your IJMB prep today?</p>
          </div>

          {/* Stats Grid - Responsive: 2 cols on mobile, 3 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="card-dark p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#6366f1]/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#818cf8]" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {loading ? '-' : stats?.userStats?.examsTaken || 0}
              </div>
              <div className="text-[#6b7280] text-sm">Exams Taken</div>
            </div>

            <div className="card-dark p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#10b981]/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#10b981]" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {loading ? '-' : stats?.userStats?.subjectsStudied || 0}
              </div>
              <div className="text-[#6b7280] text-sm">Subjects</div>
            </div>

            <div className="col-span-2 lg:col-span-1 card-dark p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#f59e0b]" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {loading ? '-' : `${stats?.userStats?.progress || 0}%`}
              </div>
              <div className="text-[#6b7280] text-sm">Progress</div>
            </div>
          </div>

          {/* Quick Actions - Responsive: Stack on mobile */}
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <a href="/exams" className="action-card group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#6366f1]/20 flex items-center justify-center group-hover:bg-[#6366f1]/30 transition-colors">
                    <Play className="w-6 h-6 text-[#6366f1]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Start Exam</h3>
                    <p className="text-[#6b7280] text-sm">Simulate real IJMB exams</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#6b7280] group-hover:text-[#6366f1] transition-colors" />
              </div>
            </a>

            <a href="/questions" className="action-card group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center group-hover:bg-[#10b981]/30 transition-colors">
                    <GraduationCap className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Study</h3>
                    <p className="text-[#6b7280] text-sm">Read past questions & solutions</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#6b7280] group-hover:text-[#10b981] transition-colors" />
              </div>
            </a>

            <a href="/subjects" className="action-card group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/20 flex items-center justify-center group-hover:bg-[#f59e0b]/30 transition-colors">
                    <LayoutGrid className="w-6 h-6 text-[#f59e0b]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Subjects</h3>
                    <p className="text-[#6b7280] text-sm">Browse all subjects</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#6b7280] group-hover:text-[#f59e0b] transition-colors" />
              </div>
            </a>
          </div>

          {/* Platform Stats */}
          <h2 className="text-lg font-semibold text-white mb-4">Platform Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Questions', value: stats?.totalQuestions || 0, icon: Database, color: '#6366f1' },
              { label: 'Subjects', value: stats?.totalSubjects || 12, icon: BookOpen, color: '#10b981' },
              { label: 'Active Users', value: stats?.totalUsers || 0, icon: Users, color: '#f59e0b' },
              { label: 'Exams Taken', value: stats?.totalExams || 0, icon: Zap, color: '#ec4899' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="card-dark p-4 text-center">
                  <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {loading ? '-' : stat.value}
                  </div>
                  <div className="text-[#6b7280] text-xs">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity - Desktop Only */}
          <div className="hidden lg:block mt-8">
            <h2 className="text-lg font-semibold text-white mb-4">Study Tips</h2>
            <div className="card-dark p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#6366f1]/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#818cf8]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Study Regularly</h4>
                    <p className="text-[#6b7280] text-sm">Dedicate at least 2 hours daily to IJMB prep</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Practice Past Questions</h4>
                    <p className="text-[#6b7280] text-sm">Review at least 5 questions per subject weekly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-[#f59e0b]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Track Progress</h4>
                    <p className="text-[#6b7280] text-sm">Monitor your improvement over time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-[#2d3748]" style={{ backgroundColor: '#111827' }}>
        <div className="flex justify-around p-2">
          <a href="/dashboard" className="flex flex-col items-center gap-1 p-2 text-[#818cf8]">
            <LayoutGrid className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </a>
          <a href="/subjects" className="flex flex-col items-center gap-1 p-2 text-[#9ca3af]">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Subjects</span>
          </a>
          <a href="/questions" className="flex flex-col items-center gap-1 p-2 text-[#9ca3af]">
            <GraduationCap className="w-5 h-5" />
            <span className="text-xs">Study</span>
          </a>
          <a href="/exams" className="flex flex-col items-center gap-1 p-2 text-[#9ca3af]">
            <Play className="w-5 h-5" />
            <span className="text-xs">Exam</span>
          </a>
        </div>
      </nav>

      {/* Mobile padding for bottom nav */}
      <div className="lg:hidden h-20" />
    </div>
  );
}
