import type { Message } from '../types'

// Where replies come from
// 1. If VITE_AI_ENDPOINT is set (in a .env file), the chat sends the conversation to
//    YOUR backend and shows the `reply` it returns:
//        POST { language: 'en' | 'fil' | 'es', messages: [{ role, text }] }
//        →    { reply: string }
//    Keep your AI provider's secret key on that backend. Never put it in this app.
// 2. Otherwise (or if the backend fails) a built-in companion answers on this device
//    using simple keyword rules. It is not a real AI, but it keeps the chat working.

type Lang = 'en' | 'fil' | 'es'
type Mood = 'anxious' | 'stress' | 'sad' | 'angry' | 'tired' | 'grateful' | 'happy'

interface Pack {
  crisis: RegExp
  greet: RegExp
  thanks: RegExp
  /** Positive words that are negated, e.g. "not happy", count as sad. */
  negated: RegExp
  moods: Record<Mood, RegExp>
  replies: Record<Mood | 'crisis' | 'greet' | 'thanks' | 'question' | 'short' | 'fallback', string[]>
}

const rx = (words: string[]) => new RegExp(`\\b(?:${words.join('|')})`, 'i')

const packs: Record<Lang, Pack> = {
  en: {
    crisis: rx(['suicid', 'kill myself', 'end my life', 'want to die', 'wanna die', 'hurt myself', 'self.?harm', 'end it all']),
    greet: rx(['hi\\b', 'hello', 'hey\\b', 'good (?:morning|afternoon|evening)']),
    thanks: rx(['thank']),
    negated: rx(["(?:not|never|isn't|wasn't|don't feel|didn't feel) (?:really |very |so )?(?:happy|great|good|glad|okay|ok\\b)"]),
    moods: {
      anxious: rx(['anxi', 'worr', 'nervous', 'scared', 'afraid', 'panic', 'dread']),
      stress: rx(['stress', 'overwhelm', 'deadline', 'pressur', 'behind\\b', 'too much', 'swamped', 'busy']),
      sad: rx(['sad', 'cry', 'cried', 'depress', 'lonel', 'heartbr', 'disappoint', 'grief', 'miss(?:ed|ing)? (?:him|her|them|you|home)']),
      angry: rx(['angry', 'anger', 'mad at', 'furious', 'annoy', 'irritat', 'frustrat', 'hate', 'upset']),
      tired: rx(['tired', 'exhaust', 'sleepy', 'drain', 'burn(?:ed|t)? out', 'no energy', "can'?t sleep", 'insomnia']),
      grateful: rx(['grateful', 'thankful', 'appreciat', 'blessed']),
      happy: rx(['happy', 'glad', 'excited', 'great', 'good day', 'proud', 'love', 'fun\\b', 'wonderful', 'amazing', 'relieved', 'peaceful', 'calm']),
    },
    replies: {
      anxious: [
        'It makes sense to feel on edge about that. What’s the thought that keeps coming back?',
        'Thank you for putting the worry into words. What’s the hardest part of it?',
        'Let’s slow down for a second. What do you know for sure right now, and what are you guessing?',
      ],
      stress: [
        'That sounds like a lot to carry at once. If you could set one thing down for tonight, what would it be?',
        'Feeling stretched like that is exhausting. What’s the one thing that would make tomorrow feel lighter?',
        'I can hear the pressure in that. Which part of it is actually in your control right now?',
      ],
      sad: [
        'I’m sorry it hurt. Do you want to tell me more about what happened, or just stay with it for a moment?',
        'That sounds really heavy. What do you wish someone understood about it?',
        'Thank you for being honest about how you feel. What would feel like a small kindness to yourself right now?',
      ],
      angry: [
        'That would frustrate a lot of people. What did you need in that moment that you didn’t get?',
        'Sounds like something crossed a line for you. What matters most to you in this situation?',
        'It’s okay to feel angry about that. What would you say if nobody would be hurt by it?',
      ],
      tired: [
        'You sound worn out. Have you had a chance to rest today, even for ten minutes?',
        'Being drained like that is a signal worth listening to. What’s been taking the most energy lately?',
        'That sounds exhausting. What’s one thing you could skip or delay so you can recover?',
      ],
      grateful: [
        'That’s a lovely thing to notice. What made you feel most thankful?',
        'Writing down gratitude helps it last. Is there anyone you’d like to tell?',
        'Thank you for sharing that. What else from today deserves a mention?',
      ],
      happy: [
        'I love hearing that. What made it feel so good?',
        'That’s a nice thing to have written down. Who or what would you like to remember from it?',
        'That sounds like a bright spot. What would help you have more days like this?',
      ],
      crisis: [
        'I’m really glad you told me, and I’m sorry it hurts this much. You don’t have to carry this alone. Please reach out to someone you trust, or to a crisis line or emergency number where you live, right now. Is there someone who can be with you?',
      ],
      greet: ['Hi, I’m glad you’re here. How has your day been so far?', 'Hello! What’s on your mind today?'],
      thanks: ['You’re welcome. Anything else you’d like to write down?', 'Anytime. I’m here whenever you want to continue.'],
      question: [
        'That’s a good question. What’s your own first instinct about it?',
        'I can’t look things up here, but I can help you think it through. What have you considered so far?',
      ],
      short: ['Tell me a little more. What happened next?', 'I’m listening. Can you say a bit more about that?'],
      fallback: [
        'Thanks for writing that down. What stood out most to you about it?',
        'I’ve saved that in this conversation. How did it make you feel?',
        'I see. What part of that would you like to remember a month from now?',
        'Go on, I’m listening. What happened after that?',
      ],
    },
  },

  fil: {
    crisis: rx(['magpakamatay', 'ayoko na(?:ng)? mabuhay', 'ayaw ko na(?:ng)? mabuhay', 'gusto ko na(?:ng)? mamatay', 'wakasan ang buhay', 'saktan (?:ko )?ang sarili', 'patayin ang sarili']),
    greet: rx(['kumusta', 'kamusta', 'musta', 'hello', 'hi\\b', 'magandang (?:umaga|hapon|gabi|araw)']),
    thanks: rx(['salamat']),
    negated: rx(['(?:hindi|di|ayaw) (?:ako )?(?:masaya|okay|ok\\b|maganda)']),
    moods: {
      anxious: rx(['kabado', 'kinakabahan', 'nag-?aalala', 'worry', 'takot', 'natatakot', 'nerbyos', 'anxi']),
      stress: rx(['stress', 'overwhelm', 'deadline', 'napakarami', 'sobrang dami', 'nahuhuli', 'busy', 'abala', 'pressure']),
      sad: rx(['malungkot', 'lungkot', 'umiyak', 'iyak', 'nasaktan', 'masakit', 'namimiss', 'nami-?miss', 'miss ko', 'mag-?isa', 'nadismaya', 'dismaya', 'depress']),
      angry: rx(['galit', 'inis', 'naiinis', 'bad ?trip', 'asar', 'nakakainis', 'suklam', 'frustrat']),
      tired: rx(['pagod', 'napagod', 'antok', 'puyat', 'ubos', 'walang lakas', '(?:hindi|di) makatulog']),
      grateful: rx(['pasasalamat', 'nagpapasalamat', 'salamat', 'thankful', 'grateful', 'biyaya', 'blessed']),
      happy: rx(['masaya', 'natuwa', 'tuwa', 'excited', 'proud', 'maganda ang araw', 'nakakatuwa', 'payapa', 'kalma']),
    },
    replies: {
      anxious: [
        'Naiintindihan kong kinakabahan ka tungkol diyan. Ano ang kaisipang paulit-ulit na bumabalik?',
        'Salamat sa pagsasabi ng nararamdaman mo. Ano ang pinakamahirap na bahagi nito?',
        'Dahan-dahan lang muna tayo. Ano ang sigurado mo ngayon, at ano ang hinuha mo lang?',
      ],
      stress: [
        'Parang napakabigat nito para sa isang araw. Kung may isang bagay kang maibababa ngayong gabi, ano iyon?',
        'Nakakapagod talaga kapag ganyan kadami ang iniisip. Ano ang isang bagay na magpapagaan ng bukas?',
        'Ramdam ko ang pressure diyan. Alin sa mga iyan ang kaya mong kontrolin ngayon?',
      ],
      sad: [
        'Pasensya na at nasaktan ka. Gusto mo bang ikuwento pa kung ano ang nangyari, o samahan ka lang muna ako rito?',
        'Mukhang mabigat talaga iyan. Ano ang gusto mong maintindihan ng ibang tao tungkol dito?',
        'Salamat sa pagiging tapat sa nararamdaman mo. Ano ang maliit na kabutihang maibibigay mo sa sarili mo ngayon?',
      ],
      angry: [
        'Nakakainis nga iyan. Ano ang kailangan mo noon na hindi mo nakuha?',
        'Parang may bagay na tumawid sa hangganan mo. Ano ang pinakamahalaga sa iyo sa sitwasyong ito?',
        'Okay lang na magalit ka diyan. Ano ang gusto mong sabihin kung walang masasaktan?',
      ],
      tired: [
        'Mukhang pagod na pagod ka. Nakapagpahinga ka na ba ngayong araw, kahit sampung minuto lang?',
        'Mahalagang pakinggan ang pagod na ganyan. Ano ang pinakakumakain ng lakas mo nitong mga nakaraang araw?',
        'Nakakaubos nga iyan. Ano ang isang bagay na puwede mong ipagpaliban para makabawi ka?',
      ],
      grateful: [
        'Napakagandang mapansin iyan. Ano ang pinakanagpasalamat sa iyo?',
        'Mas tumatagal ang pasasalamat kapag isinusulat. May gusto ka bang pasalamatan nang personal?',
        'Salamat sa pagbabahagi. Ano pang bagay ngayong araw ang karapat-dapat banggitin?',
      ],
      happy: [
        'Ang saya naman nito! Ano ang nagpasaya sa iyo nang ganito?',
        'Magandang isulat ito para maalala mo. Sino o ano ang gusto mong tandaan mula rito?',
        'Mukhang magandang bahagi ito ng araw mo. Ano ang makatutulong para madagdagan pa ang ganitong mga araw?',
      ],
      crisis: [
        'Salamat sa pagsasabi sa akin, at pasensya na kung ganito kasakit. Hindi mo kailangang pasanin ito nang mag-isa. Pakiusap, makipag-ugnayan ka ngayon sa taong pinagkakatiwalaan mo, o sa crisis hotline o emergency number sa inyong lugar. Mayroon bang makakasama mo ngayon?',
      ],
      greet: ['Kumusta! Masaya akong nandito ka. Kumusta ang araw mo hanggang ngayon?', 'Hello! Ano ang laman ng isip mo ngayon?'],
      thanks: ['Walang anuman. May gusto ka pa bang isulat?', 'Wala iyon. Nandito lang ako kapag gusto mong magpatuloy.'],
      question: [
        'Magandang tanong iyan. Ano ang unang pakiramdam mo tungkol dito?',
        'Hindi ako makapaghahanap ng sagot dito, pero matutulungan kitang pag-isipan ito. Ano na ang naisip mo?',
      ],
      short: ['Ikuwento mo pa nang kaunti. Ano ang sumunod na nangyari?', 'Nakikinig ako. Puwede mo bang dagdagan ang sinabi mo?'],
      fallback: [
        'Salamat sa pagsulat nito. Ano ang pinakanatatandaan mo rito?',
        'Naitala ko na iyan sa usapang ito. Ano ang naramdaman mo?',
        'Ganoon pala. Ano ang gusto mong maalala tungkol dito pagkalipas ng isang buwan?',
        'Sige, nakikinig ako. Ano ang nangyari pagkatapos?',
      ],
    },
  },

  es: {
    crisis: rx(['suicid', 'quitarme la vida', 'quiero morir', 'acabar con mi vida', 'hacerme dano', 'lastimarme', 'no quiero vivir']),
    greet: rx(['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'que tal']),
    thanks: rx(['gracias']),
    negated: rx(['no (?:me siento|estoy) (?:muy |tan )?(?:bien|feliz|contento|contenta)']),
    moods: {
      anxious: rx(['ansied', 'ansios', 'preocup', 'nervios', 'miedo', 'asustad', 'panico', 'angusti']),
      stress: rx(['estres', 'agobi', 'abrum', 'presion', 'fecha limite', 'demasiado', 'atrasad', 'ocupad']),
      sad: rx(['triste', 'llor', 'deprim', 'me siento sol[oa]\\b', 'estoy sol[oa]\\b', 'dolor', 'decepcion', 'desanim', 'extrano a']),
      angry: rx(['enoj', 'molest', 'furios', 'rabia', 'frustr', 'harto', 'harta', 'odio']),
      tired: rx(['cansad', 'cansanc', 'agotad', 'agotamiento', 'sin energia', 'no puedo dormir', 'insomnio', 'rendid']),
      grateful: rx(['agradec', 'gracias', 'bendecid']),
      happy: rx(['feliz', 'content', 'alegr', 'emocionad', 'orgullos', 'genial', 'maravill', 'tranquil', 'aliviad', 'divertid']),
    },
    replies: {
      anxious: [
        'Es comprensible sentirse inquieto por eso. ¿Cuál es el pensamiento que sigue volviendo?',
        'Gracias por poner la preocupación en palabras. ¿Cuál es la parte más difícil?',
        'Vayamos más despacio un momento. ¿Qué sabes con certeza ahora y qué estás suponiendo?',
      ],
      stress: [
        'Suena a mucho para cargar de una sola vez. Si pudieras soltar una sola cosa esta noche, ¿cuál sería?',
        'Sentirse al límite así agota. ¿Qué cosa haría que mañana se sintiera más ligero?',
        'Noto la presión en lo que cuentas. ¿Qué parte de todo esto sí depende de ti ahora mismo?',
      ],
      sad: [
        'Lamento que te doliera. ¿Quieres contarme más sobre lo que pasó, o prefieres quedarte un momento con ello?',
        'Suena muy pesado. ¿Qué te gustaría que los demás entendieran de esto?',
        'Gracias por contarme cómo te sientes. ¿Qué pequeño gesto amable podrías tener contigo ahora mismo?',
      ],
      angry: [
        'Eso frustraría a cualquiera. ¿Qué necesitabas en ese momento que no recibiste?',
        'Parece que algo cruzó un límite para ti. ¿Qué es lo que más te importa en esta situación?',
        'Está bien sentir enojo por eso. ¿Qué dirías si nadie fuera a salir lastimado?',
      ],
      tired: [
        'Suena a que estás sin energía. ¿Pudiste descansar hoy, aunque fueran diez minutos?',
        'Ese cansancio es una señal que vale la pena escuchar. ¿Qué te ha quitado más energía últimamente?',
        'Suena agotador. ¿Qué podrías dejar para después y así recuperarte?',
      ],
      grateful: [
        'Qué bonito que lo notes. ¿Qué fue lo que más agradeciste?',
        'Escribir la gratitud ayuda a que dure. ¿Hay alguien a quien quieras decírselo?',
        'Gracias por compartirlo. ¿Qué más de hoy merece una mención?',
      ],
      happy: [
        '¡Qué bueno leer eso! ¿Qué lo hizo sentir tan bien?',
        'Es bonito dejar esto por escrito. ¿Qué o a quién te gustaría recordar de este momento?',
        'Suena a un buen momento del día. ¿Qué te ayudaría a tener más días así?',
      ],
      crisis: [
        'Me alegra mucho que me lo hayas contado, y lamento que duela tanto. No tienes que cargar con esto en soledad. Por favor, acércate ahora mismo a alguien de confianza, o a una línea de crisis o al número de emergencias de tu zona. ¿Hay alguien que pueda estar contigo ahora?',
      ],
      greet: ['¡Hola! Me alegra que estés aquí. ¿Cómo va tu día?', '¡Hola! ¿Qué tienes en mente hoy?'],
      thanks: ['De nada. ¿Quieres escribir algo más?', 'Cuando quieras. Aquí estoy para seguir.'],
      question: [
        'Buena pregunta. ¿Cuál es tu primera intuición?',
        'Aquí no puedo buscar respuestas, pero puedo ayudarte a pensarlo. ¿Qué has considerado hasta ahora?',
      ],
      short: ['Cuéntame un poco más. ¿Qué pasó después?', 'Te escucho. ¿Puedes decir algo más sobre eso?'],
      fallback: [
        'Gracias por escribirlo. ¿Qué fue lo que más te llamó la atención?',
        'Lo guardé en esta conversación. ¿Cómo te hizo sentir?',
        'Ya veo. ¿Qué parte te gustaría recordar dentro de un mes?',
        'Sigue, te escucho. ¿Qué pasó después?',
      ],
    },
  },
}

const moodOrder: Mood[] = ['anxious', 'stress', 'sad', 'angry', 'tired', 'grateful', 'happy']

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’‘]/g, "'")
const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

