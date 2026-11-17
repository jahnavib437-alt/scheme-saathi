import { useState, useRef, useCallback, useEffect } from 'react';

const LANG_MAP = {
  en: 'en-IN',
  kn: 'kn-IN',
  hi: 'hi-IN',
};

export function useSpeechRecognition({ lang = 'en', onResult, onError } = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SpeechRecognition);
  }, []);

  const start = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError?.('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = LANG_MAP[lang] || 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t;
        } else {
          interim += t;
        }
      }
      setTranscript(final || interim);
      if (final) onResult?.(final);
    };

    recognition.onerror = (event) => {
      setListening(false);
      onError?.(event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [lang, onResult, onError]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, transcript, supported, start, stop };
}

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const speak = useCallback((text, lang = 'en-IN') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.9;
    utter.pitch = 1;

    // Try to find a voice for the language; fall back gracefully
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang.startsWith(lang.split('-')[0]));
    if (match) utter.voice = match;

    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);

    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return { speaking, speak, stop };
}
