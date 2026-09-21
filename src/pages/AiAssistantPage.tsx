import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Bot, Send, User } from 'lucide-react'
import { useAuth } from '../app/AuthContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Textarea } from '../components/ui/Field'
import { Spinner } from '../components/ui/Spinner'
import { AiNotConfiguredError, askStudyAssistant, isAiConfigured } from '../services/aiService'
import { logAnalyticsEvent } from '../services/analyticsService'
import { listAiChatsForUser, saveAiChat } from '../services/firestoreService'
import type { AiChat } from '../types/models'

const SUGGESTED_PROMPTS = [
  'Explain Firebase Cloud Functions in simple English.',
  'Create five quiz questions about Firebase Authentication.',
  'Summarize this lesson in simple English.',
  'Give me a study plan for this week.',
]

interface ChatTurn {
  id: string
  prompt: string
  response: string
}

export function AiAssistantPage() {
  const { profile, firebaseConfigured } = useAuth()
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notConfigured, setNotConfigured] = useState(!isAiConfigured())
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!profile || !firebaseConfigured) return
    listAiChatsForUser(profile.uid).then((chats: AiChat[]) => {
      setTurns(chats.map((chat) => ({ id: chat.id, prompt: chat.prompt, response: chat.response })))
    })
  }, [profile, firebaseConfigured])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns])

  async function sendPrompt(prompt: string) {
    if (!prompt.trim() || isSending) return
    setIsSending(true)
    setError(null)
    logAnalyticsEvent('ai_question_asked')
    try {
      const result = await askStudyAssistant(prompt)
      setTurns((prev) => [...prev, { id: `${Date.now()}`, prompt, response: result.text }])
      setInput('')
      if (profile) {
        await saveAiChat({ userId: profile.uid, prompt, response: result.text })
      }
    } catch (err) {
      if (err instanceof AiNotConfiguredError) {
        setNotConfigured(true)
      } else {
        setError(err instanceof Error ? err.message : 'The AI Study Assistant could not respond.')
      }
    } finally {
      setIsSending(false)
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    sendPrompt(input)
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-navy-950">
          <Bot size={20} aria-hidden="true" /> AI Study Assistant
        </h1>
        <p className="mt-1 text-sm text-amber-700">
          AI-generated content can be inaccurate. Verify important academic information.
        </p>
      </div>

      {notConfigured ? (
        <Card>
          <p className="text-sm text-slate-600">
            The AI Study Assistant is not configured in this environment. Configure Firebase AI Logic
            and its required credentials to enable this feature.
          </p>
        </Card>
      ) : (
        <>
          <Card className="flex flex-1 flex-col">
            <div ref={scrollRef} className="max-h-[50vh] flex-1 space-y-4 overflow-y-auto pr-1">
              {turns.length === 0 && (
                <p className="text-sm text-slate-400">Ask a question to get started.</p>
              )}
              {turns.map((turn) => (
                <div key={turn.id} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User size={16} className="mt-0.5 text-slate-400" aria-hidden="true" />
                    <p className="text-sm text-navy-950">{turn.prompt}</p>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-firebase-blue-500/5 p-3">
                    <Bot size={16} className="mt-0.5 text-firebase-blue-600" aria-hidden="true" />
                    <p className="whitespace-pre-wrap text-sm text-navy-900">{turn.response}</p>
                  </div>
                </div>
              ))}
              {isSending && <Spinner label="Waiting for AI response" />}
            </div>
          </Card>

          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendPrompt(prompt)}
                disabled={isSending}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-firebase-blue-400 hover:text-firebase-blue-700 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI Study Assistant a question…"
              rows={2}
              disabled={isSending}
              className="flex-1"
            />
            <Button type="submit" disabled={isSending || !input.trim()} isLoading={isSending}>
              <Send size={16} aria-hidden="true" />
            </Button>
          </form>
        </>
      )}
    </div>
  )
}
