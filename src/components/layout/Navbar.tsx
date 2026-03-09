import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Menu, X } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-primary/90 backdrop-blur-2xl shadow-xl shadow-black/10' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">Psicotestes</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-sm text-gray-300 hover:text-white transition-colors duration-200">Como funciona</a>
            <a href="#concursos" className="text-sm text-gray-300 hover:text-white transition-colors duration-200">Concursos</a>
            <a href="#precos" className="text-sm text-gray-300 hover:text-white transition-colors duration-200">Preços</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 px-4 py-2">Entrar</Link>
            <Link to="/signup" className="btn-primary text-sm !py-2.5 !px-5">
              Começar grátis
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-1 animate-in slide-in-from-top-2">
            <a href="#como-funciona" className="block text-sm text-gray-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>Como funciona</a>
            <a href="#concursos" className="block text-sm text-gray-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>Concursos</a>
            <a href="#precos" className="block text-sm text-gray-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>Preços</a>
            <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
              <Link to="/login" className="block text-sm text-gray-300 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all" onClick={() => setMobileOpen(false)}>Entrar</Link>
              <Link to="/signup" className="block w-full text-center btn-primary" onClick={() => setMobileOpen(false)}>
                Começar grátis
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
