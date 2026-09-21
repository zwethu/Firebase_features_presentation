import { Link } from 'react-router-dom'
import { BookOpenCheck, Bot, GraduationCap, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const highlights = [
  {
    icon: Bot,
    title: 'AI Study Assistant',
    description: 'Ask questions, generate quiz prompts, and get study plans powered by Gemini via Firebase AI Logic.',
  },
  {
    icon: BookOpenCheck,
    title: 'Courses & assignments',
    description: 'Browse courses, submit PDF assignments to Cloud Storage, and track status in real time.',
  },
  {
    icon: ShieldCheck,
    title: 'Firebase-powered platform',
    description: 'Authentication, Firestore, Cloud Functions, Remote Config, and Security Rules working together.',
  },
]

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="flex items-center justify-between px-6 py-5 lg:px-12">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-firebase-blue-600 text-white">
            <GraduationCap size={18} aria-hidden="true" />
          </span>
          <span className="text-base font-semibold text-navy-950">StudyFlow AI</span>
        </div>
        <Link to="/login" className="text-sm font-medium text-firebase-blue-700 hover:underline">
          Sign in
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 py-10 text-center lg:py-20">
        <span className="mb-4 rounded-full bg-firebase-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-firebase-blue-700">
          Firebase live-demo build
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-navy-950 lg:text-5xl">
          An AI-powered learning platform, built to show Firebase in action
        </h1>
        <p className="mt-4 max-w-xl text-base text-slate-600">
          StudyFlow AI pairs an AI tutor, course and assignment workflows, and a full Firebase-powered
          backend into one small, reliable demo application.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/login">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/about-firebase">
            <Button size="lg" variant="secondary">
              View Firebase Architecture
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title} className="text-left">
              <item.icon className="text-firebase-blue-600" size={22} aria-hidden="true" />
              <h2 className="mt-3 text-sm font-semibold text-navy-950">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-200 px-6 py-6 text-center text-xs text-slate-500">
        Built for the Firebase: Core Features and 2026 Platform Update presentation.
      </footer>
    </div>
  )
}
