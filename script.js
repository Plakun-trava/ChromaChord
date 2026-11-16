document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://127.0.0.1:8000';
    const TEMBRES = ['Piano', 'Marimba', 'Music box', 'Soft synth'];
    const MUSEUM_URL = 'https://garagemca.org/';

    function formatTime(seconds) {
        if (!seconds || !isFinite(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function sliderPercent(slider) {
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value);
        return ((val - min) / (max - min)) * 100;
    }

    function setSlider(label, value) {
        const slider = document.querySelector(`.custom-slider[aria-label="${label}"]`);
        if (!slider) return;
        slider.value = value;
        const p = sliderPercent(slider);
        slider.style.background = `linear-gradient(to right, #4a4a4a ${p}%, #ffffff ${p}%)`;
    }

    const pages = document.querySelectorAll('.page');
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId) page.classList.add('active');
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function setActiveMenuItem(pageId) {
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        const target = document.querySelector(`.menu-item[data-page="${pageId}"]`);
        if (target) target.classList.add('active');
    }

    // ===== БУРГЕР-МЕНЮ =====
    const burgerBtn = document.getElementById('burgerBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuClose = document.getElementById('menuClose');
    const menuItems = document.querySelectorAll('.menu-item');

    burgerBtn.addEventListener('click', () => menuOverlay.classList.add('active'));
    menuClose.addEventListener('click', () => menuOverlay.classList.remove('active'));
    menuOverlay.addEventListener('click', (e) => { if (e.target === menuOverlay) menuOverlay.classList.remove('active'); });

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.page;

            if (target === 'museum') {
                window.open(MUSEUM_URL, '_blank', 'noopener');
                menuOverlay.classList.remove('active');
                return;
            }

            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            if (target === 'page1') showPage('page1');
            if (target === 'about') showPage('page3');

            menuOverlay.classList.remove('active');
        });
    });

        // ===== ПОИСК ПО САЙТУ =====
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // "База данных" для поиска по сайту (можно легко расширять)
    const searchData = [
        { title: 'Генерация музыки', desc: 'Загрузить изображение и получить звуковую интерпретацию', page: 'page1' },
        { title: 'О нас', desc: 'Информация о команде РГУ Косыгина и принцип работы алгоритма', page: 'page3' },
        { title: 'Музей Гараж', desc: 'Перейти на официальный сайт музея-партнёра', page: 'museum' },
        { title: 'Экспорт WAV', desc: 'Скачать сгенерированный аудиофайл на компьютер', page: 'page2' },
        { title: 'Настройки звука', desc: 'Изменение темпа, длительности, тембра и плотности нот', page: 'page2' },
        { title: 'Палитра и энтропия', desc: 'Результаты анализа цветов и визуальной сложности изображения', page: 'page1' },
        { title: 'Оценить результат', desc: 'Оставить отзыв о качестве сгенерированной музыки', page: 'page2' }
    ];

    searchBtn.addEventListener('click', () => {
        searchModal.classList.add('active');
        setTimeout(() => {
            searchInput.focus();
            performSearch(''); // Показать подсказку при открытии
        }, 300);
    });

    searchClose.addEventListener('click', () => {
        searchModal.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    });

    // Живой поиск при вводе текста
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    function performSearch(query) {
        searchResults.innerHTML = '';
        const lowerQuery = query.toLowerCase().trim();

        if (!lowerQuery) {
            return;
        }

        // Фильтрация по заголовку или описанию
        const filtered = searchData.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.desc.toLowerCase().includes(lowerQuery)
        );

        if (filtered.length === 0) {
            searchResults.innerHTML = `<div class="search-no-results">По запросу "${query}" ничего не найдено. Попробуйте другие слова.</div>`;
            return;
        }

        // Отрисовка результатов
        filtered.forEach(item => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `
                <div class="search-result-title">${item.title}</div>
                <div class="search-result-desc">${item.desc}</div>
            `;
            
            // Клик по результату поиска
            div.addEventListener('click', () => {
                if (item.page === 'museum') {
                    window.open('https://garagemca.org/', '_blank', 'noopener');
                } else {
                    showPage(item.page);
                    // Синхронизируем меню
                    if (item.page === 'page1') setActiveMenuItem('page1');
                    if (item.page === 'page3') setActiveMenuItem('about');
                }
                // Закрываем поиск и очищаем поле
                searchModal.classList.remove('active');
                searchInput.value = '';
                searchResults.innerHTML = '';
            });
            
            searchResults.appendChild(div);
        });
    }
    // ===== ЗАГРУЗКА ИЗОБРАЖЕНИЯ =====
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const imageDropZone = document.getElementById('imageDropZone');
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    const previewImage = document.getElementById('previewImage');
    let uploadedFile = null;

    uploadBtn.addEventListener('click', () => fileInput.click());
    imageDropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => { if (e.target.files[0]) handleFileUpload(e.target.files[0]); });
    imageDropZone.addEventListener('dragover', (e) => { e.preventDefault(); imageDropZone.classList.add('drag-over'); });
    imageDropZone.addEventListener('dragleave', () => { imageDropZone.classList.remove('drag-over'); });
    imageDropZone.addEventListener('drop', (e) => {
        e.preventDefault(); imageDropZone.classList.remove('drag-over');
        if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
    });

    async function handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            imagePlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
        uploadedFile = file;
        await analyzeImage(file);
    }

    async function analyzeImage(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch(`${API_BASE}/api/analyze`, { method: 'POST', body: formData });
            if (!response.ok) throw new Error((await response.json()).error || 'Ошибка анализа');
            const data = await response.json();

            const palette = document.getElementById('palette');
            palette.innerHTML = '';
            data.palette.forEach(color => {
                const dot = document.createElement('div');
                dot.className = 'color-dot';
                dot.style.backgroundColor = color;
                palette.appendChild(dot);
            });

            document.getElementById('brightnessFill').style.width = data.brightness + '%';
            document.getElementById('saturationFill').style.width = data.saturation + '%';
            document.getElementById('contrastFill').style.width = data.contrast + '%';
            document.getElementById('entropyFill').style.width = (data.entropy / 2 * 100) + '%';
        } catch (error) {
            alert('Ошибка при анализе: ' + error.message);
        }
    }

    // ===== ГЕНЕРАЦИЯ МУЗЫКИ =====
    async function generateMusic(file, duration, tempo, density, timbre) {
        const generateBtn = document.getElementById('generateBtn');
        const regenerateBtn = document.getElementById('regenerateBtn');
        const activeBtn = generateBtn ? generateBtn : regenerateBtn;

        const originalText = activeBtn.textContent;
        activeBtn.textContent = 'Генерация...';
        activeBtn.disabled = true;

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('duration', duration);
            formData.append('tempo', tempo);
            formData.append('density', density);
            formData.append('timbre', timbre);

            const response = await fetch(`${API_BASE}/api/generate`, { method: 'POST', body: formData });
            if (!response.ok) throw new Error((await response.json()).error || 'Ошибка генерации');
            const data = await response.json();

            showPage('page2');

            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.src = 'data:audio/wav;base64,' + data.audio_base64;

            const audioProgress = document.getElementById('audioProgress');
            const timeDisplay = document.getElementById('timeDisplay');
            audioProgress.style.width = '0%';
            const totalSec = data.used_duration || duration || 30;
            if (timeDisplay) timeDisplay.textContent = '00:00 / ' + formatTime(totalSec);

            const explanationText = document.getElementById('explanationText');
            if (explanationText) explanationText.textContent = data.explain;

            if (data.used_tempo !== undefined) setSlider('Темп', ((data.used_tempo - 40) / 160) * 100);
            if (data.used_duration !== undefined) setSlider('Длительность', ((data.used_duration - 20) / 40) * 100);
            if (data.used_density !== undefined) setSlider('Плотность', data.used_density);
            if (data.used_timbre !== undefined) {
                const idx = TEMBRES.indexOf(data.used_timbre);
                if (idx !== -1) setSlider('Тембр', idx * 25 + 12);
            }
        } catch (error) {
            alert('Ошибка при генерации: ' + error.message);
        } finally {
            activeBtn.textContent = originalText;
            activeBtn.disabled = false;
        }
    }

    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            if (!uploadedFile) { alert('Сначала загрузите изображение!'); return; }
            await generateMusic(uploadedFile, 30, 90, 3, 'Piano');
        });
    }

    const regenerateBtn = document.getElementById('regenerateBtn');
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', async () => {
            if (!uploadedFile) { alert('Сначала загрузите изображение!'); return; }
            const tempo = Math.round(40 + (parseInt(document.getElementById('tempoSlider').value) / 100) * 160);
            const duration = Math.round(20 + (parseInt(document.getElementById('durationSlider').value) / 100) * 40);
            const density = parseInt(document.getElementById('densitySlider').value);
            const timbre = TEMBRES[Math.min(Math.floor(parseInt(document.getElementById('timbreSlider').value) / 25), 3)] || 'Piano';
            await generateMusic(uploadedFile, duration, tempo, density, timbre);
        });
    }

    // ===== КНОПКИ НАЗАД =====
    const backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.addEventListener('click', () => { showPage('page1'); setActiveMenuItem('page1'); });

    const backBtnAbout = document.getElementById('backBtnAbout');
    if (backBtnAbout) backBtnAbout.addEventListener('click', () => { showPage('page1'); setActiveMenuItem('page1'); });

    const goToGeneratorBtn = document.getElementById('goToGeneratorBtn');
    if (goToGeneratorBtn) goToGeneratorBtn.addEventListener('click', () => { showPage('page1'); setActiveMenuItem('page1'); });

    // ===== АУДИОПЛЕЕР =====
    const playBtn = document.getElementById('playBtn');
    const playIcon = playBtn?.querySelector('.play-icon');
    const pauseIcon = playBtn?.querySelector('.pause-icon');
    const audioProgress = document.getElementById('audioProgress');
    const audioPlayer = document.getElementById('audioPlayer');
    const timeDisplay = document.getElementById('timeDisplay');
    let isPlaying = false;

    if (audioPlayer) {
        audioPlayer.addEventListener('loadedmetadata', () => {
            if (audioPlayer.duration && isFinite(audioPlayer.duration)) {
                const cur = formatTime(audioPlayer.currentTime || 0);
                if (timeDisplay) timeDisplay.textContent = `${cur} / ${formatTime(audioPlayer.duration)}`;
            }
        });
        audioPlayer.addEventListener('timeupdate', () => {
            if (audioPlayer.duration && isFinite(audioPlayer.duration)) {
                audioProgress.style.width = (audioPlayer.currentTime / audioPlayer.duration) * 100 + '%';
                if (timeDisplay) {
                    timeDisplay.textContent = `${formatTime(audioPlayer.currentTime)} / ${formatTime(audioPlayer.duration)}`;
                }
            }
        });
        audioPlayer.addEventListener('ended', () => {
            isPlaying = false;
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
            audioProgress.style.width = '0%';
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (!audioPlayer || !audioPlayer.src) { alert('Сначала сгенерируйте музыку!'); return; }
            isPlaying = !isPlaying;
            if (isPlaying) { playIcon.style.display = 'none'; pauseIcon.style.display = 'block'; audioPlayer.play(); }
            else { playIcon.style.display = 'block'; pauseIcon.style.display = 'none'; audioPlayer.pause(); }
        });
    }

    const progressTrack = document.querySelector('.progress-track');
    if (progressTrack && audioPlayer) {
        progressTrack.addEventListener('click', (e) => {
            const rect = progressTrack.getBoundingClientRect();
            if (audioPlayer.duration && isFinite(audioPlayer.duration)) {
                audioPlayer.currentTime = ((e.clientX - rect.left) / rect.width) * audioPlayer.duration;
            }
        });
    }

    // ===== СЛАЙДЕРЫ =====
    document.querySelectorAll('.custom-slider').forEach(slider => {
        slider.addEventListener('input', () => {
            const p = sliderPercent(slider);
            slider.style.background = `linear-gradient(to right, #4a4a4a ${p}%, #ffffff ${p}%)`;
        });
        const p = sliderPercent(slider);
        slider.style.background = `linear-gradient(to right, #4a4a4a ${p}%, #ffffff ${p}%)`;
    });

    // ===== ЭКСПОРТ WAV =====
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            if (!audioPlayer || !audioPlayer.src) { alert('Сначала сгенерируйте музыку!'); return; }
            const link = document.createElement('a');
            link.href = audioPlayer.src;
            link.download = 'chromachord_result.wav';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // ===== МОДАЛЬНОЕ ОКНО ОЦЕНКИ =====
    const rateBtn = document.getElementById('rateBtn');
    const rateModal = document.getElementById('rateModal');
    const modalClose = document.getElementById('modalClose');
    const modalSubmit = document.getElementById('modalSubmit');
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    if (rateBtn) rateBtn.addEventListener('click', () => rateModal.classList.add('active'));
    if (modalClose) modalClose.addEventListener('click', () => rateModal.classList.remove('active'));
    if (rateModal) rateModal.addEventListener('click', (e) => { if (e.target === rateModal) rateModal.classList.remove('active'); });

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.value);
            stars.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
        });
        star.addEventListener('mouseenter', () => {
            const val = parseInt(star.dataset.value);
            stars.forEach((s, i) => {
                s.style.color = i < val ? 'var(--color-yellow)' : 'var(--color-gray)';
                s.querySelector('svg').style.fill = i < val ? 'var(--color-yellow)' : 'none';
            });
        });
    });

    document.getElementById('starsContainer')?.addEventListener('mouseleave', () => {
        stars.forEach((s, i) => {
            s.style.color = i < selectedRating ? 'var(--color-yellow)' : 'var(--color-gray)';
            s.querySelector('svg').style.fill = i < selectedRating ? 'var(--color-yellow)' : 'none';
        });
    });

    if (modalSubmit) {
        modalSubmit.addEventListener('click', () => {
            if (selectedRating === 0) { alert('Пожалуйста, выберите оценку!'); return; }
            alert('Спасибо! Вы поставили ' + selectedRating + ' звёзд.');
            rateModal.classList.remove('active');
            selectedRating = 0;
            stars.forEach(s => { s.classList.remove('active'); s.style.color = 'var(--color-gray)'; s.querySelector('svg').style.fill = 'none'; });
        });
    }

    // ===== ESCAPE =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (searchModal) searchModal.classList.remove('active');
            if (menuOverlay) menuOverlay.classList.remove('active');
            if (rateModal) rateModal.classList.remove('active');
        }
    });
});
