import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  LayoutDashboard,
  Database,
  Users,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Search,
  LogOut,
  X,
  CheckCircle,
  AlertCircle,
  Menu,
  FileText,
  TrendingUp,
  User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/firebase/config';
import { getAllQuestions, addQuestion, updateQuestion, deleteQuestion } from '@/services/questionService';
import { getAllSubjects } from '@/services/subjectService';
import { getDashboardStats } from '@/services/progressService';
import type { Question, Subject, DashboardStats } from '@/types';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data states
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    year: new Date().getFullYear(),
    paper: 'Paper I',
    question: '',
    answer: '',
    tags: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Check admin access
    const checkAdmin = async () => {
      const { isAdmin: checkAdminRole } = await import('@/firebase/config');
      const adminStatus = await checkAdminRole(user?.uid || '');
      if (!adminStatus) {
        navigate('/dashboard');
        return;
      }
      fetchData();
    };
    
    checkAdmin();
  }, [isAuthenticated, navigate, user?.uid]);

  const fetchData = async () => {
    setLoading(true);
    const [questionsData, subjectsData, statsData] = await Promise.all([
      getAllQuestions(),
      getAllSubjects(),
      getDashboardStats()
    ]);
    setQuestions(questionsData);
    setSubjects(subjectsData);
    setStats(statsData);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const questionData = {
      subject: formData.subject,
      year: formData.year,
      paper: formData.paper,
      question: formData.question,
      answer: formData.answer,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, questionData);
        setMessage({ type: 'success', text: 'Question updated successfully!' });
      } else {
        await addQuestion(questionData);
        setMessage({ type: 'success', text: 'Question added successfully!' });
      }
      
      setShowQuestionModal(false);
      setEditingQuestion(null);
      setFormData({ subject: '', year: new Date().getFullYear(), paper: 'Paper I', question: '', answer: '', tags: '' });
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save question' });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await deleteQuestion(id);
      setMessage({ type: 'success', text: 'Question deleted!' });
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete' });
    }
  };

  const openEditModal = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      subject: question.subject,
      year: question.year,
      paper: question.paper,
      question: question.question,
      answer: question.answer,
      tags: question.tags.join(', ')
    });
    setShowQuestionModal(true);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'questions', label: 'Questions', icon: Database },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a0e1a' }}>
      {/* Sidebar - Desktop */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 border-r border-[#2d3748]`} style={{ backgroundColor: '#111827' }}>
        {/* Logo */}
        <div className="p-6 border-b border-[#2d3748] flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#6366f1] to-[#818cf8]">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">IJMB<span className="text-[#6366f1]">PRO</span></span>
              <p className="text-xs text-[#6366f1]">Admin Panel</p>
            </div>
          </a>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-[#9ca3af]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#6366f1]/20 text-[#818cf8]' 
                    : 'text-[#9ca3af] hover:bg-[#1a2235] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2d3748]">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{user?.displayName || 'Admin'}</p>
              <p className="text-[#6366f1] text-xs">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#ef4444] hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between p-4 border-b border-[#2d3748]" style={{ backgroundColor: '#111827' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-[#9ca3af]">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-white capitalize">{activeTab}</h1>
          </div>
          <a href="/dashboard" className="text-sm text-[#6366f1] hover:text-[#818cf8]">
            Back to App
          </a>
        </header>

        {/* Messages */}
        {message.text && (
          <div className={`mx-4 mt-4 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/30' 
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>{message.text}</p>
            <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto">
              <X className="w-4 h-4 text-[#6b7280]" />
            </button>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Questions', value: stats?.totalQuestions || 0, icon: Database, color: '#6366f1' },
                  { label: 'Subjects', value: stats?.totalSubjects || 0, icon: BookOpen, color: '#10b981' },
                  { label: 'Users', value: stats?.totalUsers || 0, icon: Users, color: '#f59e0b' },
                  { label: 'Exams Taken', value: stats?.totalExams || 0, icon: TrendingUp, color: '#ec4899' },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="card-dark p-5">
                      <Icon className="w-6 h-6 mb-3" style={{ color: stat.color }} />
                      <div className="text-2xl font-bold text-white">{loading ? '-' : stat.value}</div>
                      <div className="text-[#6b7280] text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="card-dark p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setActiveTab('questions'); setShowQuestionModal(true); }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#6366f1]/10 hover:bg-[#6366f1]/20 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#6366f1]/20 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-[#6366f1]" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-medium">Add Question</h3>
                      <p className="text-[#6b7280] text-sm">Create new past question</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#10b981]/10 hover:bg-[#10b981]/20 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-[#10b981]" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-medium">View Analytics</h3>
                      <p className="text-[#6b7280] text-sm">Platform statistics</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                  <input 
                    type="text" 
                    placeholder="Search questions..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1a2235] border border-[#2d3748] text-white placeholder-[#6b7280]"
                  />
                </div>
                <button 
                  onClick={() => setShowQuestionModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Question
                </button>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="card-dark p-6 text-center text-[#6b7280]">Loading...</div>
                ) : questions.length === 0 ? (
                  <div className="card-dark p-6 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-[#2d3748]" />
                    <p className="text-[#6b7280]">No questions yet. Add your first question!</p>
                  </div>
                ) : (
                  questions.map((q) => (
                    <div key={q.id} className="card-dark p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded-lg bg-[#6366f1]/20 text-[#818cf8] text-xs">{q.subject}</span>
                            <span className="px-2 py-1 rounded-lg bg-[#1a2235] text-[#9ca3af] text-xs">{q.year}</span>
                            <span className="px-2 py-1 rounded-lg bg-[#1a2235] text-[#9ca3af] text-xs">{q.paper}</span>
                          </div>
                          <p className="text-white line-clamp-2">{q.question}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openEditModal(q)}
                            className="p-2 rounded-lg hover:bg-[#232b3f] text-[#6366f1]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-[#ef4444]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab === 'subjects' && (
            <div className="card-dark p-8 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-[#2d3748]" />
              <h2 className="text-xl font-semibold text-white mb-2">Subjects Management</h2>
              <p className="text-[#6b7280]">Subject management coming soon...</p>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="card-dark p-8 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-[#2d3748]" />
              <h2 className="text-xl font-semibold text-white mb-2">User Management</h2>
              <p className="text-[#6b7280]">User management coming soon...</p>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="card-dark p-8 text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-[#2d3748]" />
              <h2 className="text-xl font-semibold text-white mb-2">Analytics Dashboard</h2>
              <p className="text-[#6b7280]">Detailed analytics coming soon...</p>
            </div>
          )}
        </div>
      </main>

      {/* Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-auto card-dark">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[#2d3748]" style={{ backgroundColor: '#1a2235' }}>
              <h2 className="text-xl font-semibold text-white">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button 
                onClick={() => { setShowQuestionModal(false); setEditingQuestion(null); }}
                className="p-2 hover:bg-[#232b3f] rounded-lg"
              >
                <X className="w-5 h-5 text-[#6b7280]" />
              </button>
            </div>
            
            <form onSubmit={handleSaveQuestion} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-2">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0e1a] border border-[#2d3748] text-white"
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-2">Year</label>
                  <input 
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0e1a] border border-[#2d3748] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#9ca3af] mb-2">Paper</label>
                  <select 
                    value={formData.paper}
                    onChange={(e) => setFormData({...formData, paper: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0e1a] border border-[#2d3748] text-white"
                  >
                    <option>Paper I</option>
                    <option>Paper II</option>
                    <option>Paper III</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-[#9ca3af] mb-2">Question</label>
                <textarea 
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0e1a] border border-[#2d3748] text-white resize-none"
                  placeholder="Enter the question..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#9ca3af] mb-2">Answer / Solution</label>
                <textarea 
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0e1a] border border-[#2d3748] text-white resize-none"
                  placeholder="Enter the answer with explanation..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#9ca3af] mb-2">Tags (comma separated)</label>
                <input 
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0e1a] border border-[#2d3748] text-white"
                  placeholder="e.g. Algebra, Equations, Mathematics"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => { setShowQuestionModal(false); setEditingQuestion(null); }}
                  className="flex-1 py-3 rounded-xl border border-[#2d3748] text-[#9ca3af] hover:bg-[#232b3f] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editingQuestion ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
