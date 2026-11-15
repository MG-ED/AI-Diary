import type { Conversation, Note, Profile, Settings, Task } from '../types'
import { isoDaysAgo } from '../lib/utils'

export const sampleProfile: Profile = { name: 'Kejiro', email: '', bio: '', avatar: null }

export const sampleSettings: Settings = {
  theme: 'system',
  language: 'en',
  sound: false,
  volume: 0.6,
  lockOnStart: false,
  shareUsage: false,
}

export const sampleNotes: Note[] = [
  { id: 'n1', title: 'Things to remember about this week', body: 'Finish the portfolio hero section.\nCall the printer about the thesis copies.', tag: 'Work', pinned: true, updatedAt: isoDaysAgo(0, 8) },
  { id: 'n2', title: 'Walk by the shore', body: 'The tide was low and the air smelled like rain. Want to do this every Sunday.', tag: 'Personal', pinned: false, updatedAt: isoDaysAgo(2) },
  { id: 'n3', title: 'Ideas for the diary app', body: 'Voice entries, a weekly summary, and a way to ask "what did I say about…".', tag: 'Ideas', pinned: false, updatedAt: isoDaysAgo(4) },
]

export const sampleTasks: Task[] = [
  { id: 't1', title: 'Write today’s entry', done: false, when: 'today' },
  { id: 't2', title: 'Reply to the group project chat', done: true, when: 'today' },
  { id: 't3', title: 'Buy a notebook for sketches', done: false, when: 'upcoming' },
]

export const sampleConversations: Conversation[] = [
  {
    id: 'c1',
    title: 'Rough day, better evening',
    updatedAt: isoDaysAgo(1, 21),
    messages: [
      { id: 'm1', role: 'user', text: 'Today was rough. The deadline moved up and I felt behind all afternoon.', at: isoDaysAgo(1, 20) },
      { id: 'm2', role: 'assistant', text: 'That sounds draining. What part of the deadline feels heaviest right now?', at: isoDaysAgo(1, 20) },
    ],
  },
  { id: 'c2', title: 'Plans for the weekend', updatedAt: isoDaysAgo(3, 18), messages: [{ id: 'm3', role: 'user', text: 'I want a slow weekend. Maybe the shore, maybe nothing.', at: isoDaysAgo(3, 18) }] },
]
