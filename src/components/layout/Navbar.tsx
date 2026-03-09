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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-primary/95 backdrop-blur-xl shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Psicotestes</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-sm text-gray-300 hover:text-white transition-colors">Como funciona</a>
            <a href="#concursos" className="text-sm text-gray-300 hover:text-white transition-colors">Concursos</a>
            <a href="#precos" className="text-sm text-gray-300 hover:text-white transition-colors">Preços</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">Entrar</Link>
            <Link to="/signup" className="px-4 py-2 text-sm font-semibold text-white bg-accent hover:bg-accent-dark rounded-lg transition-colors">
              Começar grátis
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <a href="#como-funciona" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMobileOpen(false)}>Como funciona</a>
            <a href="#concursos" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMobileOpen(false)}>Concursos</a>
            <a href="#precos" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMobileOpen(false)}>Preços</a>
            <Link to="/login" className="block text-sm text-gray-300 hover:text-white py-2" onClick={() => setMobileOpen(false)}>Entrar</Link>
            <Link to="/signup" className="block w-full text-center px-4 py-2 text-sm font-semibold text-white bg-accent rounded-lg" onClick={() => setMobileOpen(false)}>
              Começar grátis
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
