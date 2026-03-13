import { useState, useEffect, useCallback, useRef } from 'react';
import AxiosInstance from '../components/Axios';

export const useSynthesis = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await AxiosInstance.get('chats/');
      setChatSessions(res.data);
      if (res.data.length > 0 && !activeSession) {
        setActiveSession(res.data[0].id_chat);
      }
    } catch (err) {
      console.error("Error sessions:", err);
    }
  }, [activeSession]);

  const fetchMessages = useCallback(async (sessionId) => {
    if (!sessionId) return;
    try {
      const res = await AxiosInstance.get(`historiales/?chat_id=${sessionId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error messages:", err);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (activeSession) fetchMessages(activeSession);
  }, [activeSession, fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleGenerate = useCallback(async (prompt) => {
    if (!prompt || loading) return;

    setLoading(true);
    try {
      const res = await AxiosInstance.post('historiales/generar/', {
        prompt: prompt,
        chat_id: activeSession
      });
      
      setMessages(prev => [res.data, ...prev]);
      
      if (!activeSession) {
        await fetchSessions();
      }
    } catch (err) {
      console.error("Error generate:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, activeSession, fetchSessions]);

  const handleNewSession = async () => {
    try {
      const res = await AxiosInstance.post('chats/', { nombre: "Nueva Secuencia" });
      setChatSessions(prev => [res.data, ...prev]);
      setActiveSession(res.data.id_chat);
      setMessages([]);
    } catch (err) {
      console.error("Error new chat:", err);
    }
  };

  const deleteSession = async (id) => {
    try {
      await AxiosInstance.delete(`chats/${id}/`);
      const updated = chatSessions.filter(s => s.id_chat !== id);
      setChatSessions(updated);
      if (activeSession === id) {
        setActiveSession(updated[0]?.id_chat || null);
      }
    } catch (err) {
      console.error("Error delete chat:", err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await AxiosInstance.delete(`historiales/${id}/`);
      setMessages(prev => prev.filter(m => m.id_historial !== id));
    } catch (err) {
      console.error("Error delete msg:", err);
    }
  };

  return {
    chatSessions,
    activeSession,
    setActiveSession,
    messages,
    loading,
    scrollRef,
    handleGenerate,
    handleNewSession,
    deleteSession,
    deleteMessage,
    fetchSessions
  };
};
