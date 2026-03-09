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
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-primary tracking-tight">Perfil</h1>

      {/* Profile Info */}
      <div className="card-elevated p-7">
        <h2 className="text-lg font-extrabold text-primary mb-5">Informações pessoais</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="input-modern pl-11" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input type="email" value={profile?.email || ''} disabled className="input-modern pl-11 !bg-gray-50 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telefone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} className="input-modern pl-11" placeholder="(27) 99999-9999" />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saved ? <><Check className="w-4 h-4" /> Salvo!</> : saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>

      {/* Subscription */}
      <div className="card-elevated p-7">
        <h2 className="text-lg font-extrabold text-primary mb-5">Assinatura</h2>

        <div className="flex items-center gap-3 mb-6">
          <span className={`badge text-sm ${planColor}`}>
            <Crown className="w-4 h-4" />
            Plano {planLabel}
          </span>
        </div>

        {profile?.plano === 'gratuito' && (
          <div>
            <p className="text-sm text-gray-500 mb-5">
              Faça upgrade para desbloquear exercícios ilimitados, todos os níveis e relatórios completos.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl p-5 border-2 border-accent bg-accent/5">
                <h4 className="font-bold text-primary mb-1">Assinatura</h4>
                <p className="text-2xl font-extrabold text-primary">R$39,90<span className="text-sm font-normal text-gray-400">/mês</span></p>
                <p className="text-xs text-accent mb-4">ou R$297/ano (-38%)</p>
                <ul className="space-y-1.5 mb-5">
                  {['Todos os concursos', 'Ilimitado', 'Relatórios'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                      <Check className="w-3.5 h-3.5 text-success" />{f}
                    </li>
                  ))}
                </ul>
                <button className="btn-primary w-full !text-sm">Assinar</button>
              </div>

              <div className="rounded-xl p-5 border border-gray-200">
                <h4 className="font-bold text-primary mb-1">Avulso</h4>
                <p className="text-2xl font-extrabold text-primary">R$59,90<span className="text-sm font-normal text-gray-400">/mês</span></p>
                <p className="text-xs text-gray-400 mb-4">pacotes de 1, 3 ou 6 meses</p>
                <ul className="space-y-1.5 mb-5">
                  {['1 concurso', 'Ilimitado', 'Relatórios'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                      <Check className="w-3.5 h-3.5 text-success" />{f}
                    </li>
                  ))}
                </ul>
                <button className="btn-secondary w-full !text-sm !text-accent !border-accent hover:!bg-accent hover:!text-white">Comprar</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <button onClick={signOut} className="btn-ghost !text-gray-400 hover:!text-danger">
        <LogOut className="w-4 h-4" />
        Sair da conta
      </button>
    </div>
  )
}
