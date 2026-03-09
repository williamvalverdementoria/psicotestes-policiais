import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Signup } from '@/pages/Signup'
import { Onboarding } from '@/pages/Onboarding'
import { Dashboard } from '@/pages/Dashboard'
import { Treino } from '@/pages/Treino'
import { Exercicio } from '@/pages/Exercicio'
import { Resultado } from '@/pages/Resultado'
import { Plano } from '@/pages/Plano'
import { Progresso } from '@/pages/Progresso'
import { Perfil } from '@/pages/Perfil'
import { AppLayout } from '@/components/layout/AppLayout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Exercise (fullscreen, no layout) */}
        <Route path="/exercicio/:id" element={<Exercicio />} />
        <Route path="/resultado/:sessaoId" element={<Resultado />} />

        {/* App (with sidebar/bottom nav) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/treino" element={<Treino />} />
          <Route path="/plano" element={<Plano />} />
          <Route path="/progresso" element={<Progresso />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
