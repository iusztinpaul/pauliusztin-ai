import { useState } from 'react';
import { asset } from '../lib/asset';
import { ExternalLink, ArrowRight, Play } from 'lucide-react';
import { ScrollReveal } from '../components/PageTransition';

interface EventItem {
  title: string;
  description: string;
  type: string;
  link: string;
  image: string;
  imagePosition?: string;
  imageBg?: string;
}

const events: EventItem[] = [
  { title: "What's Harness Engineering?", description: 'Guest Post on Technically', type: 'Guest Post', link: 'https://read.technically.dev/p/whats-harness-engineering', image: asset('/media/harness-engineering-b756acd9.webp') },
  { title: 'DataTalksClub Podcast', description: 'Engineering Your Own AI Assistant', type: 'Podcast', link: 'https://www.youtube.com/watch?v=TDP3tIKxqlc', image: asset('/media/engineering-your-own-ai-assistant-595d4753.webp') },
  { title: "AI Engineer World's Fair", description: 'Turn 10,994 Notes Into Memory', type: 'Conference', link: 'https://www.youtube.com/watch?v=ZRM_TfEZcIo&t=96s', image: asset('/media/agent-memory-cda990fc.webp') },
  { title: 'Uphill Conf 2026', description: 'Agentic AI Engineering Bootcamp: Practical Workflows, Best Practices, AI Coding, and Live System Building', type: 'Conference', link: 'https://uphillconf.com/#workshops', image: asset('/media/img-6889-b14c45de.webp') },
  { title: 'TwoSetAI Podcast', description: 'The Real Reason Vibe Coding Works', type: 'Podcast', link: 'https://www.youtube.com/watch?v=BtY6hqNpMNk', image: asset('/media/twosetai-97a4a064.webp') },
  { title: 'Show Us Your (Agent) Skills', description: '', type: 'Talk', link: 'https://www.youtube.com/live/ud2WzkKeDZs', image: asset('/media/maxresdefault-a1f5b8b6.webp') },
  { title: 'AI Engineer Europe Workshop', description: 'Build a Deep Research Agent', type: 'Workshop', link: 'https://www.youtube.com/watch?v=mYSRn6PC1mc', image: asset('/media/ai-engineer-europe-386b58a0.webp') },
  { title: "O'Reilly AI Superstream: Context Engineering", description: 'Linking Memory to Context via Knowledge Graphs & Ontologies', type: 'Talk', link: 'https://www.oreilly.com/videos/ai-superstream-context/0642572273927/', image: asset('/media/screenshot-2026-04-22-at-12-30-11-57dca89c.webp') },
  { title: 'Build a Resilient Agentic System', description: "Guest Lecture on Abi Aryan's 'AI Systems Design & Inference Engineering' Course", type: 'Workshop', link: 'https://maven.com/goabiaryan/inferencing?promoCode=PAUL20', image: asset('/media/linking-memory-to-context-via-knowledge--7375796e.webp') },
  { title: 'AI Engineering: Skill Stack, Agents & LLMOps', description: 'From Software Development to Production-Grade AI Engineering.', type: 'Talk', link: 'https://www.youtube.com/watch?v=6bUO43k2lVU', image: asset('/media/maxresdefault-67c079d5.webp') },
  { title: "We Killed RAG, MCP & Agentic Loops. Here's What Happened.", description: 'A ZTRON Case Study on What It Really Takes to Build & Ship Vertical AI Agents.', type: 'Talk', link: 'https://www.decodingai.com/p/building-vertical-ai-agents-case-study-1', image: asset('/media/image-1-e8fbbba6.webp'), imagePosition: 'object-top' },
  { title: 'Q&A: AI Coding Tools and Vibe-Coding', description: 'A candid Q&A on AI coding tools and where vibe-coding really fits.', type: 'Talk', link: 'https://www.youtube.com/watch?v=r6l6-JY7jvw&t=5s', image: asset('/media/maxresdefault-ea489ce9.webp') },
  { title: 'Want to Learn AI Engineering? BUILD This Game', description: 'Learn AI engineering by building a production-grade game.', type: 'Talk', link: 'https://www.youtube.com/watch?v=7ZLkTMCNBoc', image: asset('/media/maxresdefault-1-319846c7.webp') },
  { title: 'Open Data Science Conference (ODSC) 2025', description: 'LLM & RAG Evaluation Playbook for Production Apps', type: 'Conference', link: 'https://www.youtube.com/watch?v=hcJYNvdFxIk', image: asset('/media/maxresdefault-1-a6241f3c.webp') },
  { title: 'Convergence (by Comet) Webinar', description: 'LLM & RAG Evaluation Playbook for Production Apps', type: 'Workshop', link: 'https://www.youtube.com/watch?v=X5AcIZyzGMo&list=PLX9GmL8cVn_wAlpsrMGW64dA9wmvNrotH&index=18', image: asset('/media/maxresdefault-2-d259a57d.webp') },
  { title: 'How AI is Built Podcast', description: '#050 Bringing LLMs to Production: Delete Frameworks, Avoid Finetuning, Ship Faster', type: 'Podcast', link: 'https://open.spotify.com/episode/0AiYDU3bo62B6pWD0VTzN7?nd=1&dlsi=c871bf5256fa40d9', image: asset('/media/untitled-design-1-d726eda1.webp'), imagePosition: 'object-contain scale-110', imageBg: 'bg-[#1a1a2e]' },
  { title: 'QCON London 2025 Conference', description: 'The Data Backbone of LLM Systems — top 5 QCon presentations of 2025', type: 'Conference', link: 'https://www.infoq.com/presentations/llm-data-code-model-prompt/', image: asset('/media/3cbba6ba-402a-40c0-95fe-ca33ec583071-1-1-83affe59.webp') },
  { title: 'DataCamp Podcast', description: '#300 End to End AI Application Development with Maxime Labonne & Paul Iusztin', type: 'Podcast', link: 'https://www.youtube.com/watch?v=hdYpCPHLgJw', image: asset('/media/maxresdefault-f6248f8f.webp') },
  { title: 'DataCamp Webinar', description: 'Building an AI Note-taking Application', type: 'Workshop', link: 'https://www.youtube.com/watch?v=n9sAjDRUwh8', image: asset('/media/maxresdefault-3d62d8ca.webp') },
  { title: 'Marvelous MLOps Webinar', description: 'Architecting LLM & RAG Systems', type: 'Workshop', link: 'https://www.youtube.com/watch?v=bwgIomw3KBM', image: asset('/media/maxresdefault-1-03a2eb20.webp') },
  { title: 'Bitswired Podcast', description: 'LLMOps, RAG & Building a Second Brain with AI', type: 'Podcast', link: 'https://www.youtube.com/watch?v=mMsMxjyBEig&t=1s', image: asset('/media/maxresdefault-2-77eede71.webp') },
  { title: 'Founders Hub Berlin Podcast', description: '#19 The Truth About LLMOps and Building Real AI Systems', type: 'Podcast', link: 'https://www.youtube.com/watch?v=L4VTkPUBk38', image: asset('/media/maxresdefault-3-b8f97d5d.webp') },
  { title: 'The Data Entrepreneurs Podcast', description: '#11 How to Build End-to-End LLM Solutions', type: 'Podcast', link: 'https://www.youtube.com/watch?v=3u6M_CdAeWw', image: asset('/media/maxresdefault-4-74a4f871.webp') },
  { title: 'The Data Entrepreneurs Workshop', description: "LLM Engineer's Handbook: From Theory to Production", type: 'Workshop', link: 'https://www.youtube.com/watch?v=6WmPfKPmoz0', image: asset('/media/maxresdefault-2f377ade.webp') },
];

