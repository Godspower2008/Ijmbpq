import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Search,
  ArrowLeft,
  Filter,
  FileText,
  Calendar,
  Tag,
  Eye,
  CheckCircle,
  LayoutGrid,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAllQuestions, getAllSubjects } from '@/services';
import type { Question, Subject } from '@/types';

export default function Questions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || 'All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedPaper, setSelectedPaper] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const years = ['All', '2024', '2023', '2022', '2021', '2020'];
  const papers = ['All', 'Paper I', 'Paper II', 'Paper III'];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const [questionsData, subjectsData] = await Promise.all([
        getAllQuestions(),
        getAllSubjects()
      ]);
      
      // Fallback questions
      const fallbackQuestions: Question[] = [
        { id: '1', subject: 'Mathematics', year: 2024, paper: 'Paper I', question: 'Solve the simultaneous equations: 2x + 3y = 12, 3x - 2y = 5', answer: 'Solution: x = 3, y = 2\n\nUsing elimination method:\nMultiply eq1 by 2: 4x + 6y = 24\nMultiply eq2 by 3: 9x - 6y = 15\nAdding: 13x = 39\nx = 3\nSubstitute: 2(3) + 3y = 12\n6 + 3y = 12\ny = 2', tags: ['Algebra', 'Simultaneous Equations'] },
        { id: '2', subject: 'Mathematics', year: 2024, paper: 'Paper I', question: 'Find the derivative of f(x) = 3x³ - 2x² + 5x - 7', answer: 'f\'(x) = 9x² - 4x + 5\n\nUsing power rule: d/dx(xⁿ) = nxⁿ⁻¹\nf\'(x) = 3(3x²) - 2(2x) + 5(1) - 0\nf\'(x) = 9x² - 4x + 5', tags: ['Calculus', 'Differentiation'] },
        { id: '3', subject: 'Physics', year: 2024, paper: 'Paper I', question: 'State Newton\'s three laws of motion.', answer: 'First Law (Inertia): A body at rest remains at rest, and a body in motion continues in uniform motion unless acted upon by an external force.\n\nSecond Law: The rate of change of momentum is directly proportional to the applied force (F = ma).\n\nThird Law: For every action, there is an equal and opposite reaction.', tags: ['Mechanics', 'Newton\'s Laws'] },
        { id: '4', subject: 'Chemistry', year: 2024, paper: 'Paper I', question: 'Define hybridization and give three types with examples.', answer: 'Hybridization is the mixing of atomic orbitals of similar energies to form new hybrid orbitals.\n\n1. sp hybridization: Mixing of one s and one p orbital (e.g., C₂H₂ - acetylene)\n2. sp² hybridization: Mixing of one s and two p orbitals (e.g., C₂H₄ - ethylene)\n3. sp³ hybridization: Mixing of one s and three p orbitals (e.g., CH₄ - methane)', tags: ['Atomic Structure', 'Hybridization'] },
        { id: '5', subject: 'Biology', year: 2024, paper: 'Paper I', question: 'Describe the process of photosynthesis.', answer: 'Photosynthesis is the process by which green plants convert light energy into chemical energy.\n\nLight reaction: Occurs in thylakoid membranes. Water is split, releasing O₂. ATP and NADPH are produced.\n\nDark reaction (Calvin cycle): Occurs in stroma. CO₂ is fixed using ATP and NADPH to produce glucose.\n\nOverall: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂', tags: ['Plant Physiology', 'Photosynthesis'] },
        { id: '6', subject: 'Economics', year: 2024, paper: 'Paper I', question: 'Define elasticity of demand and explain its types.', answer: 'Elasticity of demand measures responsiveness of quantity demanded to changes in price or other factors.\n\nTypes:\n1. Price elasticity: %ΔQ/%ΔP\n2. Income elasticity: Response to income changes\n3. Cross elasticity: Response to price of related goods\n\nValues: Ed > 1 (elastic), Ed = 1 (unitary), Ed < 1 (inelastic)', tags: ['Microeconomics', 'Demand Theory'] },
        { id: '7', subject: 'Government', year: 2024, paper: 'Paper II', question: 'Discuss the impact of British colonial economic policies on Nigeria.', answer: '1. Cash crops: Focus on cocoa, palm oil, groundnuts for export\n2. Infrastructure: Railways and roads built for resource extraction\n3. Taxation: Introduction of direct taxes\n4. Forced labor: Compulsory labor for public works\n5. Trade imbalance: Dependence on imported goods\n6. Land policies: Individual ownership replacing communal system', tags: ['Colonialism', 'Nigerian History'] },
        { id: '8', subject: 'CRS', year: 2024, paper: 'Paper I', question: 'Discuss the call of Abraham and its significance.', answer: 'The Call (Genesis 12:1-3): God called Abram to leave his country for a promised land.\n\nPromises:\n- Great nation\n- Blessing\n- Great name\n- Blessing to all nations\n\nSignificance:\n- Foundation of Israel\n- Demonstration of faith\n- Covenant relationship\n- Universal salvation through Abraham\'s seed', tags: ['Old Testament', 'Patriarchs'] },
      ];
      
      const finalQuestions = questionsData.length > 0 ? questionsData : fallbackQuestions;
      setQuestions(finalQuestions);
      setFilteredQuestions(finalQuestions);
      setSubjects(subjectsData);
      setLoading(false);
    };
    
    fetchData();
  }, [isAuthenticated, navigate]);

  // Filter questions
  useEffect(() => {
    let filtered = questions;
    
    if (selectedSubject !== 'All') {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }
    if (selectedYear !== 'All') {
      filtered = filtered.filter(q => q.year.toString() === selectedYear);
    }
    if (selectedPaper !== 'All') {
      filtered = filtered.filter(q => q.paper === selectedPaper);
    }
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchLower) ||
        q.subject.toLowerCase().includes(searchLower) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredQuestions(filtered);
  }, [selectedSubject, selectedYear, selectedPaper, searchQuery, questions]);

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
            Past <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-[#9ca3af]">Browse through past IJMB questions with solutions</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1a2235] border border-[#2d3748] text-white placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-4 rounded-xl border transition-colors flex items-center gap-2 ${
                showFilters 
                  ? 'bg-[#6366f1]/20 border-[#6366f1] text-[#818cf8]' 
                  : 'bg-[#1a2235] border-[#2d3748] text-[#9ca3af] hover:border-[#6366f1]'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Filters - Collapsible */}
          {showFilters && (
            <div className="p-4 rounded-xl bg-[#1a2235] border border-[#2d3748] animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-medium">Filter Options</span>
                <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-[#232b3f] rounded">
                  <X className="w-4 h-4 text-[#6b7280]" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-2">Subject</label>
                  <select 
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0e1a] border border-[#2d3748] text-white focus:outline-none focus:border-[#6366f1]"
                  >
                    <option value="All">All Subjects</option>
                    {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-2">Year</label>
                  <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0e1a] border border-[#2d3748] text-white focus:outline-none focus:border-[#6366f1]"
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-2">Paper</label>
                  <select 
                    value={selectedPaper} 
                    onChange={(e) => setSelectedPaper(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0e1a] border border-[#2d3748] text-white focus:outline-none focus:border-[#6366f1]"
                  >
                    {papers.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedSubject('All'); setSelectedYear('All'); setSelectedPaper('All'); setSearchQuery(''); }}
                className="mt-4 text-sm text-[#6366f1] hover:text-[#818cf8]"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[#6b7280] text-sm">
            Showing {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card-dark p-6">
                <div className="skeleton h-4 w-24 rounded mb-3" />
                <div className="skeleton h-6 w-full rounded mb-2" />
                <div className="skeleton h-4 w-32 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div key={question.id} className="card-dark overflow-hidden">
                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                >
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#6366f1]/20 text-[#818cf8]">
                      {question.subject}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs bg-[#1a2235] text-[#9ca3af] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{question.year}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs bg-[#1a2235] text-[#9ca3af] flex items-center gap-1">
                      <FileText className="w-3 h-3" />{question.paper}
                    </span>
                  </div>

                  {/* Question */}
                  <h4 className="text-lg text-white mb-3">{question.question}</h4>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-xs text-[#6b7280]">
                          <Tag className="w-3 h-3" />{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6366f1]">
                      <Eye className="w-4 h-4" />
                      {expandedQuestion === question.id ? 'Hide' : 'View'}
                    </div>
                  </div>
                </div>

                {/* Answer */}
                {expandedQuestion === question.id && (
                  <div className="px-5 pb-5 border-t border-[#2d3748] animate-fadeIn">
                    <div className="pt-4">
                      <h5 className="text-sm font-semibold text-[#10b981] mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />Solution
                      </h5>
                      <div className="p-4 rounded-xl bg-[#0a0e1a] text-[#9ca3af] whitespace-pre-line leading-relaxed">
                        {question.answer}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-[#2d3748]" />
            <h3 className="text-xl text-white mb-2">No questions found</h3>
            <p className="text-[#6b7280]">Try adjusting your filters</p>
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
          <a href="/subjects" className="flex flex-col items-center gap-1 p-2 text-[#9ca3af]">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Subjects</span>
          </a>
          <a href="/questions" className="flex flex-col items-center gap-1 p-2 text-[#818cf8]">
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
