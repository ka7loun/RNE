import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { Search, HelpCircle, MessageCircle } from 'lucide-react';
import { transliterate as tr } from 'transliteration';

type Language = 'ar' | 'fr' | 'en';

// Regex for allowed characters
const ARABIC_REGEX = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF0-9\s&\-]+$/;
const LATIN_REGEX = /^[a-zA-Z0-9\s&\-]+$/;

const DenominationSimulator = () => {
  const [showCommercialName, setShowCommercialName] = useState(false);
  const [frName, setFrName] = useState('');
  const [enName, setEnName] = useState('');
  const [arName, setArName] = useState('');
  const [frMessage, setFrMessage] = useState<{ text: string; isError: boolean }>({ text: '', isError: false });
  const [enMessage, setEnMessage] = useState<{ text: string; isError: boolean }>({ text: '', isError: false });
  const [arMessage, setArMessage] = useState<{ text: string; isError: boolean }>({ text: '', isError: false });
  const [loading, setLoading] = useState(false);
  const [frCommercial, setFrCommercial] = useState('');
  const [enCommercial, setEnCommercial] = useState('');
  const [arCommercial, setArCommercial] = useState('');
  const [frCommercialMessage, setFrCommercialMessage] = useState<{ text: string; isError: boolean }>({ text: '', isError: false });
  const [enCommercialMessage, setEnCommercialMessage] = useState<{ text: string; isError: boolean }>({ text: '', isError: false });
  const [arCommercialMessage, setArCommercialMessage] = useState<{ text: string; isError: boolean }>({ text: '', isError: false });
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatLang, setChatLang] = useState<'fr' | 'en' | 'ar'>('fr');
  const [chatMode, setChatMode] = useState<null | 'name_check' | 'faq'>(null);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', message: string}[]>([]);
  const [hasValidated, setHasValidated] = useState(false);

  // Improved Arabic to Latin mapping
  const arabicToLatin: Record<string, string> = {
    'أ': 'a', 'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'dh',
    'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l',
    'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ء': "'", 'ى': 'a', 'ة': 'a',
    'ئ': 'i', 'ؤ': 'u'
  };
  // Improved Latin to Arabic mapping (with digraphs)
  const latinToArabicDigraphs: Record<string, string> = {
    'ou': 'و', 'ch': 'ش', 'sh': 'ش', 'gh': 'غ', 'th': 'ث', 'dh': 'ذ', 'kh': 'خ', 'ph': 'ف',
    'ai': 'اي', 'ei': 'ي', 'ie': 'ي', 'ee': 'ي', 'oo': 'و', 'on': 'ون', 'an': 'ان', 'gn': 'ني'
  };
  const latinToArabicSingle: Record<string, string> = {
    'a': 'ا', 'b': 'ب', 'c': 'ك', 'd': 'د', 'e': 'ي', 'f': 'ف', 'g': 'ج', 'h': 'ه',
    'i': 'ي', 'j': 'ج', 'k': 'ك', 'l': 'ل', 'm': 'م', 'n': 'ن', 'o': 'و', 'p': 'ب',
    'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت', 'u': 'و', 'v': 'ف', 'w': 'و', 'x': 'كس',
    'y': 'ي', 'z': 'ز'
  };
  // Arabic to Latin transliteration
  function transliterateArabicToLatin(text: string): string {
    return text.split('').map(char => arabicToLatin[char] || char).join('');
  }
  // Latin to Arabic transliteration
  function transliterateLatinToArabic(text: string): string {
    let result = text.toLowerCase();
    // Handle digraphs first
    Object.keys(latinToArabicDigraphs).forEach(digraph => {
      const re = new RegExp(digraph, 'g');
      result = result.replace(re, latinToArabicDigraphs[digraph]);
    });
    // Then single letters
    result = result.split('').map(char => latinToArabicSingle[char] || char).join('');
    return result;
  }

  // Name check API integration (local Flask backend)
  const checkName = async (name: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: name })
      });
      const data = await res.json();
      return { text: data.message, isError: !data.is_valid };
    } catch (e) {
      return { text: 'Erreur de connexion au serveur.', isError: true };
    }
  };

  const handleVerify = async () => {
    setHasValidated(true);
    setFrMessage({ text: '', isError: false });
    setEnMessage({ text: '', isError: false });
    setArMessage({ text: '', isError: false });
    setFrCommercialMessage({ text: '', isError: false });
    setEnCommercialMessage({ text: '', isError: false });
    setArCommercialMessage({ text: '', isError: false });
    setLoading(true);
    let newFrName = frName;
    let newEnName = enName;
    let newArName = arName;
    let newFrCommercial = frCommercial;
    let newEnCommercial = enCommercial;
    let newArCommercial = arCommercial;
    // Main name transliteration
    if (frName && !enName && !arName) {
      newEnName = transliterateArabicToLatin(frName);
      newArName = transliterateLatinToArabic(frName);
      setEnName(newEnName);
      setArName(newArName);
    } else if (enName && !frName && !arName) {
      newFrName = transliterateArabicToLatin(enName);
      newArName = transliterateLatinToArabic(enName);
      setFrName(newFrName);
      setArName(newArName);
    } else if (arName && !frName && !enName) {
      newFrName = transliterateArabicToLatin(arName);
      newEnName = transliterateArabicToLatin(arName);
      setFrName(newFrName);
      setEnName(newEnName);
    }
    // Commercial name transliteration
    if (showCommercialName) {
      if (frCommercial && !enCommercial && !arCommercial) {
        newEnCommercial = transliterateArabicToLatin(frCommercial);
        newArCommercial = transliterateLatinToArabic(frCommercial);
        setEnCommercial(newEnCommercial);
        setArCommercial(newArCommercial);
      } else if (enCommercial && !frCommercial && !arCommercial) {
        newFrCommercial = transliterateArabicToLatin(enCommercial);
        newArCommercial = transliterateLatinToArabic(enCommercial);
        setFrCommercial(newFrCommercial);
        setArCommercial(newArCommercial);
      } else if (arCommercial && !frCommercial && !enCommercial) {
        newFrCommercial = transliterateArabicToLatin(arCommercial);
        newEnCommercial = transliterateArabicToLatin(arCommercial);
        setFrCommercial(newFrCommercial);
        setEnCommercial(newEnCommercial);
      }
    }
    const promises = [];
    // Main fields
    if (!LATIN_REGEX.test(newFrName)) {
      setFrMessage({ text: 'Veuillez utiliser uniquement des caractères latins.', isError: true });
    } else {
      promises.push(
        checkName(newFrName).then(msg => setFrMessage(msg))
      );
    }
    if (!LATIN_REGEX.test(newEnName)) {
      setEnMessage({ text: 'Please use only Latin characters.', isError: true });
    } else {
      promises.push(
        checkName(newEnName).then(msg => setEnMessage(msg))
      );
    }
    if (!ARABIC_REGEX.test(newArName)) {
      setArMessage({ text: 'يرجى استخدام الأحرف العربية فقط.', isError: true });
    } else {
      promises.push(
        checkName(newArName).then(msg => setArMessage(msg))
      );
    }
    // Commercial fields
    if (showCommercialName) {
      if (!LATIN_REGEX.test(newFrCommercial)) {
        setFrCommercialMessage({ text: 'Veuillez utiliser uniquement des caractères latins.', isError: true });
      } else {
        promises.push(
          checkName(newFrCommercial).then(msg => setFrCommercialMessage(msg))
        );
      }
      if (!LATIN_REGEX.test(newEnCommercial)) {
        setEnCommercialMessage({ text: 'Please use only Latin characters.', isError: true });
      } else {
        promises.push(
          checkName(newEnCommercial).then(msg => setEnCommercialMessage(msg))
        );
      }
      if (!ARABIC_REGEX.test(newArCommercial)) {
        setArCommercialMessage({ text: 'يرجى استخدام الأحرف العربية فقط.', isError: true });
      } else {
        promises.push(
          checkName(newArCommercial).then(msg => setArCommercialMessage(msg))
        );
      }
    }
    await Promise.all(promises);
    setLoading(false);
  };

  // Language-specific input handlers
  const handleFrInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrName(e.target.value);
    // Clear other fields when new input is entered
    if (e.target.value) {
      setEnName('');
      setArName('');
    }
  };
  const handleEnInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnName(e.target.value);
    // Clear other fields when new input is entered
    if (e.target.value) {
      setFrName('');
      setArName('');
    }
  };
  const handleArInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArName(e.target.value);
    // Clear other fields when new input is entered
    if (e.target.value) {
      setFrName('');
      setEnName('');
    }
  };

  // Chat API integration (external AI API)
  const API_BASE_URL = 'http://192.168.4.154:8000';
  const askQuestion = async (question: string, lang: 'fr' | 'en' | 'ar' = 'fr') => {
    try {
      setChatLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/faq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          lang
        })
      });
      
      const data = await response.json();
      setChatResponse(data.message);
      setChatLoading(false);
    } catch (error) {
      console.error('Error asking question:', error);
      setChatResponse('Connection error. Please try again.');
      setChatLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Early return for validation
    if (!chatMessage.trim() || !chatMode) {
      return;
    }

    setChatLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', message: chatMessage }]);
    let response;
    let data: any;
    try {
      if (chatMode === 'name_check') {
        console.log('POST /api/name_check', {
          name: chatMessage,
          business_type: 'DENOMINATION_SOCIALE',
          lang: chatLang
        });
        response = await fetch('http://192.168.4.154:8000/api/name_check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: chatMessage,
            business_type: 'DENOMINATION_SOCIALE',
            lang: chatLang
          })
        });
      } else {
        console.log('POST /api/faq', {
          question: chatMessage,
          lang: chatLang
        });
        response = await fetch('http://192.168.4.154:8000/api/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: chatMessage,
            lang: chatLang
          })
        });
      }
      data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', message: data.message }]);
      setChatResponse(data.message);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'assistant', message: 'Connection error. Please try again.' }]);
      setChatResponse('Connection error. Please try again.');
    }
    setChatLoading(false);
    setChatMessage('');
    setChatMode(null);
  };

  // Add this derived state after your message states:
  const allNamesValid =
    frMessage.text === 'Le nom est valide !' && !frMessage.isError &&
    enMessage.text === 'The name is available.' && !enMessage.isError &&
    arMessage.text === 'الاسم متاح' && !arMessage.isError;

  return (
    <div className="p-6 bg-bg-light min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb />
        
        <div className="bg-white rounded-lg shadow-card p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-title text-text-primary">Contrôler la conformité de la dénomination selon la réglementation en vigueur</h1>
            <h1 className="text-title text-text-primary text-right mt-2 md:mt-0" dir="rtl" lang="ar">
              التحقق من مطابقة الاسم للوائح المعمول بها
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <p className="text-text-secondary max-w-2xl">
              Un outil intelligent pour vérifier si votre nom d'entreprise est conforme à la loi tunisienne, 
              disponible, et adapté à l'enregistrement au RNE. Saisissez votre nom dans l'une des langues 
              officielles puis lancez la vérification.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <label className="block mb-1 font-semibold text-sm text-gray-700" htmlFor="main-ar">Nom en Arabe</label>
                <input
                  id="main-ar"
                    type="text"
                  value={arName}
                  onChange={handleArInput}
                    className="w-full border border-border rounded-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-200"
                    placeholder="أدخل التسمية الإجتماعية"
                    dir="rtl"
                    lang="ar"
                  />
                {arMessage.text && (
                  <div className={arMessage.isError ? "text-red-600 mt-2 text-sm" : "text-green-600 mt-2 text-sm"}>
                    {arMessage.text}
                  </div>
                )}
                </div>
              <div className="flex-1 relative">
                <label className="block mb-1 font-semibold text-sm text-gray-700" htmlFor="main-fr">Nom en Français</label>
                  <input
                  id="main-fr"
                    type="text"
                  value={frName}
                  onChange={handleFrInput}
                    className="w-full border border-border rounded-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-200"
                    placeholder="Entrez la dénomination sociale"
                  />
                {frMessage.text && (
                  <div className={frMessage.isError ? "text-red-600 mt-2 text-sm" : "text-green-600 mt-2 text-sm"}>
                    {frMessage.text}
                  </div>
                )}
                </div>
              <div className="flex-1 relative">
                <label className="block mb-1 font-semibold text-sm text-gray-700" htmlFor="main-en">Nom en Anglais</label>
                  <input
                  id="main-en"
                    type="text"
                  value={enName}
                  onChange={handleEnInput}
                    className="w-full border border-border rounded-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-200"
                    placeholder="Enter company name"
                  />
                {enMessage.text && (
                  <div className={enMessage.isError ? "text-red-600 mt-2 text-sm" : "text-green-600 mt-2 text-sm"}>
                    {enMessage.text}
                  </div>
                )}
                  </div>
                </div>

            <label className="flex items-center space-x-2 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={showCommercialName}
                  onChange={(e) => setShowCommercialName(e.target.checked)}
                  className="text-primary focus:ring-primary rounded"
                />
                <span>Je souhaite ajouter un Nom Commercial</span>
              </label>

            {showCommercialName && (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <label className="block mb-1 font-semibold text-sm text-gray-700" htmlFor="com-ar">Nom Commercial en Arabe</label>
                  <input
                    id="com-ar"
                    type="text"
                    value={arCommercial}
                    onChange={e => {
                      setArCommercial(e.target.value);
                      if (e.target.value) {
                        setFrCommercial('');
                        setEnCommercial('');
                      }
                    }}
                    className="w-full border border-border rounded-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-200"
                    placeholder="أدخل الاسم التجاري"
                    dir="rtl"
                    lang="ar"
                  />
                  {arCommercialMessage.text && (
                    <div className={arCommercialMessage.isError ? "text-red-600 mt-2 text-sm" : "text-green-600 mt-2 text-sm"}>
                      {arCommercialMessage.text}
                    </div>
                  )}
                </div>
                <div className="flex-1 relative">
                  <label className="block mb-1 font-semibold text-sm text-gray-700" htmlFor="com-fr">Nom Commercial en Français</label>
                  <input
                    id="com-fr"
                    type="text"
                    value={frCommercial}
                    onChange={e => {
                      setFrCommercial(e.target.value);
                      if (e.target.value) {
                        setArCommercial('');
                        setEnCommercial('');
                      }
                    }}
                    className="w-full border border-border rounded-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-200"
                    placeholder="Entrez le nom commercial"
                  />
                  {frCommercialMessage.text && (
                    <div className={frCommercialMessage.isError ? "text-red-600 mt-2 text-sm" : "text-green-600 mt-2 text-sm"}>
                      {frCommercialMessage.text}
                    </div>
                  )}
                </div>
                <div className="flex-1 relative">
                  <label className="block mb-1 font-semibold text-sm text-gray-700" htmlFor="com-en">Nom Commercial en Anglais</label>
                  <input
                    id="com-en"
                    type="text"
                    value={enCommercial}
                    onChange={e => {
                      setEnCommercial(e.target.value);
                      if (e.target.value) {
                        setFrCommercial('');
                        setArCommercial('');
                      }
                    }}
                    className="w-full border border-border rounded-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-200"
                    placeholder="Enter trade name"
                  />
                  {enCommercialMessage.text && (
                    <div className={enCommercialMessage.isError ? "text-red-600 mt-2 text-sm" : "text-green-600 mt-2 text-sm"}>
                      {enCommercialMessage.text}
                    </div>
                  )}
                </div>
            </div>
            )}
          </div>

          <div className="flex flex-col items-center md:flex-row md:justify-center md:space-x-4">
            <button
              onClick={handleVerify}
              disabled={loading}
              className="flex items-center bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 transition-colors duration-200 space-x-2 disabled:opacity-50"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Vérification...' : 'Valider'}</span>
            </button>
            {hasValidated && allNamesValid && (
              <a
                href="https://www.registre-entreprises.tn/rne-public/#/myrne/reservation/landing-page"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 mt-4 md:mt-0 px-8 py-3 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
              >
                Réserver
              </a>
            )}
          </div>
        </div>
          </div>

      {/* Chat Interface */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end">
        {showChat && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 w-80">
            {!chatMode && (
              <div className="flex flex-col gap-2 mb-4">
                <button
                  className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-2 rounded transition"
                  onClick={() => { setChatMode('name_check'); setChatResponse(''); }}
                >
                  Vérifier le nom de l'entreprise / التحقق من اسم المؤسسة
                </button>
                <button
                  className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-2 rounded transition"
                  onClick={() => { setChatMode('faq'); setChatResponse(''); }}
                >
                  Poser une question / اطرح سؤالاً
                </button>
              </div>
            )}
            {chatMode === 'name_check' && (
              <div className="mb-2 text-xs text-gray-500">Entrez le nom à vérifier / أدخل الاسم للتحقق</div>
            )}
            {chatMode === 'faq' && (
              <div className="mb-2 text-xs text-gray-500">Posez votre question / اطرح سؤالك</div>
            )}
            <div className="h-40 overflow-y-auto mb-4 p-2 bg-gray-50 rounded">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}
                    dir={chatLang === 'ar' ? 'rtl' : 'ltr'}>
                    {msg.message}
                  </div>
                </div>
              ))}
              </div>
            <form onSubmit={handleChatSubmit} className="flex gap-2" autoComplete="off">
                <input
                  type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={chatLang === 'ar' ? 'اكتب سؤالك هنا...' : 'Écrivez votre question ici...'}
                className="flex-1 px-3 py-2 border rounded-md text-sm"
                dir={chatLang === 'ar' ? 'rtl' : 'ltr'}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={chatLoading}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {chatLoading ? '...' : '→'}
              </button>
            </form>
            </div>
          )}
        <button
          onClick={() => setShowChat(!showChat)}
          className="bg-blue-900 text-white p-3 rounded-full shadow-lg hover:bg-blue-800 transition-colors"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Floating AI Assistant Tooltip */}
      <div className="fixed bottom-6 right-[80px] bg-gradient-to-br from-green-800 via-green-900 to-green-950 p-3 rounded-xl shadow-2xl border-2 border-green-900 max-w-[220px]">
        <div className="absolute top-1/2 -right-2 w-4 h-4 bg-gradient-to-br from-green-800 via-green-900 to-green-950 transform -translate-y-1/2 rotate-45 border-r-2 border-b-2 border-green-900"></div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-white font-bold leading-tight drop-shadow">
            Pour vérifier l'existence d'une dénomination ou pour toute question relative à la composition nominative, veuillez consulter l'assistant virtuel en cliquant ici
          </p>
          <p className="text-xs text-white font-bold leading-tight drop-shadow" dir="rtl">
            للتحقق من وجود طائفة أو لأي أسئلة تتعلق بالتركيبة الاسمية، يرجى استشارة المساعد الافتراضي بالنقر هنا
          </p>
        </div>
      </div>
    </div>
  );
};

export default DenominationSimulator;