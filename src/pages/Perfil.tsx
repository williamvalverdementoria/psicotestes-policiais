import { useState } from 'react'
import { User, Mail, Phone, LogOut, Check, Crown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export function Perfil() {
  const { profile, signOut } = useAuth()
  const [nome, setNome] = useState(profile?.nome || '')
  const [telefone, setTelefone] = useState(profile?.telefone || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!profile) return
    setSaving(true)
    await supabase
      .from('profiles')
      .update({ nome, telefone })
      .eq('id', profile.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const planLabel = profile?.plano === 'assinatura' ? 'Assinatura'
    : profile?.plano === 'avulso' ? 'Avulso'
    : 'Gratuito'

  const planColor = profile?.plano === 'gratuito'
    ? 'bg-gray-100 text-gray-600'
    : 'bg-accent/10 text-accent'

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-8">Perfil</h1>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-primary mb-4">Informações pessoais</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                placeholder="(27) 99999-9999"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {saved ? <><Check className="w-4 h-4" /> Salvo!</> : saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-primary mb-4">Assinatura</h2>

        <div className="flex items-center gap-3 mb-6">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${planColor}`}>
            <Crown className="w-4 h-4" />
            Plano {planLabel}
          </span>
        </div>

        {profile?.plano === 'gratuito' && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Faça upgrade para desbloquear exercícios ilimitados, todos os níveis e relatórios completos.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Assinatura */}
              <div className="border-2 border-accent rounded-xl p-4">
                <h4 className="font-bold text-primary mb-1">Assinatura</h4>
                <p className="text-2xl font-extrabold text-primary">R$39,90<span className="text-sm font-normal text-gray-400">/mês</span></p>
                <p className="text-xs text-accent mb-3">ou R$297/ano (-38%)</p>
                <ul className="space-y-1 mb-4">
                  {['Todos os concursos', 'Ilimitado', 'Relatórios'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-success" />{f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2.5 text-sm font-bold text-white bg-accent rounded-lg hover:bg-accent-dark transition-colors">
                  Assinar
                </button>
              </div>

              {/* Avulso */}
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-bold text-primary mb-1">Avulso</h4>
                <p className="text-2xl font-extrabold text-primary">R$59,90<span className="text-sm font-normal text-gray-400">/mês</span></p>
                <p className="text-xs text-gray-400 mb-3">pacotes de 1, 3 ou 6 meses</p>
                <ul className="space-y-1 mb-4">
                  {['1 concurso', 'Ilimitado', 'Relatórios'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-success" />{f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2.5 text-sm font-bold text-accent border-2 border-accent rounded-lg hover:bg-accent hover:text-white transition-colors">
                  Comprar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={signOut}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-danger transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sair da conta
      </button>
    </div>
  )
}
