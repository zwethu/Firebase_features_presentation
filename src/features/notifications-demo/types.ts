export interface DemoNotification {
  id: string
  recipientId: string
  type: string
  title: string
  message: string
  relatedId: string | null
  read: boolean
  createdAtMs: number
}
