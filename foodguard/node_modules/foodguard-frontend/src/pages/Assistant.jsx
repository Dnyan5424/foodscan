import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { api } from '../services/api'

const SUGGESTED = [
  {
    icon: '⌁',
    title: 'Expiry labels',
    question: 'How do I read an expiry label?',
  },
  {
    icon: '✦',
    title: 'Food adulteration',
    question: 'How can I identify possible adulteration?',
  },
  {
    icon: '↗',
    title: 'Report unsafe food',
    question: 'Where can I report unsafe food?',
  },
  {
    icon: '◈',
    title: 'Before buying',
    question: 'What should I check before buying packaged food?',
  },
]

const FALLBACK_RESPONSES = {
  'how do i read an expiry label':
    'Look for both the manufacturing date and expiry (or "best before") date. Check storage instructions too — some products are only safe within a certain temperature range even before the printed date.',

  'how can i identify possible adulteration':
    'Start with the Adulteration Guide for your specific food category — most have a simple home screening test. Keep in mind these are indicative only; lab testing gives a definitive answer.',

  'where can i report unsafe food':
    'You can use our Complaint Register to keep your own record and tracking ID, and also report directly to FSSAI’s Food Safety Connect portal — linked on the Government Resources page.',

  'what should i check before buying packaged food':
    'Check the expiry date, FSSAI license number, ingredient list, and whether the packaging is intact and unopened.',
}

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* ============================================================
   GUARDY RESPONSE
   Converts Markdown sections into beautiful information cards
============================================================ */

