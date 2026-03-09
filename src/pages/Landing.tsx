import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Clock, Target, Eye, Brain, Lightbulb, User, Check, X, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabase'
import type { Concurso } from '@/types/database'

const constructos = [
  { nome: 'Personalidade', desc: 'Traços comportamentais e perfil psicológico', icon: User, color: 'bg-purple-100 text-purple-600' },
  { nome: 'Atenção Concentrada', desc: 'Foco em um único estímulo por vez', icon: Eye, color: 'bg-blue-100 text-blue-600' },
  { nome: 'Atenção Dividida', desc: 'Processar múltiplos estímulos simultaneamente', icon: Target, color: 'bg-teal-100 text-teal-600' },
  { nome: 'Memória', desc: 'Retenção e recuperação de informações', icon: Lightbulb, color: 'bg-amber-100 text-amber-600' },
  { nome: 'Raciocínio Lógico', desc: 'Resolução de problemas e análise', icon: Brain, color: 'bg-rose-100 text-rose-600' },
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
      <section className="relative bg-primary min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Check className="w-4 h-4" />
              Aprovado por psicólogo especialista
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Prepare-se para o{' '}
              <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Psicotécnico
              </span>{' '}
              do seu Concurso Policial
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl">
              Treine com exercícios cronometrados personalizados para o seu edital. Criado por psicólogo especialista em avaliações psicológicas para concursos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-accent hover:bg-accent-dark rounded-xl transition-colors shadow-lg shadow-accent/25"
              >
                Comece seu treino grátis
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-gray-300 border border-gray-600 hover:border-gray-400 hover:text-white rounded-xl transition-colors"
              >
                Como funciona
              </a>
            </div>
            <div className="mt-12 flex items-center gap-8 text-sm text-gray-500">
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
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">
              Mais de 30% dos candidatos são eliminados na avaliação psicológica
            </h2>
            <p className="text-lg text-gray-500">Não seja um deles. A preparação adequada faz toda a diferença.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: '30%+', label: 'Candidatos eliminados no psicotécnico', bg: 'bg-red-50 border-red-100', text: 'text-red-600', iconBg: 'bg-red-100', iconColor: 'text-red-500' },
              { value: '2ª fase', label: 'Onde a maioria é eliminada sem preparação', bg: 'bg-amber-50 border-amber-100', text: 'text-amber-600', iconBg: 'bg-amber-100', iconColor: 'text-amber-500' },
              { value: '95%', label: 'Taxa de aprovação com treino adequado', bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-600', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-500' },
            ].map(stat => (
              <div key={stat.value} className={`text-center p-8 rounded-2xl ${stat.bg} border`}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${stat.iconBg} flex items-center justify-center`}>
                  <Shield className={`w-8 h-8 ${stat.iconColor}`} />
                </div>
                <div className={`text-4xl font-extrabold ${stat.text} mb-2`}>{stat.value}</div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 md:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">Como funciona</h2>
            <p className="text-lg text-gray-500">Três passos simples para sua aprovação</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: '1', title: 'Escolha seu concurso', desc: 'Selecione entre PCES, PMES e outros concursos policiais. O conteúdo é adaptado ao edital específico.' },
              { step: '2', title: 'Faça o diagnóstico', desc: 'Descubra seus pontos fortes e fracos em cada constructo avaliado. O sistema identifica onde melhorar.' },
              { step: '3', title: 'Treine diariamente', desc: 'Exercícios cronometrados com dificuldade progressiva. Acompanhe sua evolução com relatórios.' },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <span className="text-xl font-extrabold text-accent">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONCURSOS */}
      <section id="concursos" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">Concursos disponíveis</h2>
            <p className="text-lg text-gray-500">Conteúdo personalizado para cada edital</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {concursos.map(c => (
              <div
                key={c.id}
                className={`rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all ${
                  c.ativo
                    ? 'bg-white border-2 border-accent shadow-sm'
                    : 'bg-white border border-gray-200 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.ativo ? 'bg-accent/10' : 'bg-gray-100'}`}>
                    <Shield className={`w-6 h-6 ${c.ativo ? 'text-accent' : 'text-gray-400'}`} />
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    c.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {c.ativo ? 'Disponível' : 'Em breve'}
                  </span>
                </div>
                <h3 className={`text-lg font-bold mb-1 ${c.ativo ? 'text-primary' : 'text-gray-700'}`}>{c.sigla}</h3>
                <p className={`text-sm ${c.ativo ? 'text-gray-500' : 'text-gray-400'}`}>{c.nome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONSTRUCTOS */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">O que treinamos</h2>
            <p className="text-lg text-gray-500">Constructos avaliados nos concursos policiais</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {constructos.map(c => (
              <div key={c.nome} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all text-center">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${c.color} flex items-center justify-center`}>
                  <c.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-primary mb-2">{c.nome}</h3>
                <p className="text-sm text-gray-500">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREDIBILIDADE */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">Criado por especialista</h2>
            <p className="text-xl text-gray-700 font-semibold mb-2">William Valverde — Psicólogo</p>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              Conteúdo baseado em referências SATEPSI e bibliografias oficiais dos concursos policiais.
              Exercícios desenvolvidos seguindo os parâmetros técnicos das avaliações psicológicas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Referências SATEPSI', 'Bibliografias oficiais', 'Parâmetros técnicos CFP'].map(badge => (
                <span key={badge} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  <Check className="w-4 h-4" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="precos" className="py-20 md:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4">Planos e preços</h2>
            <p className="text-lg text-gray-500">Escolha o plano ideal para sua preparação</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Gratuito */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-primary mb-1">Gratuito</h3>
                <p className="text-sm text-gray-500">Para começar a treinar</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-primary">R$0</span>
                <span className="text-gray-500 text-sm">/para sempre</span>
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
              <Link to="/signup" className="w-full text-center px-6 py-3 text-sm font-bold text-accent border-2 border-accent hover:bg-accent hover:text-white rounded-xl transition-colors">
                Começar grátis
              </Link>
            </div>

            {/* Assinatura */}
            <div className="relative bg-gradient-to-b from-primary to-primary-light border-2 border-accent rounded-2xl p-8 shadow-xl hover:-translate-y-1 transition-all flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent text-white text-xs font-bold shadow-lg shadow-accent/25">
                  Mais popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">Assinatura</h3>
                <p className="text-sm text-gray-400">Acesso completo</p>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-white">R$39,90</span>
                <span className="text-gray-400 text-sm">/mês</span>
              </div>
              <p className="text-sm text-accent mb-6">
                ou R$297,00/ano <span className="text-xs bg-accent/20 px-2 py-0.5 rounded-full ml-1">-38%</span>
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {['Todos os concursos', 'Exercícios ilimitados', 'Todos os níveis de dificuldade', 'Relatórios detalhados', 'Plano de treino personalizado'].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="w-full text-center px-6 py-3 text-sm font-bold text-white bg-accent hover:bg-accent-dark rounded-xl transition-colors shadow-lg shadow-accent/25">
                Assinar agora
              </Link>
            </div>

            {/* Avulso */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-primary mb-1">Avulso</h3>
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
              <Link to="/signup" className="w-full text-center px-6 py-3 text-sm font-bold text-accent border-2 border-accent hover:bg-accent hover:text-white rounded-xl transition-colors">
                Comprar acesso
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Psicotestes Policiais</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
              <a href="#concursos" className="hover:text-white transition-colors">Concursos</a>
              <a href="#precos" className="hover:text-white transition-colors">Preços</a>
              <Link to="/login" className="hover:text-white transition-colors">Entrar</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
            &copy; 2026 Psicotestes Policiais. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
