import { type AI, GoogleAIBackend, getAI, getGenerativeModel } from 'firebase/ai'
import { app, isFirebaseConfigured } from './firebase'

const MODEL_NAME = 'gemini-2.5-flash'
export const MAX_PROMPT_LENGTH = 800

export class AiNotConfiguredError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AiNotConfiguredError'
  }
}

let aiInstance: AI | null = null
let configuredKnownGood = false

function getAiInstance(): AI {
  if (!isFirebaseConfigured || !app) {
    throw new AiNotConfiguredError(
      'The AI Study Assistant is not configured in this environment. Configure Firebase AI Logic and its required credentials to enable this feature.',
    )
  }
  if (!aiInstance) {
    aiInstance = getAI(app, { backend: new GoogleAIBackend() })
  }
  return aiInstance
}

/**
 * A shallow, cheap check the UI can use to decide whether to render the
 * fallback state. It does not guarantee a live call will succeed — Firebase
 * AI Logic must still be enabled in the Firebase console for the project.
 */
export function isAiConfigured(): boolean {
  return isFirebaseConfigured
}

export interface AskStudyAssistantResult {
  text: string
}

export async function askStudyAssistant(prompt: string): Promise<AskStudyAssistantResult> {
  const trimmed = prompt.trim()
  if (!trimmed) {
    throw new Error('Enter a question for the AI Study Assistant.')
  }
  if (trimmed.length > MAX_PROMPT_LENGTH) {
    throw new Error(`Keep questions under ${MAX_PROMPT_LENGTH} characters for this demo.`)
  }

  const ai = getAiInstance()
  const model = getGenerativeModel(ai, {
    model: MODEL_NAME,
    systemInstruction:
      'You are the StudyFlow AI Study Assistant, a concise and encouraging study helper for university ' +
      'students learning about Firebase and general coursework. Keep answers short, clear, and accurate. ' +
      'If asked to generate quiz questions, format them as a numbered list.',
  })

  try {
    const result = await model.generateContent(trimmed)
    configuredKnownGood = true
    return { text: result.response.text() }
  } catch (error) {
    if (!configuredKnownGood) {
      throw new AiNotConfiguredError(
        'The AI Study Assistant is not configured in this environment. Configure Firebase AI Logic and its required credentials to enable this feature.',
      )
    }
    throw error
  }
}
