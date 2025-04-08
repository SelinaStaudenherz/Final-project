// Real-Time Translation Tool - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Text translation elements
    const sourceLanguageSelect = document.getElementById('source-language');
    const targetLanguageSelect = document.getElementById('target-language');
    const sourceTextArea = document.getElementById('source-text');
    const targetTextArea = document.getElementById('target-text');
    const translateBtn = document.getElementById('translate-btn');
    const swapLanguagesBtn = document.getElementById('swap-languages-btn');
    const clearSourceBtn = document.getElementById('clear-source-btn');
    const copyTargetBtn = document.getElementById('copy-target-btn');
    const speakSourceBtn = document.getElementById('speak-source-btn');
    const speakTargetBtn = document.getElementById('speak-target-btn');
    const autoTranslateCheckbox = document.getElementById('auto-translate');
    
    // Speech translation elements
    const speechSourceLanguageSelect = document.getElementById('speech-source-language');
    const speechTargetLanguageSelect = document.getElementById('speech-target-language');
    const startRecordingBtn = document.getElementById('start-recording-btn');
    const stopRecordingBtn = document.getElementById('stop-recording-btn');
    const recordingIndicator = document.getElementById('recording-indicator');
    const recognizedSpeechElement = document.getElementById('recognized-speech');
    const speechTranslationElement = document.getElementById('speech-translation');
    const speakTranslationBtn = document.getElementById('speak-translation-btn');
    
    // Conversation mode elements
    const person1LanguageSelect = document.getElementById('person1-language');
    const person2LanguageSelect = document.getElementById('person2-language');
    const startConversationBtn = document.getElementById('start-conversation-btn');
    const conversationModePlaceholder = document.getElementById('conversation-mode-placeholder');
    
    // Initialize language name maps
    const languageNames = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'pt': 'Portuguese',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'auto': 'Auto-Detect'
    };
    
    // Add event listeners
    if (translateBtn) {
        translateBtn.addEventListener('click', translateText);
    }
    
    if (swapLanguagesBtn) {
        swapLanguagesBtn.addEventListener('click', swapLanguages);
    }
    
    if (clearSourceBtn) {
        clearSourceBtn.addEventListener('click', clearSourceText);
    }
    
    if (copyTargetBtn) {
        copyTargetBtn.addEventListener('click', copyTranslation);
    }
    
    if (speakSourceBtn) {
        speakSourceBtn.addEventListener('click', () => speakText(sourceTextArea.value, sourceLanguageSelect.value));
    }
    
    if (speakTargetBtn) {
        speakTargetBtn.addEventListener('click', () => speakText(targetTextArea.value, targetLanguageSelect.value));
    }
    
    if (sourceTextArea && autoTranslateCheckbox) {
        // Add input event for auto-translation
        sourceTextArea.addEventListener('input', debounce(function() {
            if (autoTranslateCheckbox.checked && sourceTextArea.value.trim().length > 0) {
                translateText();
            }
        }, 500));
    }
    
    if (startRecordingBtn) {
        startRecordingBtn.addEventListener('click', startSpeechRecording);
    }
    
    if (stopRecordingBtn) {
        stopRecordingBtn.addEventListener('click', stopSpeechRecording);
    }
    
    if (speakTranslationBtn) {
        speakTranslationBtn.addEventListener('click', () => speakText(speechTranslationElement.textContent, speechTargetLanguageSelect.value));
    }
    
    if (startConversationBtn) {
        startConversationBtn.addEventListener('click', startConversationMode);
    }
    
    // Function to translate text
    function translateText() {
        const sourceText = sourceTextArea.value.trim();
        if (!sourceText) {
            return;
        }
        
        const sourceLang = sourceLanguageSelect.value;
        const targetLang = targetLanguageSelect.value;
        
        // Show loading state
        targetTextArea.value = 'Translating...';
        translateBtn.disabled = true;
        
        // Call the backend translation API
        fetch('http://localhost:3001/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: sourceText,
                sourceLang: sourceLang,
                targetLang: targetLang
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Translation service error');
            }
            return response.json();
        })
        .then(data => {
            targetTextArea.value = data.translatedText;
        })
        .catch(error => {
            console.error('Translation error:', error);
            // Use fallback translation when API fails
            const translatedText = fallbackTranslation(sourceText, sourceLang, targetLang);
            targetTextArea.value = translatedText;
        })
        .finally(() => {
            translateBtn.disabled = false;
        });
    }
    
    // Function to swap languages
    function swapLanguages() {
        if (sourceLanguageSelect.value === 'auto') {
            alert('Cannot swap when source language is set to Auto-Detect.');
            return;
        }
        
        const tempLang = sourceLanguageSelect.value;
        sourceLanguageSelect.value = targetLanguageSelect.value;
        targetLanguageSelect.value = tempLang;
        
        const tempText = sourceTextArea.value;
        sourceTextArea.value = targetTextArea.value;
        targetTextArea.value = tempText;
        
        if (sourceTextArea.value && autoTranslateCheckbox.checked) {
            translateText();
        }
    }
    
    // Function to clear source text
    function clearSourceText() {
        sourceTextArea.value = '';
        if (autoTranslateCheckbox.checked) {
            targetTextArea.value = '';
        }
        sourceTextArea.focus();
    }
    
    // Function to copy translation
    function copyTranslation() {
        targetTextArea.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = copyTargetBtn.innerHTML;
        copyTargetBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
        
        setTimeout(() => {
            copyTargetBtn.innerHTML = originalText;
        }, 2000);
    }
    
    // Function to speak text using Web Speech API
    function speakText(text, language) {
        if (!text) return;
        
        // Stop any current speech
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set language
        utterance.lang = language === 'auto' ? 'en' : language;
        
        // Speak
        window.speechSynthesis.speak(utterance);
    }
    
    // Speech recording variables
    let recognition;
    let isRecording = false;
    
    // Function to start speech recording
    function startSpeechRecording() {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        // Configure recognition
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = speechSourceLanguageSelect.value;
        
        // Set up recognition handlers
        recognition.onstart = function() {
            isRecording = true;
            recognizedSpeechElement.textContent = 'Listening...';
            startRecordingBtn.classList.add('d-none');
            stopRecordingBtn.classList.remove('d-none');
            recordingIndicator.classList.remove('d-none');
            
            // Start visualizer animation
            animateVisualizer();
        };
        
        recognition.onresult = function(event) {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Update the recognized speech
            recognizedSpeechElement.textContent = finalTranscript || interimTranscript || 'Listening...';
            
            // Translate the speech if we have final transcript
            if (finalTranscript) {
                translateSpeech(finalTranscript);
            }
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            recognizedSpeechElement.textContent = `Error: ${event.error}`;
            stopSpeechRecording();
        };
        
        recognition.onend = function() {
            if (isRecording) {
                // Restart if we're still supposed to be recording
                recognition.start();
            } else {
                stopVisualizerAnimation();
                startRecordingBtn.classList.remove('d-none');
                stopRecordingBtn.classList.add('d-none');
                recordingIndicator.classList.add('d-none');
            }
        };
        
        // Start recognition
        try {
            recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            alert('Could not start speech recognition. Please try again.');
        }
    }
    
    // Function to stop speech recording
    function stopSpeechRecording() {
        if (recognition) {
            recognition.stop();
        }
        
        isRecording = false;
        startRecordingBtn.classList.remove('d-none');
        stopRecordingBtn.classList.add('d-none');
        recordingIndicator.classList.add('d-none');
        stopVisualizerAnimation();
    }
    
    // Function to animate the audio visualizer
    function animateVisualizer() {
        const bars = document.querySelectorAll('.audio-visualizer .bar');
        bars.forEach(bar => {
            const randomHeight = Math.floor(Math.random() * 70) + 10;
            const animationDuration = (Math.random() * 0.7) + 0.2;
            
            bar.style.height = randomHeight + 'px';
            bar.style.animationDuration = animationDuration + 's';
            bar.classList.add('animate');
        });
    }
    
    // Function to stop visualizer animation
    function stopVisualizerAnimation() {
        const bars = document.querySelectorAll('.audio-visualizer .bar');
        bars.forEach(bar => {
            bar.classList.remove('animate');
        });
    }
    
    // Function to translate speech using the API
    function translateSpeech(speechText) {
        if (!speechText) return;
        
        const sourceLang = speechSourceLanguageSelect.value;
        const targetLang = speechTargetLanguageSelect.value;
        
        // Show loading state
        speechTranslationElement.textContent = 'Translating...';
        
        // Call the backend translation API
        fetch('http://localhost:3001/api/translate-speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: speechText,
                sourceLang: sourceLang,
                targetLang: targetLang
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Translation service error');
            }
            return response.json();
        })
        .then(data => {
            speechTranslationElement.textContent = data.translatedText;
        })
        .catch(error => {
            console.error('Speech translation error:', error);
            // Use fallback translation when API fails
            const translatedText = fallbackTranslation(speechText, sourceLang, targetLang);
            speechTranslationElement.textContent = translatedText;
        });
    }
    
    // Function to start conversation mode
    function startConversationMode() {
        const person1Lang = person1LanguageSelect.value;
        const person2Lang = person2LanguageSelect.value;
        
        // Clear the placeholder
        conversationModePlaceholder.innerHTML = '';
        
        // Create conversation UI
        const conversationUI = document.createElement('div');
        conversationUI.className = 'conversation-ui mt-4';
        conversationUI.innerHTML = `
            <div class="card mb-3">
                <div class="card-body" id="conversation-history">
                    <div class="text-center text-muted mb-3">Conversation started between ${languageNames[person1Lang]} and ${languageNames[person2Lang]} speakers.</div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="input-group">
                        <button class="btn btn-outline-secondary person1-mic-btn" type="button">
                            <i class="fas fa-microphone"></i>
                        </button>
                        <input type="text" class="form-control person1-input" placeholder="Type or speak (${languageNames[person1Lang]})">
                        <button class="btn btn-primary person1-send-btn" type="button">Send</button>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="input-group">
                        <button class="btn btn-outline-secondary person2-mic-btn" type="button">
                            <i class="fas fa-microphone"></i>
                        </button>
                        <input type="text" class="form-control person2-input" placeholder="Type or speak (${languageNames[person2Lang]})">
                        <button class="btn btn-primary person2-send-btn" type="button">Send</button>
                    </div>
                </div>
            </div>
            <div class="text-center mb-3">
                <button class="btn btn-danger end-conversation-btn">
                    <i class="fas fa-times-circle me-2"></i>End Conversation
                </button>
            </div>
        `;
        
        conversationModePlaceholder.appendChild(conversationUI);
        
        // Add event listeners to the conversation UI elements
        const person1SendBtn = document.querySelector('.person1-send-btn');
        const person2SendBtn = document.querySelector('.person2-send-btn');
        const person1Input = document.querySelector('.person1-input');
        const person2Input = document.querySelector('.person2-input');
        const person1MicBtn = document.querySelector('.person1-mic-btn');
        const person2MicBtn = document.querySelector('.person2-mic-btn');
        const endConversationBtn = document.querySelector('.end-conversation-btn');
        const conversationHistory = document.getElementById('conversation-history');
        
        if (person1SendBtn) {
            person1SendBtn.addEventListener('click', () => {
                sendConversationMessage(person1Input, person1Lang, person2Lang, 'Person 1');
            });
        }
        
        if (person2SendBtn) {
            person2SendBtn.addEventListener('click', () => {
                sendConversationMessage(person2Input, person2Lang, person1Lang, 'Person 2');
            });
        }
        
        if (person1Input) {
            person1Input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendConversationMessage(person1Input, person1Lang, person2Lang, 'Person 1');
                }
            });
        }
        
        if (person2Input) {
            person2Input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendConversationMessage(person2Input, person2Lang, person1Lang, 'Person 2');
                }
            });
        }
        
        if (endConversationBtn) {
            endConversationBtn.addEventListener('click', () => {
                conversationModePlaceholder.innerHTML = '<p class="text-muted text-center mt-4">Conversation ended. Start a new conversation by clicking the button above.</p>';
            });
        }
        
        // Function to send a message in the conversation
        function sendConversationMessage(inputElement, sourceLang, targetLang, sender) {
            const message = inputElement.value.trim();
            if (!message) return;
            
            // Clear input
            inputElement.value = '';
            
            // Translate the message
            const translatedMessage = simulateTranslation(message, sourceLang, targetLang);
            
            // Add to conversation history
            const messageElement = document.createElement('div');
            messageElement.className = 'mb-3';
            messageElement.innerHTML = `
                <div class="d-flex align-items-start mb-1">
                    <strong class="me-2">${sender}:</strong>
                    <div>
                        <div class="original-message">${message}</div>
                        <div class="text-muted small">(Original: ${languageNames[sourceLang]})</div>
                    </div>
                </div>
                <div class="d-flex align-items-start ms-4">
                    <div class="me-2">↳</div>
                    <div>
                        <div class="translated-message">${translatedMessage}</div>
                        <div class="text-muted small">(Translated: ${languageNames[targetLang]})</div>
                    </div>
                </div>
            `;
            
            conversationHistory.appendChild(messageElement);
            
            // Scroll to the bottom of the conversation
            conversationHistory.scrollTop = conversationHistory.scrollHeight;
        }
    }
    
    // Function for direct offline translation in case API fails
    function fallbackTranslation(text, sourceLang, targetLang) {
        // German to English translations for common phrases
        const deToEn = {
            'Hallo': 'Hello',
            'Guten Tag': 'Good day',
            'Auf Wiedersehen': 'Goodbye',
            'Danke': 'Thank you',
            'Bitte': 'Please',
            'Ja': 'Yes',
            'Nein': 'No',
            'Entschuldigung': 'Sorry',
            'Ich verstehe nicht': 'I don\'t understand',
            'Sprechen Sie Englisch': 'Do you speak English',
            'Wo ist': 'Where is',
            'Wie viel kostet das': 'How much does this cost',
            'Hilfe': 'Help',
            'Ich brauche': 'I need',
            'Arbeit': 'work',
            'Schule': 'school',
            'Krankenhaus': 'hospital',
            'Ich suche': 'I am looking for',
            'Wohnung': 'apartment',
            'Geld': 'money',
            'Essen': 'food',
            'Wasser': 'water',
            'gut': 'good',
            'schlecht': 'bad',
            'heute': 'today',
            'morgen': 'tomorrow',
            'gestern': 'yesterday'
        };
        
        // English to German translations
        const enToDe = {};
        // Reverse the deToEn map to create enToDe
        Object.keys(deToEn).forEach(key => {
            enToDe[deToEn[key]] = key;
        });
        
        // Spanish to English
        const esToEn = {
            'Hola': 'Hello',
            'Buenos días': 'Good morning',
            'Adiós': 'Goodbye',
            'Gracias': 'Thank you',
            'Por favor': 'Please',
            'Sí': 'Yes',
            'No': 'No',
            'Lo siento': 'Sorry',
            'No entiendo': 'I don\'t understand',
            '¿Habla inglés?': 'Do you speak English',
            '¿Dónde está?': 'Where is',
            '¿Cuánto cuesta?': 'How much does this cost',
            'Ayuda': 'Help',
            'Necesito': 'I need',
            'trabajo': 'work',
            'escuela': 'school',
            'hospital': 'hospital',
            'Estoy buscando': 'I am looking for',
            'apartamento': 'apartment',
            'dinero': 'money',
            'comida': 'food',
            'agua': 'water',
            'bueno': 'good',
            'malo': 'bad',
            'hoy': 'today',
            'mañana': 'tomorrow',
            'ayer': 'yesterday'
        };
        
        // Determine which translation map to use
        let translationMap = null;
        
        if (sourceLang === 'de' && targetLang === 'en') {
            translationMap = deToEn;
        } else if (sourceLang === 'en' && targetLang === 'de') {
            translationMap = enToDe;
        } else if (sourceLang === 'es' && targetLang === 'en') {
            translationMap = esToEn;
        }
        
        // If we have a translation map, use it for word-by-word translation
        if (translationMap) {
            let translatedText = text;
            
            // Replace known words and phrases
            Object.keys(translationMap).forEach(phrase => {
                const regex = new RegExp('\\b' + phrase + '\\b', 'gi');
                translatedText = translatedText.replace(regex, translationMap[phrase]);
            });
            
            // If we couldn't translate anything, add a note
            if (translatedText === text) {
                translatedText += ' [Fallback Translation Mode - API Connection Issue]';
            } else {
                translatedText += ' [Fallback Translation]';
            }
            
            return translatedText;
        }
        
        // Use the old simulator as final fallback
        return simulateTranslation(text, sourceLang, targetLang);
    }
    
    // Function to simulate translation (used as fallback when API is unavailable)
    function simulateTranslation(text, sourceLang, targetLang) {
        if (!text) return '';
        if (sourceLang === targetLang) return text;
        
        console.warn('Using simulated translation as fallback. Real API translation is recommended.');
        
        // Get the names of the languages for display
        const sourceLanguageName = languageNames[sourceLang === 'auto' ? 'en' : sourceLang];
        const targetLanguageName = languageNames[targetLang];
        
        // Some very basic demo translations
        const demoTranslations = {
            en: {
                es: {
                    'Hello': 'Hola',
                    'How are you?': '¿Cómo estás?',
                    'Thank you': 'Gracias',
                    'My name is': 'Me llamo',
                    'I need help': 'Necesito ayuda',
                    'Where is': 'Dónde está',
                    'job': 'trabajo',
                    'work': 'trabajo',
                    'help': 'ayuda',
                    'money': 'dinero',
                    'house': 'casa',
                    'food': 'comida',
                    'water': 'agua'
                },
                fr: {
                    'Hello': 'Bonjour',
                    'How are you?': 'Comment allez-vous?',
                    'Thank you': 'Merci',
                    'My name is': 'Je m\'appelle',
                    'I need help': 'J\'ai besoin d\'aide',
                    'Where is': 'Où est',
                    'job': 'travail',
                    'work': 'travail',
                    'help': 'aide',
                    'money': 'argent',
                    'house': 'maison',
                    'food': 'nourriture',
                    'water': 'eau'
                },
                de: {
                    'Hello': 'Hallo',
                    'How are you?': 'Wie geht es dir?',
                    'Thank you': 'Danke',
                    'My name is': 'Ich heiße',
                    'I need help': 'Ich brauche Hilfe',
                    'Where is': 'Wo ist',
                    'job': 'Arbeit',
                    'work': 'Arbeit',
                    'help': 'Hilfe',
                    'money': 'Geld',
                    'house': 'Haus',
                    'food': 'Essen',
                    'water': 'Wasser'
                },
                pt: {
                    'Hello': 'Olá',
                    'How are you?': 'Como está?',
                    'Thank you': 'Obrigado',
                    'My name is': 'Meu nome é',
                    'I need help': 'Preciso de ajuda',
                    'Where is': 'Onde está',
                    'job': 'trabalho',
                    'work': 'trabalho',
                    'help': 'ajuda',
                    'money': 'dinheiro',
                    'house': 'casa',
                    'food': 'comida',
                    'water': 'água'
                }
            }
        };
        
        // Attempt to match some phrases for the demo
        let translatedText = text;
        
        // Check if we have a demo translation for this language pair
        if (demoTranslations[sourceLang] && demoTranslations[sourceLang][targetLang]) {
            const translations = demoTranslations[sourceLang][targetLang];
            
            // Replace known phrases
            Object.keys(translations).forEach(phrase => {
                const regex = new RegExp('\\b' + phrase + '\\b', 'gi');
                translatedText = translatedText.replace(regex, translations[phrase]);
            });
        }
        
        // If we don't have a demo translation or it didn't match anything,
        // just append a note indicating it would be translated
        if (translatedText === text) {
            translatedText = text + ' [Translation from ' + sourceLanguageName + ' to ' + targetLanguageName + ']';
        }
        
        return translatedText;
    }
    
    // Helper function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Initialize the page
    initializeVisualizer();
    
    // Function to initialize the audio visualizer
    function initializeVisualizer() {
        const visualizer = document.querySelector('.audio-visualizer');
        if (visualizer) {
            // Add CSS for the visualizer
            const style = document.createElement('style');
            style.textContent = `
                .audio-visualizer {
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    height: 70px;
                    gap: 5px;
                }
                .audio-visualizer .bar {
                    width: 8px;
                    height: 10px;
                    background-color: #dc3545;
                    border-radius: 3px;
                }
                .audio-visualizer .bar.animate {
                    animation: sound linear infinite;
                }
                @keyframes sound {
                    0% {
                        height: 10px;
                    }
                    50% {
                        height: 50px;
                    }
                    100% {
                        height: 10px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
});
