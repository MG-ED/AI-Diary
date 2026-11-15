// Placeholder auth layer. Nothing here talks to a server.
// Replace the bodies with Firebase Authentication (signInWithEmailAndPassword,
// createUserWithEmailAndPassword, signOut, onAuthStateChanged) when it is configured.
const KEY = 'ed-diary:session'

export interface Session {
  email: string
  name: string
}

export const getSession = (): Session | null => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? 'null') as Session | null
  } catch {
    return null
  }
}

// "Lock diary on start": the lock lasts for the browser tab's session only.
const UNLOCK = 'ed-diary:unlocked'
export const isUnlocked = () => sessionStorage.getItem(UNLOCK) === '1'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function signIn(email: string, name = '') {
  await wait(600)
  const session = { email, name: name || email.split('@')[0] }
  localStorage.setItem(KEY, JSON.stringify(session))
  sessionStorage.setItem(UNLOCK, '1')
  return session
}

export const signOut = () => {
  localStorage.removeItem(KEY)
  sessionStorage.removeItem(UNLOCK)
}
