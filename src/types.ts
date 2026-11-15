export interface Note {
  id: string
  title: string
  body: string
  tag: string
  pinned: boolean
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  done: boolean
  when: 'today' | 'upcoming'
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  at: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  updatedAt: string
}

export interface Profile {
  name: string
  email: string
  bio: string
  avatar: string | null
}

export type Theme = 'light' | 'dark' | 'system'

export interface Settings {
  theme: Theme
  language: string
  sound: boolean
  volume: number
  lockOnStart: boolean
  shareUsage: boolean
}
