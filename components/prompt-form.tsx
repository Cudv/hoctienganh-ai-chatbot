'use client'
import 'regenerator-runtime/runtime'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import analytics from '@/app/analyticsInstance'

import { useActions, useUIState } from 'ai/rsc'

import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconPlus, IconMicrophone, IconMicrophoneSlash } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { toast } from 'sonner'

export function PromptForm({
  input,
  setInput
}: {
  input: string
  setInput: (value: string) => void
}) {
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()

  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition()
  // if (!browserSupportsSpeechRecognition) {
    // return <span>Browser doesn&apos;t support speech recognition.</span>
  // }
  const microphoneOn = () => {
    SpeechRecognition.startListening({ continuous: true });
    // toast.success("Microphone On", { duration: 1500 })
  };

  const microphoneOff = () => {
    SpeechRecognition.stopListening();
    // toast.error("Microphone Off", { duration: 1500 })
  };

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  React.useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])
  React.useEffect(() => {
    if (input.trim().length == 0) {
      resetTranscript()
    }
  }, [input])

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()
        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return
        
        // sending user prompt to Segment
        analytics.track({
          userId: "123",
          event: "Message Sent",
          properties:{
            content:value,
            conversationId: window.localStorage.getItem('newChatId')
          }
        })

        resetTranscript()
        
        // Optimistically add user message UI
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])

        // Submit and get response message
        const responseMessage = await submitUserMessage(value)
        setMessages(currentMessages => [...currentMessages, responseMessage])
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            {/* <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-4 size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={() => {
                router.push('/')
              }}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </Button> */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-4 size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={!listening ? microphoneOn : microphoneOff}
            >
              {!listening ? <IconMicrophone /> : <IconMicrophoneSlash />}
              <span className="sr-only">New Speech</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Speech</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        {/* <input value={transcript} onChange={() => {inputRef.current.value = transcript}} name="transcript" id="transcript" /> */}
        <div className="absolute right-0 top-4 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={input === ''}>
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
