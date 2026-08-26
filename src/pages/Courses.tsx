import { useState } from 'react';
import { asset } from '../lib/asset';
import {
  ArrowRight, Code, Database, Layers, Cpu, Rocket, GitBranch,
  BookOpen, Terminal, Play, CheckCircle, Star, Mail, Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { ScrollReveal } from '../components/PageTransition';

type Level = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

const FLAGSHIP_IMG =
  asset('/media/dark-bckg-option-1-f184cbae.webp');

const freeCourses = [
  { title: 'Agent Engineering Guide', level: 'Beginner' as const, description: "A 6-day email course on the critical design mistakes that silently break agentic systems. Learn to evaluate agent behavior, optimize planning loops, and architect systems that are reliable and production-ready.", link: 'https://email-course.towardsai.net/?ref=b3ab31&utm_source=decodingai&utm_medium=partner&utm_campaign=agent_engineering' },
  { title: 'AI Agents Foundations', level: 'Beginner' as const, description: "How do AI agents work behind the scenes? This course breaks it all down — implement planning loops, manage context, give agents memory, and handle multimodal data.", link: 'https://www.decodingai.com/p/ai-agents-foundations-course' },
  { title: 'PhiloAgents', level: 'Beginner' as const, description: "Build your own AI game. Design and implement a production-ready RAG and LLM system from the ground up using LangGraph, FastAPI, Docker, and LLMOps best practices.", link: 'https://github.com/neural-maze/philoagents-course' },
  { title: 'Building a Coding Agent From Scratch', level: 'Intermediate' as const, description: "The harness, not the model, makes a coding agent good. Learn how to build a Claude Code-style AI coding agent from scratch in Python.", link: 'https://github.com/decodingai-magazine/building-a-coding-agent-from-scratch-course' },
  { title: 'Designing Enterprise MCP Systems', level: 'Intermediate' as const, description: "Build a fully functional AI Pull Request Reviewer from scratch. Use MCP to connect GitHub, Asana, and Slack into a single, automated workflow.", link: 'https://github.com/decodingai-magazine/enterprise-mcp-course' },
  { title: 'H&M Real-Time Personalized Recommender', level: 'Intermediate' as const, description: "Master end-to-end production-ready recommender systems. Architect an ML system, train neural network models, and deploy on Kubernetes using KServe and MLOps best practices.", link: 'https://github.com/decodingai-magazine/personalized-recommender-course' },
  { title: 'Second Brain AI Assistant', level: 'Advanced' as const, description: "Transform your knowledge base into an intelligent AI assistant you can chat with. 6 modules on building an advanced, production-ready agentic RAG system with modern LLMOps.", link: 'https://github.com/decodingai-magazine/second-brain-ai-assistant-course' },
];

const COURSE_ICONS: Record<string, LucideIcon> = {
  'Agent Engineering Guide': Mail,
  'AI Agents Foundations': Cpu,
  PhiloAgents: Sparkles,
  'Building a Coding Agent From Scratch': Terminal,
  'Designing Enterprise MCP Systems': GitBranch,
  'H&M Real-Time Personalized Recommender': Database,
  'Second Brain AI Assistant': Layers,
};

const levels: Level[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

function levelStyle(level: string) {
  switch (level) {
    case 'Beginner': return { color: '#f9cf32', border: 'rgba(249,207,50,0.3)', bg: 'rgba(249,207,50,0.1)' };
    case 'Intermediate': return { color: '#e58925', border: 'rgba(229,137,37,0.3)', bg: 'rgba(229,137,37,0.1)' };
    case 'Advanced': return { color: '#d5342a', border: 'rgba(213,52,42,0.3)', bg: 'rgba(213,52,42,0.1)' };
    default: return { color: '#cdcfd3', border: 'rgba(65,64,66,0.3)', bg: 'rgba(65,64,66,0.15)' };
  }
}

const learn = [
  { Icon: Code, text: 'Build professional, production-ready Python applications.' },
  { Icon: Cpu, text: 'Architect AI systems using MLOps & LLMOps best practices.' },
  { Icon: Layers, text: 'Write clean, modular, scalable code using SWE best practices.' },
  { Icon: Database, text: 'Work with real, custom datasets.' },
  { Icon: Rocket, text: 'Integrate AI models into real-world projects & applications.' },
];
const steps = [
  { Icon: CheckCircle, text: 'Choose one of the courses below.' },
  { Icon: GitBranch, text: 'Clone one of our GitHub repositories.' },
  { Icon: BookOpen, text: 'Open the linked Substack lessons.' },
  { Icon: Terminal, text: 'Set up the code using the repo documentation.' },
  { Icon: Play, text: 'Go through the lessons and run the code.' },
];

export default function Courses() {
  const [active, setActive] = useState<Level>('All');
  const counts = levels.reduce((a, l) => { a[l] = l === 'All' ? freeCourses.length : freeCourses.filter((c) => c.level === l).length; return a; }, {} as Record<string, number>);
  const filtered = active === 'All' ? freeCourses : freeCourses.filter((c) => c.level === active);

  return (
    <div className="pt-24">
      <section className="page-header">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">Build Production-Ready AI</h1>
          <p className="text-xl text-white/80">Write real code. Ship real AI products.</p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center flex flex-col items-center gap-5 mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold">Go beyond notebooks and framework demos.</h2>
              <p className="text-lg text-brand-grey max-w-3xl leading-relaxed">Our courses are end-to-end blueprints for building production-grade AI systems. Work with clean, reusable code and real datasets to architect and deploy applications from scratch.</p>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="card p-8 h-full flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center"><Layers size={18} className="text-white" /></div>
                  <h3 className="text-xl font-bold text-brand-white">What you'll learn</h3>
                </div>
                <ul className="flex flex-col gap-4">
                  {learn.map((l) => (
                    <li key={l.text} className="flex items-start gap-3 text-brand-grey">
                      <l.Icon size={16} className="text-brand-red mt-1 flex-shrink-0" />
                      <span>{l.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <div className="card p-8 h-full flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center"><Play size={18} className="text-white" /></div>
                  <h3 className="text-xl font-bold text-brand-white">How to get started</h3>
                </div>
                <ol className="flex flex-col gap-4">
                  {steps.map((s, i) => (
                    <li key={s.text} className="flex items-start gap-3 text-brand-grey">
                      <span className="w-6 h-6 rounded-full bg-brand-orange/15 text-brand-orange text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      <span>{s.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Flagship */}
      <section className="py-14 md:py-20 relative overflow-hidden border-y border-brand-black1/30">
        <div className="absolute inset-0 bg-brand-black2/60" />
        <div className="absolute top-0 inset-x-0 gradient-hairline opacity-40" />
        <div className="absolute bottom-0 inset-x-0 gradient-hairline opacity-40" />
        <div className="relative max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="tag text-brand-orange border-brand-orange/30 bg-brand-orange/5 uppercase tracking-widest">
                <Star size={12} /> Our Flagship Course
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <a href="https://course.pauliusztin.ai" target="_blank" rel="noopener noreferrer" className="block group relative">
                <img src={FLAGSHIP_IMG} alt="Agent Engineering: Building Multi-Agent Systems" className="w-full rounded-2xl shadow-2xl shadow-black/40 group-hover:scale-[1.02] transition-transform duration-300" />
              </a>
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-white">
                  Agent Engineering: Building <span className="whitespace-nowrap">Multi-Agent</span> Systems
                </h2>
                <p className="text-brand-white font-medium text-base md:text-lg">From prompting models to engineering agents.</p>
                <div className="flex flex-col gap-4 text-brand-grey leading-relaxed">
                  <p>Go from agent user to agent builder. Master the foundations of AI agents and turn fragile demo code into reliable, production-ready systems.</p>
                  <p>35 lessons. 4 mini-projects. 2 production systems. Certificate and direct access to me &amp; industry experts in our Discord.</p>
                  <p>Built for software and data professionals transitioning into AI engineering.</p>
                </div>
                <a href="https://course.pauliusztin.ai" target="_blank" rel="noopener noreferrer" className="btn btn-primary px-7 py-3.5 self-center lg:self-start">
                  Go to Course <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </ScrollReveal>
          <p className="text-center text-brand-grey text-sm mt-10 italic">Not ready yet? We also have a collection of free courses below.</p>
        </div>
      </section>

      {/* Library */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center gap-3 mb-10">
              <h2 className="text-4xl md:text-5xl font-extrabold">Courses Library</h2>
            </div>
          </ScrollReveal>
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            {levels.map((l) => {
              const on = l === active;
              const s = levelStyle(l);
              const style = on
                ? (l === 'All' ? { background: '#fff', color: '#131314', borderColor: '#fff' } : { background: s.bg, color: s.color, borderColor: s.border })
                : { background: 'transparent', color: '#cdcfd3', borderColor: 'rgba(65,64,66,0.5)' };
              return (
                <button key={l} onClick={() => setActive(l)} className="px-5 py-2 text-sm font-medium rounded-full border transition-all duration-200 flex items-center gap-2" style={style}>
                  {l}<span className="text-xs opacity-70">{counts[l]}</span>
                </button>
              );
            })}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, idx) => {
              const s = levelStyle(course.level);
              const Icon = COURSE_ICONS[course.title] || Code;
              return (
                <ScrollReveal key={course.title} delay={(idx % 3) * 90}>
                  <a href={course.link} target="_blank" rel="noopener noreferrer" className="group card card-hover flex flex-col h-full overflow-hidden">
                    <div className="p-6 flex flex-col h-full gap-4">
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center border" style={{ color: s.color, borderColor: s.border, background: s.bg }}>
                          <Icon size={14} />
                        </div>
                        <span className="tag" style={{ color: s.color, borderColor: s.border, background: s.bg }}>{course.level}</span>
                      </div>
                      <h3 className="text-lg font-bold text-brand-white group-hover:text-brand-orange transition-colors">{course.title}</h3>
                      <p className="text-sm text-brand-grey leading-relaxed flex-1">{course.description}</p>
                      <div className="flex items-center gap-2 text-sm font-semibold text-brand-red pt-1 transition-all group-hover:gap-3">
                        View course <ArrowRight size={14} />
                      </div>
                    </div>
                  </a>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
