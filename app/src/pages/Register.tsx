import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { registerUser } from '@/firebase/config';

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(email, password, fullName);
      setSuccess('Account created! Please verify your email. Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a0e1a' }}>
      {/* Left Side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 to-[#818cf8]/10" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 70% 80%, rgba(129, 140, 248, 0.1) 0%, transparent 50%)`
        }} />
        
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#6366f1] to-[#818cf8]">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            IJMB<span className="text-[#6366f1]">PRO</span>
          </h1>
          <p className="text-[#9ca3af] text-lg max-w-md">
            Join thousands of students preparing for IJMB examinations
          </p>
          
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-[#9ca3af]">
              <CheckCircle className="w-5 h-5 text-[#10b981]" />
              <span>Access to 1000+ past questions</span>
            </div>
            <div className="flex items-center gap-3 text-[#9ca3af]">
              <CheckCircle className="w-5 h-5 text-[#10b981]" />
              <span>Detailed solutions and explanations</span>
            </div>
            <div className="flex items-center gap-3 text-[#9ca3af]">
              <CheckCircle className="w-5 h-5 text-[#10b981]" />
              <span>Track your progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#6366f1] to-[#818cf8]">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            IJMB<span className="text-[#6366f1]">PRO</span>
          </h1>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-[#9ca3af] mb-6">Start your IJMB preparation journey</p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm text-[#9ca3af] mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1a2235] border border-[#2d3748] text-white placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#9ca3af] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1a2235] border border-[#2d3748] text-white placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#9ca3af] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-[#1a2235] border border-[#2d3748] text-white placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#9ca3af] mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1a2235] border border-[#2d3748] text-white placeholder-[#6b7280] focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input 
                type="checkbox" 
                className="w-4 h-4 mt-0.5 rounded border-[#2d3748] bg-[#1a2235] text-[#6366f1] focus:ring-[#6366f1]" 
                required
              />
              <span className="text-[#9ca3af]">
                I agree to the{' '}
                <Link to="/terms" className="text-[#6366f1] hover:text-[#818cf8]">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-[#6366f1] hover:text-[#818cf8]">Privacy Policy</Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#6366f1]/30 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[#9ca3af]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#6366f1] hover:text-[#818cf8] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
