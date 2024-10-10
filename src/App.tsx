import React, { useState, useEffect, useCallback } from 'react'
import { Mic, MicOff, Globe, Copy, Check } from 'lucide-react'

type Language = 'en-US' | 'pl-PL'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [language, setLanguage] = useState<Language>('en-US')
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const speechRecognition = new webkitSpeechRecognition()
      speechRecognition.continuous = true
      speechRecognition.interimResults = true
      speechRecognition.lang = language

      speechRecognition.onresult = (event) => {
        let currentTranscript = ''
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript
        }
        setTranscript(currentTranscript)
      }

      setRecognition(speechRecognition)
    } else {
      console.error('Speech recognition not supported')
    }
  }, [language])

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognition?.stop()
    } else {
      recognition?.start()
    }
    setIsListening(!isListening)
  }, [isListening, recognition])

  const handleLanguageChange = (newLanguage: Language) => {
    if (isListening) {
      recognition?.stop()
      setIsListening(false)
    }
    setLanguage(newLanguage)
    setTranscript('')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Live Voice Transcription</h1>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={toggleListening}
            className={`px-4 py-2 rounded-full flex items-center ${
              isListening ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="mr-2" /> Stop Listening
              </>
            ) : (
              <>
                <Mic className="mr-2" /> Start Listening
              </>
            )}
          </button>
          <div className="flex items-center">
            <Globe className="mr-2 text-gray-500" />
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="bg-white border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="en-US">English</option>
              <option value="pl-PL">Polski</option>
            </select>
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg p-4 h-64 overflow-y-auto mb-4 relative">
          <p className="whitespace-pre-wrap">{transcript}</p>
          <button
            onClick={copyToClipboard}
            className={`absolute bottom-2 right-2 p-2 rounded-full ${
              isCopied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
            } transition-colors duration-300`}
            disabled={!transcript}
            title={isCopied ? 'Copied!' : 'Copy to Clipboard'}
          >
            {isCopied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App