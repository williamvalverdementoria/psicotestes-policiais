import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, Dumbbell, ListChecks, TrendingUp, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/treino', label: 'Treino', icon: Dumbbell },
  { to: '/plano', label: 'Plano', icon: ListChecks },
  { to: '/progresso', label: 'Progresso', icon: TrendingUp },
  { to: '/perfil', label: 'Perfil', icon: User },
]

export function AppLayout() {
  const { user, profile, loading, signOut } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-primary to-primary-dark flex-col z-40">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">Psicotestes</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-white/10 text-white shadow-sm backdrop-blur-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-accent-light' : ''}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mx-4 mb-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="px-2 mb-3">
            <p className="text-sm font-bold text-white truncate">{profile?.nome || 'Candidato'}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">{profile?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 w-full px-2 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 z-40 flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-dark rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-extrabold text-primary">Psicotestes</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-500">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white/95 backdrop-blur-xl z-30 p-4">
          <nav className="space-y-1">
            {navItems.map(item => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                    active ? 'bg-accent/10 text-accent' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={() => { signOut(); setMobileMenuOpen(false) }}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-danger transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair da conta
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="md:ml-72 min-h-screen pt-16 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100/80 z-40 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map(item => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-semibold transition-all duration-200 ${
                  active ? 'text-accent' : 'text-gray-400'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform duration-200`} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