/** Rotates through the variants so back-to-back replies don't repeat. */
const pick = (options: string[], seed: number) => options[seed % options.length]

/** Built-in companion: picks a caring follow-up based on keywords in the latest message. */
export function localReply(history: Message[], language: string): string {
  const pack = packs[(language in packs ? language : 'en') as Lang]
  const last = history.at(-1)?.text ?? ''
  const text = normalize(last)
  const seed = history.length
  const short = wordCount(text) <= 6

  if (pack.crisis.test(text)) return pick(pack.replies.crisis, seed)
  if (short && pack.thanks.test(text)) return pick(pack.replies.thanks, seed)
  if (short && pack.greet.test(text)) return pick(pack.replies.greet, seed)

  const mood = pack.negated.test(text) ? 'sad' : moodOrder.find((m) => pack.moods[m].test(text))
  if (mood) return pick(pack.replies[mood], seed)

  if (/[?¿]/.test(last)) return pick(pack.replies.question, seed)
  if (wordCount(text) < 4) return pick(pack.replies.short, seed)
  return pick(pack.replies.fallback, seed)
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Returns the assistant's reply for the conversation so far. Never throws. */
export async function getReply(history: Message[], language: string): Promise<string> {
  const endpoint = import.meta.env.VITE_AI_ENDPOINT as string | undefined
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, messages: history.map(({ role, text }) => ({ role, text })) }),
      })
      if (res.ok) {
        const data = (await res.json()) as { reply?: unknown }
        if (typeof data.reply === 'string' && data.reply.trim()) return data.reply
      }
    } catch {
      /* backend unreachable: fall back to the built-in companion */
    }
  }
  await delay(600 + Math.random() * 500)
  return localReply(history, language)
}
