import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Clock, Target, Eye, Brain, Lightbulb, User, Check, X, ChevronRight, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabase'
import type { Concurso } from '@/types/database'

const constructos = [
  { nome: 'Personalidade', desc: 'Traços comportamentais e perfil psicológico', icon: User, color: 'bg-purple-50 text-purple-600' },
  { nome: 'Atenção Concentrada', desc: 'Foco em um único estímulo por vez', icon: Eye, color: 'bg-blue-50 text-blue-600' },
  { nome: 'Atenção Dividida', desc: 'Processar múltiplos estímulos simultaneamente', icon: Target, color: 'bg-teal-50 text-teal-600' },
  { nome: 'Memória', desc: 'Retenção e recuperação de informações', icon: Lightbulb, color: 'bg-amber-50 text-amber-600' },
  { nome: 'Raciocínio Lógico', desc: 'Resolução de problemas e análise', icon: Brain, color: 'bg-rose-50 text-rose-600' },
]

export function Landing() {
  const [concursos, setConcursos] = useState<Concurso[]>([])

  useEffect(() => {
    supabase.from('concursos').select('*').order('ativo', { ascending: false }).then(({ data }) => {
      if (data) setConcursos(data)
    })
  }, [])

  return (
    <div className="bg-white text-gray-900 antialiased">
      <Navbar />

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary-dark min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-8">
              <Sparkles className="w-4 h-4" />
              Aprovado por psicólogo especialista
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] mb-7 tracking-tight">
              Prepare-se para o{' '}
              <span className="text-gradient">
                Psicotécnico
              </span>{' '}
              do seu Concurso Policial
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl">
              Treine com exercícios cronometrados personalizados para o seu edital. Criado por psicólogo especialista em avaliações psicológicas para concursos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="btn-primary !px-8 !py-4 !text-base shadow-xl shadow-accent/20">
                Comece seu treino grátis
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a href="#como-funciona" className="btn-ghost !text-gray-300 !border !border-gray-600 hover:!border-gray-400 hover:!text-white !px-8 !py-4 !text-base">
                Como funciona
              </a>
            </div>
            <div className="mt-14 flex items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success" />
                Sem cartão de crédito
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-success" />
                3 exercícios grátis/dia
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4 tracking-tight">
              Mais de 30% dos candidatos são eliminados na avaliação psicológica
            </h2>
            <p className="text-lg text-gray-500">Não seja um deles. A preparação adequada faz toda a diferença.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: '30%+', label: 'Candidatos eliminados no psicotécnico', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600', iconColor: 'text-red-500' },
              { value: '2ª fase', label: 'Onde a maioria é eliminada sem preparação', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', iconColor: 'text-amber-500' },
              { value: '95%', label: 'Taxa de aprovação com treino adequado', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', iconColor: 'text-emerald-500' },
            ].map(stat => (
              <div key={stat.value} className={`text-center p-8 rounded-2xl ${stat.bg} border ${stat.border} hover:-translate-y-1 transition-all duration-300`}>
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/60 flex items-center justify-center`}>
                  <Shield className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
                <div className={`text-4xl font-extrabold ${stat.text} mb-2`}>{stat.value}</div>
                <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4 tracking-tight">Como funciona</h2>
            <p className="text-lg text-gray-500">Três passos simples para sua aprovação</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { step: '1', title: 'Escolha seu concurso', desc: 'Selecione entre PCES, PMES e outros concursos policiais. O conteúdo é adaptado ao edital específico.' },
              { step: '2', title: 'Faça o diagnóstico', desc: 'Descubra seus pontos fortes e fracos em cada constructo avaliado. O sistema identifica onde melhorar.' },
              { step: '3', title: 'Treine diariamente', desc: 'Exercícios cronometrados com dificuldade progressiva. Acompanhe sua evolução com relatórios.' },
            ].map(item => (
              <div key={item.step} className="card-elevated p-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center mb-6">
                  <span className="text-xl font-extrabold text-accent">{item.step}</span>
                </div>
                <h3 className="text-xl font-extrabold text-primary mb-3 tracking-tight">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONCURSOS */}
      <section id="concursos" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4 tracking-tight">Concursos disponíveis</h2>
            <p className="text-lg text-gray-500">Conteúdo personalizado para cada edital</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {concursos.map(c => (
              <div
                key={c.id}
                className={`rounded-2xl p-6 transition-all duration-300 ${
                  c.ativo
                    ? 'card-elevated border-2 !border-accent/30 hover:-translate-y-1'
                    : 'bg-gray-50 border border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.ativo ? 'bg-accent/10' : 'bg-gray-100'}`}>
                    <Shield className={`w-5 h-5 ${c.ativo ? 'text-accent' : 'text-gray-400'}`} />
                  </div>
                  <span className={`badge ${c.ativo ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    {c.ativo ? 'Disponível' : 'Em breve'}
                  </span>
                </div>
                <h3 className={`text-lg font-extrabold mb-1 ${c.ativo ? 'text-primary' : 'text-gray-700'}`}>{c.sigla}</h3>
                <p className={`text-sm ${c.ativo ? 'text-gray-500' : 'text-gray-400'}`}>{c.nome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONSTRUCTOS */}
      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4 tracking-tight">O que treinamos</h2>
            <p className="text-lg text-gray-500">Constructos avaliados nos concursos policiais</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {constructos.map(c => (
              <div key={c.nome} className="card-elevated p-6 text-center">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${c.color} flex items-center justify-center`}>
                  <c.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-primary mb-2 text-sm">{c.nome}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREDIBILIDADE */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4 tracking-tight">Criado por especialista</h2>
            <p className="text-xl text-gray-700 font-bold mb-2">William Valverde — Psicólogo</p>
            <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto">
              Conteúdo baseado em referências SATEPSI e bibliografias oficiais dos concursos policiais.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Referências SATEPSI', 'Bibliografias oficiais', 'Parâmetros técnicos CFP'].map(badge => (
                <span key={badge} className="badge bg-accent/10 text-accent text-sm py-2 px-4">
                  <Check className="w-4 h-4" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="precos" className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4 tracking-tight">Planos e preços</h2>
            <p className="text-lg text-gray-500">Escolha o plano ideal para sua preparação</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Gratuito */}
            <div className="card-elevated p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-extrabold text-primary mb-1">Gratuito</h3>
                <p className="text-sm text-gray-500">Para começar a treinar</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-primary">R$0</span>
                <span className="text-gray-400 text-sm ml-1">/para sempre</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['1 concurso disponível', '3 exercícios por dia', 'Exercícios nível 1-2'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  Relatórios avançados
                </li>
              </ul>
              <Link to="/signup" className="btn-secondary w-full !text-accent !border-accent hover:!bg-accent hover:!text-white">
                Começar grátis
              </Link>
            </div>

            {/* Assinatura */}
            <div className="relative bg-gradient-to-b from-primary to-primary-dark border-2 border-accent rounded-2xl p-8 shadow-2xl shadow-accent/10 flex flex-col scale-[1.02]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="badge bg-accent text-white shadow-lg shadow-accent/25 py-1.5 px-5">
                  Mais popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-extrabold text-white mb-1">Assinatura</h3>
                <p className="text-sm text-gray-400">Acesso completo</p>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-white">R$39,90</span>
                <span className="text-gray-400 text-sm ml-1">/mês</span>
              </div>
              <p className="text-sm text-accent mb-6 font-medium">
                ou R$297,00/ano <span className="badge bg-accent/20 text-accent ml-1">-38%</span>
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {['Todos os concursos', 'Exercícios ilimitados', 'Todos os níveis de dificuldade', 'Relatórios detalhados', 'Plano de treino personalizado'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="btn-primary w-full shadow-xl shadow-accent/20">
                Assinar agora
              </Link>
            </div>

            {/* Avulso */}
            <div className="card-elevated p-8 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-extrabold text-primary mb-1">Avulso</h3>
                <p className="text-sm text-gray-500">Pague por concurso</p>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-500">a partir de</span><br />
                <span className="text-4xl font-extrabold text-primary">R$59,90</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">pacotes de 1, 3 ou 6 meses</p>
              <ul className="space-y-3 mb-8 flex-1">
                {['1 concurso escolhido', 'Exercícios ilimitados', 'Todos os níveis', 'Acesso por tempo definido'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="btn-secondary w-full !text-accent !border-accent hover:!bg-accent hover:!text-white">
                Comprar acesso
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding bg-gradient-to-br from-primary via-primary to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Comece a treinar agora
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Não espere até a véspera da prova. Comece hoje e aumente suas chances de aprovação.
          </p>
          <Link to="/signup" className="btn-primary !px-10 !py-4 !text-base shadow-2xl shadow-accent/30">
            Criar conta grátis
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-dark rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-white">Psicotestes Policiais</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#como-funciona" className="hover:text-white transition-colors duration-200">Como funciona</a>
              <a href="#concursos" className="hover:text-white transition-colors duration-200">Concursos</a>
              <a href="#precos" className="hover:text-white transition-colors duration-200">Preços</a>
              <Link to="/login" className="hover:text-white transition-colors duration-200">Entrar</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} Psicotestes Policiais. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
