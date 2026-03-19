import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Microscope, 
  TrendingUp, 
  Landmark, 
  Church, 
  BookText, 
  Wallet, 
  Briefcase, 
  Globe, 
  Moon,
  LayoutGrid,
  Search,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAllSubjects } from '@/services/subjectService';
import type { Subject } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Calculator,
  FlaskConical,
  Microscope,
  BookOpen,
  TrendingUp,
  Landmark,
  Church,
  BookText,
  Wallet,
  Briefcase,
  Globe,
  Moon
};

export default function Subjects() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchSubjects = async () => {
      const data = await getAllSubjects();
      if (data.length === 0) {
        // Fallback subjects
        setSubjects([
          { id: '1', name: 'Mathematics', code: 'MAT', icon: 'Calculator', topics: 'Algebra, Calculus, Trigonometry', color: '#6366f1', order: 1 },
          { id: '2', name: 'Physics', code: 'PHY', icon: 'FlaskConical', topics: 'Mechanics, Electricity, Waves', color: '#8b5cf6', order: 2 },
          { id: '3', name: 'Chemistry', code: 'CHE', icon: 'Microscope', topics: 'Organic, Inorganic, Physical', color: '#ec4899', order: 3 },
          { id: '4', name: 'Biology', code: 'BIO', icon: 'BookOpen', topics: 'Botany, Zoology, Genetics', color: '#10b981', order: 4 },
          { id: '5', name: 'Economics', code: 'ECO', icon: 'TrendingUp', topics: 'Micro & Macroeconomics', color: '#f59e0b', order: 5 },
          { id: '6', name: 'Government', code: 'GOV', icon: 'Landmark', topics: 'Political Systems', color: '#3b82f6', order: 6 },
          { id: '7', name: 'CRS', code: 'CRS', icon: 'Church', topics: 'Christian Religious Studies', color: '#ef4444', order: 7 },
          { id: '8', name: 'Literature', code: 'LIT', icon: 'BookText', topics: 'Poetry, Drama, Prose', color: '#14b8a6', order: 8 },
          { id: '9', name: 'Accounting', code: 'ACC', icon: 'Wallet', topics: 'Financial Accounting', color: '#f97316', order: 9 },
          { id: '10', name: 'Business Mgt', code: 'BUS', icon: 'Briefcase', topics: 'Business Organization', color: '#06b6d4', order: 10 },
          { id: '11', name: 'Geography', code: 'GEO', icon: 'Globe', topics: 'Physical & Human Geography', color: '#84cc16', order: 11 },
          { id: '12', name: 'IRS', code: 'IRS', icon: 'Moon', topics: 'Islamic Religious Studies', color: '#6366f1', order: 12 },
        ]);
      } else {
        setSubjects(data);
      }
      setLoading(false);
    };
    fetchSubjects();
  }, [isAuthenticated, navigate]);

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.topics.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#2d3748]" style={{ backgroundColor: '#111827' }}>
        <div className="flex items-center gap-4 p-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-[#1a2235] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#9ca3af]" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#6366f1] to-[#818cf8]">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-white">IJMB</span>
              <span className="text-[#6366f1]">PRO</span>
            </span>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Browse by <span className="gradient-text">Subject</span>
          </h1>
          <p className="text-[#9ca3af]">Select a subject to view past questions</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1a2235] border border-[#2d3748] text-white placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all"
            />
          </div>
        </div>

        {/* Subjects Grid - Responsive: 2 cols mobile, 3 tablet, 4 desktop */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-dark p-6">
                <div className="skeleton w-12 h-12 rounded-xl mb-4" />
                <div className="skeleton h-6 w-24 mb-2 rounded" />
                <div className="skeleton h-4 w-full rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSubjects.map((subject) => {
              const Icon = iconMap[subject.icon] || BookOpen;
              return (
                <a 
                  key={subject.id} 
                  href={`/questions?subject=${encodeURIComponent(subject.name)}`}
                  className="card-dark p-5 group"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors" 
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: subject.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#6366f1] transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-[#6b7280] text-sm line-clamp-2">{subject.topics}</p>
                  <div className="mt-3 flex items-center gap-1 text-[#6366f1] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Questions</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {!loading && filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-[#2d3748]" />
            <h3 className="text-xl text-white mb-2">No subjects found</h3>
            <p className="text-[#6b7280]">Try a different search term</p>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-[#2d3748]" style={{ backgroundColor: '#111827' }}>
        <div className="flex justify-around p-2">
          <a href="/dashboard" className="flex flex-col items-center gap-1 p-2 text-[#9ca3af]">
            <LayoutGrid className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </a>
          <a href="/subjects" className="flex flex-col items-center gap-1 p-2 text-[#818cf8]">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Subjects</span>
          </a>
          <a href="/questions" className="flex flex-col items-center gap-1 p-2 text-[#9ca3af]">
            <Search className="w-5 h-5" />
            <span className="text-xs">Study</span>
          </a>
          <a href="/exams" className="flex flex-col items-center gap-1 p-2 text-[#9ca3af]">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Exam</span>
          </a>
        </div>
      </nav>

      <div className="lg:hidden h-20" />
    </div>
  );
}