function GuardyResponse({ text }) {
  return (
    <div className="space-y-3">
      <ReactMarkdown
        components={{
          /* ==================================================
             HEADINGS / INFORMATION CARDS
          ================================================== */

          h3: ({ children }) => {
            const title = String(children)

            let type = 'default'

            if (
              title.includes('🔬') ||
              title.toLowerCase().includes('how to check') ||
              title.toLowerCase().includes('how to test') ||
              title.toLowerCase().includes('detection')
            ) {
              type = 'check'
            } else if (
              title.includes('👀') ||
              title.toLowerCase().includes('what to look') ||
              title.toLowerCase().includes('observation')
            ) {
              type = 'look'
            } else if (
              title.includes('⚠️') ||
              title.toLowerCase().includes('warning') ||
              title.toLowerCase().includes('important')
            ) {
              type = 'warning'
            } else if (
              title.includes('🧪') ||
              title.toLowerCase().includes('lab') ||
              title.toLowerCase().includes('confirmation')
            ) {
              type = 'lab'
            } else if (
              title.includes('✓') ||
              title.toLowerCase().includes('what to do') ||
              title.toLowerCase().includes('next steps')
            ) {
              type = 'action'
            } else if (
              title.includes('💡') ||
              title.toLowerCase().includes('tip')
            ) {
              type = 'tip'
            }

            const cardStyles = {
              check: {
                card: 'border-emerald-200/80 bg-emerald-50/75',
                icon: 'bg-emerald-100 text-emerald-700',
                iconText: '🔬',
                title: 'text-emerald-900',
              },

              look: {
                card: 'border-sky-200/80 bg-sky-50/75',
                icon: 'bg-sky-100 text-sky-700',
                iconText: '👀',
                title: 'text-sky-900',
              },

              warning: {
                card: 'border-amber-200/80 bg-amber-50/75',
                icon: 'bg-amber-100 text-amber-700',
                iconText: '⚠️',
                title: 'text-amber-900',
              },

              lab: {
                card: 'border-violet-200/80 bg-violet-50/75',
                icon: 'bg-violet-100 text-violet-700',
                iconText: '🧪',
                title: 'text-violet-900',
              },

              action: {
                card: 'border-green-200/80 bg-green-50/75',
                icon: 'bg-green-100 text-green-700',
                iconText: '✓',
                title: 'text-green-900',
              },

              tip: {
                card: 'border-blue-200/80 bg-blue-50/75',
                icon: 'bg-blue-100 text-blue-700',
                iconText: '💡',
                title: 'text-blue-900',
              },

              default: {
                card: 'border-white/80 bg-white/65',
                icon: 'bg-[#e5f1e7] text-[#286043]',
                iconText: '✦',
                title: 'text-[#214d36]',
              },
            }

            const style = cardStyles[type]

            const cleanTitle = title
              .replace(/^🔬\s*/u, '')
              .replace(/^👀\s*/u, '')
              .replace(/^⚠️\s*/u, '')
              .replace(/^🧪\s*/u, '')
              .replace(/^✓\s*/u, '')
              .replace(/^💡\s*/u, '')

            return (
              <div
                className={`
                  mt-4
                  overflow-hidden
                  rounded-[18px]
                  border
                  ${style.card}
                  shadow-[0_5px_20px_rgba(30,70,45,0.05)]
                  backdrop-blur-md
                `}
              >
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      text-sm
                      font-bold
                      ${style.icon}
                    `}
                  >
                    {style.iconText}
                  </div>

                  <h3
                    className={`
                      text-[11px]
                      font-extrabold
                      uppercase
                      tracking-[0.1em]
                      ${style.title}
                    `}
                  >
                    {cleanTitle}
                  </h3>
                </div>

                <div className="mx-4 h-px bg-black/[0.05]" />
              </div>
            )
          },

          /* ==================================================
             PARAGRAPHS
          ================================================== */

          p: ({ children }) => (
            <p className="my-2 text-[13px] leading-6 text-[#405047] sm:text-sm">
              {children}
            </p>
          ),

          /* ==================================================
             NUMBERED STEPS
          ================================================== */

          ol: ({ children }) => (
            <ol className="my-3 ml-5 list-decimal space-y-2 text-[13px] leading-6 text-[#405047] marker:font-bold marker:text-[#286043] sm:text-sm">
              {children}
            </ol>
          ),

          /* ==================================================
             BULLET LIST
          ================================================== */

          ul: ({ children }) => (
            <ul className="my-3 ml-5 list-disc space-y-2 text-[13px] leading-6 text-[#405047] marker:text-[#4d8061] sm:text-sm">
              {children}
            </ul>
          ),

          /* ==================================================
             LIST ITEM
          ================================================== */

          li: ({ children }) => (
            <li className="pl-1">
              {children}
            </li>
          ),

          /* ==================================================
             BOLD TEXT
          ================================================== */

          strong: ({ children }) => (
            <strong className="font-bold text-[#214d36]">
              {children}
            </strong>
          ),

          /* ==================================================
             ITALIC TEXT
          ================================================== */

          em: ({ children }) => (
            <em className="text-[#607068]">
              {children}
            </em>
          ),

          /* ==================================================
             QUOTE / IMPORTANT NOTE
          ================================================== */

          blockquote: ({ children }) => (
            <blockquote className="my-3 rounded-xl border-l-4 border-[#4c8062] bg-white/65 px-4 py-3 text-[13px] italic leading-6 text-[#526159] shadow-sm">
              {children}
            </blockquote>
          ),

          /* ==================================================
             HORIZONTAL DIVIDER
          ================================================== */

          hr: () => (
            <div className="my-4 h-px bg-black/[0.06]" />
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text:
        'Hi! I’m Guardy. 👋 I can help you understand food labels, expiry dates, adulteration, testing, and everyday food safety.',
      time: getTime(),
    },
  ])

  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)

  /* ============================================================
     SEND MESSAGE
  ============================================================ */

  async function send(text) {
    if (!text.trim() || thinking) return

    const cleanText = text.trim()

    const userMsg = {
      role: 'user',
      text: cleanText,
      time: getTime(),
    }

    setMessages((m) => [...m, userMsg])
    setInput('')
    setThinking(true)

    try {
      const { answer } = await api.askAssistant(cleanText)

      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: answer,
          time: getTime(),
        },
      ])
    } catch (err) {
      console.error('Assistant error:', err)

      const key = cleanText.toLowerCase()

      const reply =
        FALLBACK_RESPONSES[key] ||
        'That’s a great question. For more information, explore the Adulteration Guide or Awareness Hub.'

      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: reply,
          time: getTime(),
        },
      ])
    } finally {
      setThinking(false)
    }
  }

  /* ============================================================
     CLEAR CHAT
  ============================================================ */

  function clearChat() {
    setMessages([
      {
        role: 'assistant',
        text:
          'Hi! I’m Guardy. 👋 How can I help you with food safety today?',
        time: getTime(),
      },
    ])
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f8f3] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-14 lg:px-10 xl:px-12">

      {/* ======================================================
          BACKGROUND AMBIENT EFFECTS
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            -top-40
            -right-32
            h-[420px]
            w-[420px]
            rounded-full
            bg-emerald-200/30
            blur-3xl
          "
        />

        <div
          className="
            absolute
            top-[42%]
            -left-48
            h-[430px]
            w-[430px]
            rounded-full
            bg-lime-200/20
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-180px]
            right-[18%]
            h-[350px]
            w-[350px]
            rounded-full
            bg-green-100/40
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(#173c2a_1px,transparent_1px),linear-gradient(90deg,#173c2a_1px,transparent_1px)]
            [background-size:40px_40px]
          "
        />

      </div>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-6xl">

        {/* ====================================================
            TOP HEADER
        ==================================================== */}

        <header className="mb-8 flex items-center justify-between">

          <div className="flex items-center gap-4">

            {/* AI LOGO */}

            <div
              className="
                relative
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-[20px]
                bg-gradient-to-br
                from-[#275d43]
                to-[#123b29]
                text-white
                shadow-[0_12px_30px_rgba(25,75,48,0.22)]
              "
            >
              <span className="text-2xl font-semibold">
                ✦
              </span>

              <span
                className="
                  absolute
                  -bottom-1
                  -right-1
                  h-4
                  w-4
                  rounded-full
                  border-[3px]
                  border-[#f3f8f3]
                  bg-emerald-400
                "
              />
            </div>

            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-xl font-extrabold tracking-tight text-[#17251e] sm:text-2xl">
                  Guardy
                </h1>

                <span
                  className="
                    rounded-full
                    border
                    border-emerald-700/10
                    bg-white/60
                    px-2.5
                    py-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-[#286043]
                    backdrop-blur-md
                  "
                >
                  AI
                </span>

              </div>

              <div className="mt-1 flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <p className="text-xs text-[#718077]">
                  FoodGuard safety companion
                </p>

              </div>

            </div>

          </div>

          <button
            onClick={clearChat}
            className="
              hidden
              items-center
              gap-2
              rounded-full
              border
              border-white/70
              bg-white/50
              px-4
              py-2.5
              text-xs
              font-semibold
              text-[#68766e]
              shadow-sm
              backdrop-blur-xl
              transition
              hover:bg-white/80
              hover:text-[#245b40]
              sm:flex
            "
          >
            <span className="text-sm">↻</span>
            New chat
          </button>

        </header>

        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="mb-8 px-1 sm:px-2">

          <div
            className="
              mb-3
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-orange-200/60
              bg-orange-50/60
              px-3
              py-1.5
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-orange-600
              backdrop-blur-md
            "
          >
            <span>✦</span>
            AI food safety assistant
          </div>

          <h2
            className="
              max-w-2xl
              text-3xl
              font-extrabold
              leading-[1.08]
              tracking-[-0.035em]
              text-[#17251e]
              sm:text-4xl
              md:text-5xl
            "
          >
            Your intelligent
            <span className="text-[#286043]">
              {' '}food safety companion.
            </span>
          </h2>

          <p
            className="
              mt-4
              max-w-2xl
              text-sm
              leading-6
              text-[#718077]
              sm:text-base
            "
          >
            Ask Guardy about food labels, expiry dates, adulteration,
            testing, and everyday food safety.
          </p>

        </section>

        {/* ====================================================
            GLASS CHAT WINDOW
        ==================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[30px]
            border
            border-white/80
            bg-white/50
            shadow-[0_30px_90px_rgba(35,70,48,0.13)]
            backdrop-blur-2xl
            sm:rounded-[34px]
          "
        >

          {/* TOP HIGHLIGHT */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              h-px
              bg-white
            "
          />

          {/* ==================================================
              CHAT HEADER
          ================================================== */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-white/70
              bg-white/30
              px-5
              py-4
              backdrop-blur-xl
              sm:px-7
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-[14px]
                  bg-[#e5f1e7]
                  text-[#286043]
                  shadow-inner
                "
              >
                ✦
              </div>

              <div>

                <p className="text-sm font-bold text-[#1b2921]">
                  Guardy AI
                </p>

                <p className="mt-0.5 text-[10px] text-[#7a877f]">
                  Ask me anything about food safety
                </p>

              </div>

            </div>

            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-emerald-700/10
                bg-emerald-50/60
                px-3
                py-1.5
              "
            >

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[10px] font-semibold text-[#3e7657]">
                Online
              </span>

            </div>

          </div>

          {/* ==================================================
              MESSAGES
          ================================================== */}

          <div
            className="
              h-[430px]
              overflow-y-auto
              px-4
              py-6
              sm:h-[470px]
              sm:px-7
              sm:py-8
              md:h-[500px]
            "
          >

            <div className="flex flex-col gap-6">

              {messages.map((message, index) => {

                const isAssistant =
                  message.role === 'assistant'

                return (
                  <div
                    key={index}
                    className={`
                      flex
                      w-full
                      gap-3
                      ${
                        isAssistant
                          ? 'justify-start'
                          : 'justify-end'
                      }
                    `}
                  >

                    {/* ASSISTANT AVATAR */}

                    {isAssistant && (
                      <div
                        className="
                          mt-1
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-[13px]
                          border
                          border-white/80
                          bg-[#e4f0e6]
                          text-sm
                          text-[#286043]
                          shadow-sm
                        "
                      >
                        ✦
                      </div>
                    )}

                    <div
                      className={`
                        flex
                        max-w-[90%]
                        flex-col
                        sm:max-w-[84%]
                        ${
                          isAssistant
                            ? 'items-start'
                            : 'items-end'
                        }
                      `}
                    >

                      {/* MESSAGE BUBBLE */}

                      <div
                        className={
                          isAssistant
                            ? `
                              rounded-[20px]
                              rounded-tl-[7px]
                              border
                              border-white/80
                              bg-white/75
                              px-4
                              py-3.5
                              text-[#304038]
                              shadow-[0_6px_25px_rgba(30,70,45,0.06)]
                              backdrop-blur-xl
                              sm:px-5
                              sm:py-4
                            `
                            : `
                              rounded-[20px]
                              rounded-tr-[7px]
                              bg-[#234f39]
                              px-4
                              py-3.5
                              text-white
                              shadow-[0_8px_25px_rgba(25,75,48,0.18)]
                              sm:px-5
                              sm:py-4
                            `
                        }
                      >

                        {isAssistant ? (
                          <GuardyResponse
                            text={message.text}
                          />
                        ) : (
                          <p className="whitespace-pre-wrap text-[13px] leading-6 sm:text-sm">
                            {message.text}
                          </p>
                        )}

                      </div>

                      {/* TIME */}

                      <span
                        className="
                          mt-1.5
                          px-1
                          text-[9px]
                          text-[#8b968f]
                        "
                      >
                        {message.time}
                      </span>

                    </div>

                    {/* USER AVATAR */}

                    {!isAssistant && (
                      <div
                        className="
                          mt-1
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-[13px]
                          border
                          border-black/5
                          bg-white/80
                          text-xs
                          text-[#526159]
                          shadow-sm
                        "
                      >
                        You
                      </div>
                    )}

                  </div>
                )
              })}

              {/* =================================================
                  TYPING INDICATOR
              ================================================== */}

              {thinking && (
                <div className="flex items-start gap-3">

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-[13px]
                      border
                      border-white/80
                      bg-[#e4f0e6]
                      text-sm
                      text-[#286043]
                      shadow-sm
                    "
                  >
                    ✦
                  </div>

                  <div
                    className="
                      rounded-[20px]
                      rounded-tl-[7px]
                      border
                      border-white/80
                      bg-white/75
                      px-5
                      py-4
                      shadow-[0_6px_25px_rgba(30,70,45,0.06)]
                      backdrop-blur-xl
                    "
                  >

                    <div className="flex items-center gap-1.5">

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#47745b]" />

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#47745b] [animation-delay:150ms]" />

                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#47745b] [animation-delay:300ms]" />

                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* ==================================================
              SUGGESTIONS
          ================================================== */}

          <div className="px-4 pb-4 sm:px-7">

            <div className="mb-3 flex items-center gap-2">

              <span className="text-xs text-[#6f7d75]">
                ✦
              </span>

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#7b8780]
                "
              >
                Suggested questions
              </p>

            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">

              {SUGGESTED.map((item) => (

                <button
                  key={item.question}
                  type="button"
                  disabled={thinking}
                  onClick={() => send(item.question)}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    rounded-[18px]
                    border
                    border-white/80
                    bg-white/45
                    px-4
                    py-3.5
                    text-left
                    shadow-sm
                    backdrop-blur-xl
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-[#286043]/20
                    hover:bg-white/75
                    hover:shadow-[0_8px_25px_rgba(30,70,45,0.08)]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >

                  <span
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#e6f0e7]
                      text-sm
                      font-bold
                      text-[#286043]
                      transition
                      group-hover:scale-105
                    "
                  >
                    {item.icon}
                  </span>

                  <span className="min-w-0 flex-1">

                    <span className="block text-xs font-bold text-[#26372e]">
                      {item.title}
                    </span>

                    <span className="mt-0.5 block truncate text-[10px] text-[#7b8780]">
                      {item.question}
                    </span>

                  </span>

                  <span
                    className="
                      text-sm
                      text-[#9aa49e]
                      transition
                      group-hover:translate-x-0.5
                      group-hover:text-[#286043]
                    "
                  >
                    →
                  </span>

                </button>

              ))}

            </div>

          </div>

          {/* ==================================================
              INPUT AREA
          ================================================== */}

          <div
            className="
              border-t
              border-white/70
              bg-white/25
              p-4
              backdrop-blur-xl
              sm:p-5
            "
          >

            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="
                flex
                items-center
                gap-2
                rounded-[22px]
                border
                border-white/90
                bg-white/70
                p-1.5
                shadow-[0_10px_40px_rgba(30,70,45,0.10)]
                backdrop-blur-2xl
                transition-all
                duration-300
                focus-within:border-[#286043]/20
                focus-within:bg-white/85
                focus-within:shadow-[0_12px_45px_rgba(30,80,50,0.14)]
              "
            >

              <div className="pl-3 text-[#87938c]">
                ✦
              </div>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={thinking}
                placeholder="Ask Guardy anything..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-2
                  py-3
                  text-sm
                  text-[#24342b]
                  outline-none
                  placeholder:text-[#9aa49e]
                  disabled:cursor-not-allowed
                "
              />

              <button
                type="submit"
                disabled={!input.trim() || thinking}
                aria-label="Send message"
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-[16px]
                  bg-[#234f39]
                  text-lg
                  font-semibold
                  text-white
                  shadow-[0_8px_20px_rgba(25,75,48,0.20)]
                  transition-all
                  duration-200
                  hover:bg-[#173d2b]
                  hover:shadow-[0_10px_25px_rgba(25,75,48,0.25)]
                  active:scale-95
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                  disabled:shadow-none
                "
              >
                ↑
              </button>

            </form>

            <div className="mt-3 flex items-center justify-center gap-2">

              <span className="text-[9px] text-[#89948d]">
                Guardy can make mistakes
              </span>

              <span className="h-0.5 w-0.5 rounded-full bg-[#aeb6b1]" />

              <span className="text-[9px] text-[#89948d]">
                Verify important food-safety information
              </span>

            </div>

          </div>

        </section>

        {/* ====================================================
            MOBILE NEW CHAT
        ==================================================== */}

        <button
          onClick={clearChat}
          className="
            mx-auto
            mt-5
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/80
            bg-white/50
            px-4
            py-2.5
            text-xs
            font-semibold
            text-[#68766e]
            shadow-sm
            backdrop-blur-xl
            transition
            hover:bg-white/80
            hover:text-[#245b40]
            sm:hidden
          "
        >
          ↻ Start a new chat
        </button>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <p className="mt-6 text-center text-[10px] text-[#8a958e]">
          Powered by FoodGuard AI · Built for safer food choices
        </p>

      </div>
    </main>
  )
}