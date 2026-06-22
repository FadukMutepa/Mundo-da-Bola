/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Search, 
  Clock, 
  User, 
  PlusCircle, 
  Heart, 
  MessageSquare, 
  X, 
  ThumbsUp, 
  Calendar, 
  ChevronRight, 
  BookOpen, 
  Send, 
  Filter, 
  Sparkles,
  Camera,
  Flame,
  Check,
  AlertCircle,
  Upload,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryType, NewsArticle, Comment } from './types';
import { INITIAL_NEWS, CATEGORY_PRESETS, IMAGE_PRESETS } from './data';
import FootballImage from './components/FootballImage';
import { 
  db, 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  onSnapshot
} from './firebase';

// Helper function to compress and scale images on the client side to avoid Firestore document size limitations
const compressAndLoadImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Target maximum dimensions of 1000px for post display (very sharp yet lightweight)
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;
        
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Export as compressed jpeg with 0.7 quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function App() {
  // --- STATE ---
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // --- EDITOR FORM STATE ---
  const [formTitle, setFormTitle] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<Exclude<CategoryType, 'Todos'>>('Transferências');
  const [formImagePreset, setFormImagePreset] = useState(IMAGE_PRESETS[0].url);
  const [formCustomImage, setFormCustomImage] = useState('');
  const [formUploadedImage, setFormUploadedImage] = useState('');
  const [formUploadedName, setFormUploadedName] = useState('');
  const [imageSourceMode, setImageSourceMode] = useState<'preset' | 'upload' | 'url'>('preset');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formAuthor, setFormAuthor] = useState('');
  const [formReadTime, setFormReadTime] = useState('3 min');
  const [formIsHighlight, setFormIsHighlight] = useState(false);

  // --- DETAIL VIEW REACTION STATES ---
  const [commentName, setCommentName] = useState('');
  const [commentBody, setCommentBody] = useState('');

  // --- INITIALIZE NEWS FROM FIRESTORE OR RAW DATA ---
  useEffect(() => {
    const newsColRef = collection(db, 'news');
    const q = query(newsColRef, orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedNews: NewsArticle[] = [];
      snapshot.forEach((d) => {
        fetchedNews.push({ id: d.id, ...d.data() } as NewsArticle);
      });

      // Seeding validation: ensure all 12 preset news exist in the database, even if some are already there.
      // This is robust against incremental updates to INITIAL_NEWS.
      const existingIds = new Set(fetchedNews.map(item => item.id));
      const binMissing = INITIAL_NEWS.filter(item => !existingIds.has(item.id));
      
      if (binMissing.length > 0) {
        console.log(`Detectadas ${binMissing.length} notícias predefinidas ausentes no Firestore. Semeando dados...`);
        for (const article of binMissing) {
          try {
            await setDoc(doc(db, 'news', article.id), article);
          } catch (err) {
            console.error(`Erro ao semear notícia ${article.id}:`, err);
          }
        }
      }

      setNews(fetchedNews.length > 0 ? fetchedNews : INITIAL_NEWS);
      localStorage.setItem('futebol_news', JSON.stringify(fetchedNews.length > 0 ? fetchedNews : INITIAL_NEWS));

      // Keep current selected article state in sync if visible details are loaded
      if (selectedArticle) {
        const updatedSelected = fetchedNews.find(item => item.id === selectedArticle.id);
        if (updatedSelected) {
          setSelectedArticle(updatedSelected);
        }
      }
    }, (error) => {
      console.warn("Erro ao ler Firestore. Recorrendo a local storage offline:", error);
      const saved = localStorage.getItem('futebol_news');
      if (saved) {
        try {
          setNews(JSON.parse(saved));
        } catch (e) {
          setNews(INITIAL_NEWS);
        }
      } else {
        setNews(INITIAL_NEWS);
      }
    });

    return () => unsubscribe();
  }, [selectedArticle]);

  // Sync state helper to save offline as fallback
  const updateNewsList = (updatedList: NewsArticle[]) => {
    setNews(updatedList);
    localStorage.setItem('futebol_news', JSON.stringify(updatedList));
  };

  // Toast effect
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => {
        setSuccessToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // --- SEARCH AND FILTER FILTERING ---
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [news, selectedCategory, searchQuery]);

  // Get current highlight article
  const highlightArticle = useMemo(() => {
    const found = news.find(item => item.isHighlight);
    return found || news[0];
  }, [news]);

  // Feed items (excluding the highlight if looking at Todos tab)
  const feedNews = useMemo(() => {
    if (selectedCategory === 'Todos' && !searchQuery) {
      return filteredNews.filter(item => item.id !== highlightArticle?.id);
    }
    return filteredNews;
  }, [filteredNews, selectedCategory, searchQuery, highlightArticle]);

  // --- ACTIONS ---
  const handleLike = async (articleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const target = news.find(item => item.id === articleId);
    if (!target) return;
    
    const newLikesCount = target.likes + 1;
    
    // Optimistic UI Update
    const updatedLocally = news.map(item => {
      if (item.id === articleId) {
        const itemWithLike = { ...item, likes: newLikesCount };
        if (selectedArticle && selectedArticle.id === articleId) {
          setSelectedArticle(itemWithLike);
        }
        return itemWithLike;
      }
      return item;
    });
    setNews(updatedLocally);

    try {
      await updateDoc(doc(db, 'news', articleId), { likes: newLikesCount });
    } catch (err) {
      console.warn("Falha de rede para salvar like, sincronizado apenas localmente:", err);
      updateNewsList(updatedLocally);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !commentName.trim() || !commentBody.trim()) return;

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      author: commentName.trim(),
      content: commentBody.trim(),
      date: new Date().toISOString()
    };

    const newCommentsList = [newComment, ...selectedArticle.comments];
    
    // Optimistic UI Update
    const updatedArticle = { ...selectedArticle, comments: newCommentsList };
    setSelectedArticle(updatedArticle);
    
    const updatedGlobal = news.map(item => {
      if (item.id === selectedArticle.id) {
        return updatedArticle;
      }
      return item;
    });
    setNews(updatedGlobal);

    setCommentName('');
    setCommentBody('');

    try {
      await updateDoc(doc(db, 'news', selectedArticle.id), { comments: newCommentsList });
      setSuccessToast('Comentário enviado e debatido em tempo real!');
    } catch (err) {
      console.warn("Falha de rede para comentar, persistindo no cache local:", err);
      updateNewsList(updatedGlobal);
      setSuccessToast('Comentário publicado localmente!');
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSummary.trim() || !formContent.trim() || !formAuthor.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    let finalImage = formImagePreset;
    if (imageSourceMode === 'upload') {
      if (!formUploadedImage) {
        alert('Por favor, faça o upload de uma foto do seu dispositivo ou selecione outra opção!');
        return;
      }
      finalImage = formUploadedImage;
    } else if (imageSourceMode === 'url') {
      if (!formCustomImage.trim()) {
        alert('Por favor, insira o link de uma imagem externa da sua escolha ou selecione outra opção!');
        return;
      }
      finalImage = formCustomImage.trim();
    }

    const newArticle: NewsArticle = {
      id: `art-${Date.now()}`,
      title: formTitle.trim(),
      summary: formSummary.trim(),
      content: formContent.trim(),
      category: formCategory,
      image: finalImage,
      date: new Date().toISOString(),
      author: formAuthor.trim(),
      readTime: formReadTime,
      isHighlight: formIsHighlight,
      likes: 0,
      comments: []
    };

    try {
      // If marked as Highlight, reset other Highlights in Firestore
      if (formIsHighlight) {
        const highlightsToReset = news.filter(item => item.isHighlight);
        for (const highlightedItem of highlightsToReset) {
          try {
            await updateDoc(doc(db, 'news', highlightedItem.id), { isHighlight: false });
          } catch (resetErr) {
            console.error("Erro ao resetar destaque antigo no Firestore:", resetErr);
          }
        }
      }

      await setDoc(doc(db, 'news', newArticle.id), newArticle);
      setSuccessToast('Notícia de futebol publicada e guardada permanentemente!');
    } catch (err) {
      console.warn("Sem conexão com nuvem Firestore, gravando backup no cache local:", err);
      
      let updatedList = [...news];
      if (formIsHighlight) {
        updatedList = updatedList.map(item => ({ ...item, isHighlight: false }));
      }
      updatedList = [newArticle, ...updatedList];
      updateNewsList(updatedList);
      setSuccessToast('Notícia gravada e sincronizada offline no navegador!');
    }

    // Reset Form fields
    setFormTitle('');
    setFormSummary('');
    setFormContent('');
    setFormCategory('Transferências');
    setFormImagePreset(IMAGE_PRESETS[0].url);
    setFormCustomImage('');
    setFormUploadedImage('');
    setFormUploadedName('');
    setImageSourceMode('preset');
    setUploadError(null);
    setFormAuthor('');
    setFormReadTime('3 min');
    setFormIsHighlight(false);

    setIsEditorOpen(false);
    setSelectedCategory(formCategory);
  };

  // Helper to format ISO dates beautifully
  const formatPublishedDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return 'Recentemente';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" id="main_wrapper">
      
      {/* --- TOP HEADER (Navigation Bar) --- */}
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-emerald-950/40 text-white shadow-md transition-all" id="header_section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand/Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => { setSelectedArticle(null); setSelectedCategory('Todos'); setSearchQuery(''); }}
            id="brand_logo_container"
          >
            <div className="bg-emerald-600 p-2 rounded-xl text-white group-hover:bg-emerald-500 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-emerald-500/25">
              <Trophy className="w-6 h-6" id="logo_trophy" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight" id="logo_brand_title">
                MUNDO <span className="text-emerald-400">DA BOLA</span>
              </h1>
              <p className="hidden sm:block text-[10px] text-slate-400 font-mono tracking-widest uppercase" id="logo_subtitle">
                As melhores notícias do futebol
              </p>
            </div>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:flex items-center relative max-w-md w-full mx-8" id="header_search_container">
            <Search className="absolute left-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar notícias, clubes, análises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-full text-sm text-white placeholder-slate-400 transition-all outline-none"
              id="header_search_input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-0.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                title="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Button & Menu */}
          <div className="flex items-center space-x-3" id="navigation_actions">
            <button
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm active:scale-95"
              id="btn_publish_news"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar</span>
            </button>
          </div>

        </div>

        {/* Search drawer on mobile */}
        <div className="md:hidden border-t border-slate-900 bg-slate-950 px-4 py-3 flex items-center relative" id="mobile_search_row">
          <Search className="absolute left-7.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar por assunto futebolístico..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
            id="mobile_search_input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-7.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* --- NOTIFICATIONS POPUP --- */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-22 right-4 sm:right-6 z-55 max-w-md w-auto bg-emerald-900 border border-emerald-700 text-emerald-100 px-4 py-3.5 rounded-xl shadow-xl flex items-center space-x-3"
            id="toast_notification"
          >
            <div className="bg-emerald-800 p-1 rounded-full text-emerald-300">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm font-medium">{successToast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6" id="main_layout_frame">

        {/* --- CINEMATIC ARTICLE READING VIEW --- */}
        <AnimatePresence mode="wait">
          {selectedArticle ? (
            <motion.article
              key="detail_view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
              id="immersive_reading_article"
            >
              {/* Cover Banner */}
              <div className="relative h-60 sm:h-96 md:h-[420px] w-full" id="article_banner_box">
                <FootballImage 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title}
                  category={selectedArticle.category}
                  className="w-full h-full object-cover"
                  id="article_detail_image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                {/* Back button */}
                <button
                  onClick={() => { setSelectedArticle(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-800 px-4 py-2 rounded-full text-xs font-semibold tracking-wide flex items-center space-x-2 transition-all shadow active:scale-95"
                  id="btn_back_to_portal"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span>Voltar ao Portal</span>
                </button>

                {/* Cover Overlay Info details */}
                <div className="absolute bottom-6 left-6 right-6 text-white" id="article_cover_header">
                  <span className="inline-block bg-emerald-600 text-white font-mono uppercase text-[10px] sm:text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-3 shadow">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-xl sm:text-3xl lg:text-4xl font-display font-extrabold leading-tight tracking-tight max-w-4xl" id="article_detail_title">
                    {selectedArticle.title}
                  </h2>
                </div>
              </div>

              {/* Editorial Wrapper */}
              <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8" id="article_editorial_wrapper">
                
                {/* Authoring Info header */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-5 mb-8 text-xs sm:text-sm text-slate-500 gap-4" id="article_meta_row">
                  <div className="flex items-center space-x-3">
                    <div className="bg-emerald-50 text-emerald-800 font-display font-bold w-10 h-10 rounded-full flex items-center justify-center border border-emerald-100">
                      {selectedArticle.author[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800" id="article_author">{selectedArticle.author}</p>
                      <p className="text-[11px] text-slate-400 font-mono">Redação Esportiva</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-slate-400" id="article_stats_metaline">
                    <span className="flex items-center space-x-1.5 font-mono text-[11px] sm:text-xs">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{formatPublishedDate(selectedArticle.date)}</span>
                    </span>
                    <span className="flex items-center space-x-1.5 font-mono text-[11px] sm:text-xs">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{selectedArticle.readTime} de leitura</span>
                    </span>
                  </div>
                </div>

                {/* Article Intro Summary Box */}
                <div className="bg-slate-50 border-l-4 border-emerald-600 pl-4 py-3.5 mb-8 rounded-r-xl" id="article_intro_deck">
                  <p className="text-slate-600 font-sans italic text-sm sm:text-base leading-relaxed">
                    "{selectedArticle.summary}"
                  </p>
                </div>

                {/* Main Text Content */}
                <div className="prose max-w-none text-slate-800 leading-relaxed font-sans text-sm sm:text-base space-y-6" id="article_body_paragraphs">
                  {selectedArticle.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="whitespace-pre-line leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* React Panel: Likes & Interaction counter */}
                <div className="border-y border-slate-100 py-6 my-10 flex items-center justify-between" id="article_reaction_bar">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(selectedArticle.id)}
                      className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-4.5 py-2.5 rounded-full text-xs sm:text-sm transition-all focus:ring-2 focus:ring-emerald-200 active:scale-95"
                      id="btn_like_interactive"
                      title="Curtir notícia"
                    >
                      <Heart className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                      <span>{selectedArticle.likes} Gostaram</span>
                    </button>
                  </div>

                  <div className="text-slate-500 text-xs font-mono flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>{selectedArticle.comments.length} Comentários</span>
                  </div>
                </div>

                {/* Interactive Comment board section */}
                <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-100" id="article_comment_board">
                  <h3 className="text-lg font-display font-bold text-slate-900 flex items-center mb-6" id="title_comments">
                    💬 Área de Debates
                    <span className="ml-2 px-2.5 py-0.5 bg-slate-200 text-slate-600 rounded-full text-[11px] font-mono">
                      {selectedArticle.comments.length}
                    </span>
                  </h3>

                  {/* Comment Form */}
                  <form onSubmit={handlePostComment} className="space-y-4 mb-8" id="form_write_comment">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Seu nome no debate</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Pedro Fonseca"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 hover:border-slate-300 transition-all rounded-lg px-3 py-2 text-xs sm:text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Sua opinião sobre o assunto</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Escreva sua análise esportiva de forma amigável..."
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 hover:border-slate-300 transition-all rounded-lg px-3 py-2 text-xs sm:text-sm outline-none resize-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2 rounded-lg text-xs sm:text-sm transition-all focus:ring-2 focus:ring-slate-300 active:scale-95 cursor-pointer"
                        id="btn_submit_comment"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar opinião</span>
                      </button>
                    </div>
                  </form>

                  {/* Comments list */}
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2" id="comment_thread_list">
                    {selectedArticle.comments.length === 0 ? (
                      <div className="text-center py-8 text-slate-400" id="empty_comments_status">
                        <MessageSquare className="w-8 h-8 mx-auto stroke-1 mb-2 text-slate-300" />
                        <p className="text-xs">Nenhum comentário publicado. Seja o primeiro a debater!</p>
                      </div>
                    ) : (
                      selectedArticle.comments.map((comment) => (
                        <div key={comment.id} className="bg-white border border-slate-100 p-4.5 rounded-xl text-xs sm:text-sm shadow-2xs">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-800 font-display">{comment.author}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{formatPublishedDate(comment.date)}</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed font-sans">{comment.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Footer Back Button action block */}
                <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                  <button
                    onClick={() => { setSelectedArticle(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex items-center space-x-2 text-slate-500 hover:text-emerald-700 font-semibold text-sm transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Voltar à capa da revista</span>
                  </button>
                </div>

              </div>
            </motion.article>
          ) : (
            <motion.div
              key="portal_hub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              id="portal_news_hub"
            >
              
              {/* --- 1. HERO SPOTLIGHT DISPLAY (Destaque Principal) --- */}
              {highlightArticle && !searchQuery && selectedCategory === 'Todos' && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-10 cursor-pointer overflow-hidden rounded-2xl group border border-slate-250 bg-slate-900 text-white relative flex flex-col md:flex-row shadow-lg min-h-[380px]"
                  onClick={() => { setSelectedArticle(highlightArticle); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  id="portal_highlight_scrow"
                >
                  {/* Photo area with glow */}
                  <div className="md:w-1/2 relative h-56 md:h-auto overflow-hidden">
                    <FootballImage 
                      src={highlightArticle.image} 
                      alt={highlightArticle.title}
                      category={highlightArticle.category}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                      id="highlight_hero_img"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900 to-transparent md:hidden" />
                  </div>

                  {/* Caption Info area */}
                  <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20">
                    <div>
                      {/* Category Label with spark badge */}
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono uppercase text-[10px] font-bold tracking-widest px-3 py-1 rounded-full shadow">
                          {highlightArticle.category}
                        </span>
                        <span className="flex items-center space-x-1 text-emerald-400 text-[10px] font-bold uppercase font-sans tracking-wider bg-emerald-900/45 px-2.5 py-1 rounded-full border border-emerald-800/25">
                          <Flame className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500 animate-pulse" />
                          <span>Destaque Principal</span>
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-extrabold tracking-tight text-white mb-3 group-hover:text-emerald-300 transition-colors duration-200">
                        {highlightArticle.title}
                      </h3>
                      
                      <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed mb-6 font-light line-clamp-3">
                        {highlightArticle.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60 pt-4 mt-4 text-xs font-mono text-slate-400">
                      <div className="flex items-center space-x-2">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-slate-300 font-semibold">{highlightArticle.author}</span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{highlightArticle.readTime}</span>
                        </span>
                        <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                          <Heart className="w-3.5 h-3.5 fill-emerald-500 stroke-none" />
                          <span>{highlightArticle.likes}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- 2. CATEGORY DECK SEPARATOR (Abas de Filtros) --- */}
              <div className="mb-8 border-b border-slate-200/65 pb-4" id="filters_deck_container">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  
                  {/* Category badging */}
                  <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1" id="category_scroll_strip">
                    <span className="p-1 px-2.5 bg-slate-200/60 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center space-x-1.5 font-display min-w-[70px]">
                      <Filter className="w-3.5 h-3.5 text-slate-500" />
                      <span>Filtros</span>
                    </span>
                    
                    {['Todos', ...CATEGORY_PRESETS].map((ctg) => {
                      const isActive = selectedCategory === ctg;
                      return (
                        <button
                          key={ctg}
                          onClick={() => setSelectedCategory(ctg as CategoryType)}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all tracking-wide cursor-pointer ${
                            isActive 
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10 scale-102' 
                              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          {ctg}
                        </button>
                      );
                    })}
                  </div>

                  {/* Filter Search results counter / Clear search */}
                  {searchQuery && (
                    <div className="bg-emerald-50 text-emerald-800 border-emerald-100 border px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{filteredNews.length} Resultados para "{searchQuery}"</span>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="p-0.5 hover:bg-emerald-100 rounded text-emerald-700 ml-1.5"
                        title="Limpar filtro"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>
              </div>

              {/* --- 3. NEWS FEED GRID SECTION --- */}
              {feedNews.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-2xs" id="empty_search_fallback">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-slate-800 mb-1">Nenhuma notícia encontrada</h4>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Não encontramos artigos correspondentes ao filtro ou busca atuais. Tente mudar de categoria ou limpar termos.
                  </p>
                  <button
                    onClick={() => { setSelectedCategory('Todos'); setSearchQuery(''); }}
                    className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Ver Tudo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="news_grid_wrapper">
                  {feedNews.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                      onClick={() => { setSelectedArticle(article); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-out cursor-pointer group flex flex-col justify-between"
                      id={`card_${article.id}`}
                    >
                      {/* Image header with category watermark */}
                      <div>
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          <FootballImage 
                            src={article.image} 
                            alt={article.title}
                            category={article.category}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          {/* Category Tag pill */}
                          <div className="absolute top-3 left-3">
                            <span className="bg-emerald-700/90 text-white font-mono uppercase text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-md shadow backdrop-blur-xs">
                              {article.category}
                            </span>
                          </div>

                          {/* Quick Highlight star */}
                          {article.isHighlight && (
                            <div className="absolute top-3 right-3 text-emerald-400 bg-slate-950/80 p-1 rounded-full border border-emerald-950 backdrop-blur-xs" title="Notícia Destaque do Portal">
                              <Flame className="w-3.5 h-3.5 fill-emerald-400 stroke-none" />
                            </div>
                          )}
                        </div>

                        {/* Title details */}
                        <div className="p-5">
                          {/* Author avatar marker */}
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono tracking-wide uppercase mb-2">
                            <span>{article.author}</span>
                            <span>•</span>
                            <span>{formatPublishedDate(article.date)}</span>
                          </div>

                          <h4 className="text-base font-display font-extrabold text-slate-900 group-hover:text-emerald-700 leading-snug tracking-tight mb-2 line-clamp-2 transition-colors duration-200">
                            {article.title}
                          </h4>

                          <p className="text-slate-500 font-sans text-xs leading-relaxed line-clamp-2">
                            {article.summary}
                          </p>
                        </div>
                      </div>

                      {/* Footer micro stats info */}
                      <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{article.readTime}</span>
                        </span>

                        <div className="flex items-center space-x-3.5">
                          {/* Heart Likes hover click */}
                          <button
                            onClick={(e) => handleLike(article.id, e)}
                            className="flex items-center space-x-1 text-slate-400 hover:text-emerald-600 transition-colors"
                            title="Curtir notícia"
                          >
                            <Heart className="w-3.5 h-3.5 hover:fill-emerald-600 transition-colors" />
                            <span className="font-semibold text-slate-500">{article.likes}</span>
                          </button>

                          {/* Comments icon with indicator tag */}
                          <span className="flex items-center space-x-1" title="Comentários no debate">
                            <MessageSquare className="w-3.5 h-3.5 text-slate-300" />
                            <span>{article.comments.length}</span>
                          </span>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* --- --- FOOTER --- --- */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-10 mt-12 bg-radial from-slate-950 via-slate-950 to-emerald-950/25" id="footer_section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-900" id="footer_grid_wrap">
            
            {/* Branding & Social links */}
            <div className="space-y-4" id="footer_brand_column">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-600 p-1.5 rounded-lg text-white">
                  <Trophy className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-display font-extrabold tracking-tight text-white">
                  MUNDO <span className="text-emerald-400">DA BOLA</span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-xs">
                Seu portal moderno e interativo de notícias. Fique atualizado sobre as principais transações, análises táticas de jogos e resultados do esporte mais popular da terra.
              </p>
            </div>

            {/* Quick Categories Filter */}
            <div id="footer_links_column">
              <h4 className="text-white text-xs font-mono font-bold uppercase tracking-widest mb-4">Categorias do Canal</h4>
              <ul className="grid grid-cols-2 gap-2 text-xs font-medium">
                <li>
                  <button 
                    onClick={() => { setSelectedArticle(null); setSelectedCategory('Todos'); }}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Ver Tudo
                  </button>
                </li>
                {CATEGORY_PRESETS.map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => { setSelectedArticle(null); setSelectedCategory(cat); }}
                      className="hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social details & Interactive metrics */}
            <div id="footer_stats_column">
              <h4 className="text-white text-xs font-mono font-bold uppercase tracking-widest mb-4">Informação & Tecnologia</h4>
              <p className="text-xs leading-relaxed max-w-xs font-sans text-slate-400">
                Este portal foi desenvolvido com layout estático reativo no cliente, utilizando banco de dados síncrono no browser (<strong className="text-slate-300">localStorage</strong>) para que suas alterações permaneçam ativas.
              </p>
              <div className="mt-3 flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                <span>Portal Ativo & Localmente Sincronizado</span>
              </div>
            </div>

          </div>

          {/* Copyrights and terms credits */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 text-[10px] text-slate-500 font-mono gap-4" id="footer_copyright_row">
            <p>© {new Date().getFullYear()} Mundo da Bola. Todos os direitos reservados de publicação.</p>
            <div className="flex items-center space-x-1.5 text-slate-500">
              <span>Fabricado com</span>
              <Heart className="w-3 h-3 fill-emerald-700 text-emerald-700" />
              <span>para os amantes do bom futebol</span>
            </div>
          </div>
        </div>
      </footer>

      {/* --- EXTRA DRAWER: REDATOR NEWS WRITER Form (Side Drawer Layout Panel) --- */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex justify-end" id="publisher_drawer_container">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditorOpen(false)}
              className="absolute inset-0 bg-slate-950"
              id="publisher_backdrop"
            />

            {/* Content Drawer layout panel panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
              id="publisher_sidebar_panel"
            >
              {/* Drawer header */}
              <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-emerald-950">
                <div className="flex items-center space-x-2">
                  <div className="bg-emerald-600 p-1.5 rounded-lg">
                    <Trophy className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm uppercase tracking-wide">Painel do Redator</h3>
                    <p className="text-[10px] text-slate-400 font-sans">Cadastre uma nova notícia de futebol</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Fechar painel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Main Scroll Content form */}
              <form onSubmit={handleCreateNews} className="flex-grow p-6 overflow-y-auto space-y-5" id="form_create_article">
                
                {/* 1. Categorias */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">Escolha a Categoria</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORY_PRESETS.map((cat) => {
                      const isSelected = formCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormCategory(cat)}
                          className={`py-2 px-3 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500 shadow-xs' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Headline Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">Título / Manchete Principal</label>
                  <input
                    type="text"
                    required
                    maxLength={140}
                    placeholder="Ex: Reforço de ouro: Zagueiro chega com luvas milionárias e exames marcados"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none transition-all"
                  />
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block text-right">{140 - formTitle.length} caracteres restantes</span>
                </div>

                {/* 3. Summary block */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">Resumo Curto (Apresentação do Feed)</label>
                  <textarea
                    required
                    rows={2}
                    maxLength={240}
                    placeholder="Ex: Saiba tudo da novidade que vai sacudir o mercado nacional..."
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none resize-none transition-all"
                  />
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block text-right">{240 - formSummary.length} caracteres restantes</span>
                </div>

                {/* 4. Article Full Content */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">Corpo da Matéria Completo (Pule linhas para parágrafos)</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Escreva aqui todo o conteúdo da matéria técnica. Pule linhas duas vezes para formar novos parágrafos na leitura."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none transition-all"
                  />
                </div>

                {/* 5. Author and Read Time info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">Autor da Matéria</label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome, ex: Giselle Fernandes"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1.5">Tempo de leitura</label>
                    <select
                      value={formReadTime}
                      onChange={(e) => setFormReadTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none transition-all"
                    >
                      <option value="2 min">2 minutos</option>
                      <option value="3 min">3 minutos</option>
                      <option value="4 min">4 minutos</option>
                      <option value="5 min">5 minutos</option>
                      <option value="7 min">7 minutos</option>
                      <option value="10 min">10 minutos</option>
                    </select>
                  </div>
                </div>

                {/* 6. Image Selection Tabs */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">Imagem da Notícia</label>
                  
                  {/* Tabs layout */}
                  <div className="flex border-b border-slate-200 mb-4 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('preset')}
                      className={`flex-1 pb-2 border-b-2 text-center transition-colors cursor-pointer ${
                        imageSourceMode === 'preset' 
                          ? 'border-emerald-600 text-emerald-600 font-bold' 
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Banco de Fotos
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('upload')}
                      className={`flex-1 pb-2 border-b-2 text-center transition-colors cursor-pointer ${
                        imageSourceMode === 'upload' 
                          ? 'border-emerald-600 text-emerald-600 font-bold' 
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Enviar do Dispositivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('url')}
                      className={`flex-1 pb-2 border-b-2 text-center transition-colors cursor-pointer ${
                        imageSourceMode === 'url' 
                          ? 'border-emerald-600 text-emerald-600 font-bold' 
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Link da Web
                    </button>
                  </div>

                  {/* Mode Content Switches */}
                  {imageSourceMode === 'preset' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400 font-medium">Selecione uma imagem predefinida:</span>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
                          <Camera className="w-3 h-3 mr-1" />
                          Premium Presets
                        </span>
                      </div>
                      
                      {/* Presets grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {IMAGE_PRESETS.map((preset) => (
                          <div 
                            key={preset.name}
                            onClick={() => setFormImagePreset(preset.url)}
                            className={`group relative h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                              formImagePreset === preset.url
                                ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                                : 'border-slate-100 hover:border-slate-300'
                            }`}
                            title={preset.name}
                          >
                            <img 
                              src={preset.url} 
                              alt={preset.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/10 flex items-center justify-center transition-colors">
                              <span className="text-[8px] text-white font-mono font-medium truncate px-1 text-center w-full">{preset.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {imageSourceMode === 'upload' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {/* Drag & Drop zone */}
                      {!formUploadedImage ? (
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                          onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={async (e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            setUploadError(null);
                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                              if (!file.type.startsWith('image/')) {
                                setUploadError('Apenas formatos de imagem (PNG, JPG, WEBP) são válidos!');
                                        return;
                              }
                              try {
                                setFormUploadedName(file.name);
                                const compressedUrl = await compressAndLoadImage(file);
                                setFormUploadedImage(compressedUrl);
                              } catch (err) {
                                setUploadError('Erro ao carregar imagem. Tente outro arquivo!');
                              }
                            }
                          }}
                          onClick={() => {
                            const fileInput = document.getElementById('device_image_file_input');
                            if (fileInput) fileInput.click();
                          }}
                          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] ${
                            isDragging 
                              ? 'border-emerald-500 bg-emerald-50/50' 
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-350'
                          }`}
                        >
                          {/* Hidden File Input */}
                          <input
                            type="file"
                            id="device_image_file_input"
                            accept="image/*"
                            onChange={async (e) => {
                              setUploadError(null);
                              const file = e.target.files?.[0];
                              if (file) {
                                if (!file.type.startsWith('image/')) {
                                  setUploadError('Por favor, envie apenas formatos de imagem.');
                                  return;
                                }
                                try {
                                  setFormUploadedName(file.name);
                                  const compressedUrl = await compressAndLoadImage(file);
                                  setFormUploadedImage(compressedUrl);
                                } catch (err) {
                                  setUploadError('Erro ao carregar imagem. Tente de novo!');
                                }
                              }
                            }}
                            className="hidden"
                          />
                          <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:scale-105 transition-transform" />
                          <p className="text-xs font-semibold text-slate-700 select-none">
                            Arraste uma foto aqui ou <span className="text-emerald-600 underline">procure nos seus arquivos</span>
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1 select-none">
                            Suporta PNG, JPG ou WEBP. Compressão inteligente.
                          </p>
                        </div>
                      ) : (
                        /* Upload success preview block */
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
                          <div className="flex items-center space-x-3.5 min-w-0">
                            <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                              <img 
                                src={formUploadedImage} 
                                alt="Thumbnail de upload"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate" title={formUploadedName}>
                                {formUploadedName || 'foto-carregada.jpg'}
                              </p>
                              <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-widest font-bold">
                                Pronto para enviar
                              </span>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setFormUploadedImage('');
                              setFormUploadedName('');
                              setUploadError(null);
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all cursor-pointer shrink-0"
                            title="Remover foto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Display warning or error feedback */}
                      {uploadError && (
                        <div className="flex items-center space-x-1.5 text-[10px] text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-100">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{uploadError}</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {imageSourceMode === 'url' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Cole o link de uma imagem externa da sua escolha</label>
                      <input
                        type="url"
                        placeholder="https://exemplo.com/sua-imagem.jpg"
                        value={formCustomImage}
                        onChange={(e) => setFormCustomImage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-2 text-xs outline-none transition-all"
                      />
                    </motion.div>
                  )}
                </div>

                {/* 7. Destaque slide boolean toggle */}
                <div className="border-t border-slate-100 pt-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Promover Notícia ao Destaque Principal?</h4>
                      <p className="text-[10px] text-slate-400">Essa matéria substituirá o banner principal do topo e ocupará o holofote de capa.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsHighlight}
                        onChange={(e) => setFormIsHighlight(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>

              </form>

              {/* Drawer footer submit button */}
              <div className="p-5 border-t border-slate-150 bg-slate-50 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="w-1/2 text-center border border-slate-300 hover:border-slate-400 hover:text-slate-800 text-slate-500 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={handleCreateNews}
                  className="w-1/2 text-center bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/10 transition-colors cursor-pointer"
                >
                  Enviar Publicação
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