const STEP = 9;

/** Whether a link points at watchable/listenable media → play button + "Watch now". */
const isWatchable = (url: string) => /youtube\.com|youtu\.be|spotify\.com|vimeo\.com/i.test(url);

function EventCard({ event }: { event: EventItem }) {
  return (
    <a href={event.link} target="_blank" rel="noopener noreferrer" className="group card card-hover overflow-hidden flex flex-col h-full">
      <div className={`relative aspect-video overflow-hidden ${event.imageBg || 'bg-brand-black1'}`}>
        <img src={event.image} alt={event.title} loading="lazy" className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${event.imagePosition || ''}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center shadow-lg shadow-black/40 scale-90 group-hover:scale-100 transition-transform">
            <Play size={22} className="text-white ml-0.5" fill="#fff" strokeWidth={0} />
          </div>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-bold text-brand-white group-hover:text-brand-orange transition-colors text-sm leading-snug">{event.title}</h3>
          <ExternalLink size={14} className="text-brand-black1 group-hover:text-brand-orange transition-colors flex-shrink-0 mt-0.5" />
        </div>
        {event.description && <p className="text-xs text-brand-grey leading-relaxed mt-auto">{event.description}</p>}
      </div>
    </a>
  );
}

export default function Events() {
  const featured = events[0];
  const rest = events.slice(1);
  const [shown, setShown] = useState(STEP);
  const visible = rest.slice(0, shown);
  const remaining = rest.length - shown;

  return (
    <div className="pt-24">
      <section className="page-header">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">Events &amp; Talks</h1>
          <p className="text-xl text-white/80">Sharing the knowledge.</p>
        </div>
      </section>

      {/* Featured / latest */}
      <section className="pt-16 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <a href={featured.link} target="_blank" rel="noopener noreferrer" className="group card card-hover overflow-hidden grid lg:grid-cols-2">
              <div className="relative aspect-video overflow-hidden bg-brand-black1">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {isWatchable(featured.link) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center shadow-lg shadow-black/40 group-hover:scale-110 transition-transform">
                      <Play size={26} fill="#fff" strokeWidth={0} />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center gap-4">
                <span className="text-xs uppercase tracking-widest text-brand-orange font-bold">Latest</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-brand-white group-hover:text-brand-orange transition-colors leading-tight">{featured.title}</h2>
                <p className="text-brand-grey leading-relaxed line-clamp-2">{featured.description}</p>
                <span className="inline-flex items-center gap-2 text-brand-red font-semibold text-sm pt-1">{isWatchable(featured.link) ? 'Watch now' : 'Learn more'}<ArrowRight size={15} /></span>
              </div>
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((e, idx) => (
              <ScrollReveal key={e.title} delay={(idx % 3) * 90}>
                <EventCard event={e} />
              </ScrollReveal>
            ))}
          </div>
          {remaining > 0 && (
            <div className="flex justify-center mt-12">
              <button onClick={() => setShown((n) => n + STEP)} className="btn btn-ghost px-7 py-3.5">
                Show {Math.min(STEP, remaining)} more
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
