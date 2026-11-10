document.addEventListener('DOMContentLoaded', () => {
    // ===== ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ =====
    const pages = document.querySelectorAll('.page');

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId) {
                page.classList.add('active');
            }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ===== БУРГЕР-МЕНЮ =====
    const burgerBtn = document.getElementById('burgerBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuClose = document.getElementById('menuClose');
    const menuItems = document.querySelectorAll('.menu-item');

    burgerBtn.addEventListener('click', () => {
        menuOverlay.classList.add('active');
    });

    menuClose.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
    });

    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove('active');
        }
    });

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.dataset.page;

            // "О нас" и "Музей" пока нерабочие
            if (targetPage === 'about' || targetPage === 'museum') {
                alert('Раздел "' + item.textContent + '" скоро будет доступен!');
                return;
            }

            // Обновляем активный пункт меню
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Переходим на страницу
            showPage(targetPage);
            menuOverlay.classList.remove('active');
        });
    });

    // ===== МОДАЛЬНОЕ ОКНО ПОИСКА =====
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');

searchBtn.addEventListener('click', () => {
    searchModal.classList.add('active');
    setTimeout(() => searchInput.focus(), 300);
});

searchClose.addEventListener('click', () => {
    searchModal.classList.remove('active');
    searchInput.value = '';
});

searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        searchModal.classList.remove('active');
        searchInput.value = '';
    }
});

    // Закрытие поиска по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchModal.classList.remove('active');
            menuOverlay.classList.remove('active');
            rateModal.classList.remove('active');
        }
    });

    // ===== ЗАГРУЗКА ИЗОБРАЖЕНИЯ =====
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const imageDropZone = document.getElementById('imageDropZone');
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    const previewImage = document.getElementById('previewImage');

    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    imageDropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            showPreview(file);
        }
    });

    imageDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageDropZone.classList.add('drag-over');
    });

    imageDropZone.addEventListener('dragleave', () => {
        imageDropZone.classList.remove('drag-over');
    });

    imageDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageDropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            showPreview(file);
        }
    });

    function showPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            imagePlaceholder.style.display = 'none';
            updatePalette();
        };
        reader.readAsDataURL(file);
    }

    function updatePalette() {
        const dots = document.querySelectorAll('.color-dot');
        const colors = [
            ['#c0392b', '#e74c3c', '#2c3e50', '#ecf0f1'],
            ['#2980b9', '#3498db', '#1a252f', '#f39c12'],
            ['#8e44ad', '#9b59b6', '#2c3e50', '#f1c40f'],
            ['#16a085', '#1abc9c', '#34495e', '#e67e22']
        ];
        const randomPalette = colors[Math.floor(Math.random() * colors.length)];
        dots.forEach((dot, i) => {
            dot.style.backgroundColor = randomPalette[i];
        });

        const fills = document.querySelectorAll('.analysis-card .progress-fill');
        fills.forEach(fill => {
            const randomWidth = Math.floor(Math.random() * 60) + 30;
            fill.style.width = randomWidth + '%';
        });
    }

    // ===== КНОПКА "СГЕНЕРИРОВАТЬ" =====
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.addEventListener('click', () => {
        showPage('page2');
    });

    // ===== КНОПКА НАЗАД =====
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', () => {
        showPage('page1');
    });

    // ===== АУДИОПЛЕЕР =====
    const playBtn = document.getElementById('playBtn');
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');
    const audioProgress = document.getElementById('audioProgress');
    let isPlaying = false;
    let progressInterval;

    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            let currentWidth = parseFloat(audioProgress.style.width) || 0;
            progressInterval = setInterval(() => {
                currentWidth += 0.5;
                if (currentWidth >= 100) {
                    currentWidth = 0;
                    isPlaying = false;
                    playIcon.style.display = 'block';
                    pauseIcon.style.display = 'none';
                    clearInterval(progressInterval);
                }
                audioProgress.style.width = currentWidth + '%';
            }, 100);
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            clearInterval(progressInterval);
        }
    });

    const progressTrack = document.querySelector('.progress-track');
    progressTrack.addEventListener('click', (e) => {
        const rect = progressTrack.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        audioProgress.style.width = Math.max(0, Math.min(100, percent)) + '%';
    });

    // ===== СЛАЙДЕРЫ =====
    const sliders = document.querySelectorAll('.custom-slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', () => {
            const percent = slider.value;
            slider.style.background = `linear-gradient(to right, #4a4a4a ${percent}%, #ffffff ${percent}%)`;
        });
        slider.dispatchEvent(new Event('input'));
    });

    // ===== МОДАЛЬНОЕ ОКНО ОЦЕНКИ =====
    const rateBtn = document.getElementById('rateBtn');
    const rateModal = document.getElementById('rateModal');
    const modalClose = document.getElementById('modalClose');
    const modalSubmit = document.getElementById('modalSubmit');
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    rateBtn.addEventListener('click', () => {
        rateModal.classList.add('active');
    });

    modalClose.addEventListener('click', () => {
        rateModal.classList.remove('active');
    });

    rateModal.addEventListener('click', (e) => {
        if (e.target === rateModal) {
            rateModal.classList.remove('active');
        }
    });

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.dataset.value);
            selectedRating = value;

            // Обновляем визуал звёзд
            stars.forEach((s, index) => {
                if (index < value) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });

        // Hover-эффект
        star.addEventListener('mouseenter', () => {
            const value = parseInt(star.dataset.value);
            stars.forEach((s, index) => {
                if (index < value) {
                    s.style.color = 'var(--color-yellow)';
                    s.querySelector('svg').style.fill = 'var(--color-yellow)';
                } else {
                    s.style.color = 'var(--color-gray)';
                    s.querySelector('svg').style.fill = 'none';
                }
            });
        });
    });

    // Сброс hover при уходе с контейнера
    const starsContainer = document.getElementById('starsContainer');
    starsContainer.addEventListener('mouseleave', () => {
        stars.forEach((s, index) => {
            if (index < selectedRating) {
                s.style.color = 'var(--color-yellow)';
                s.querySelector('svg').style.fill = 'var(--color-yellow)';
            } else {
                s.style.color = 'var(--color-gray)';
                s.querySelector('svg').style.fill = 'none';
            }
        });
    });

    modalSubmit.addEventListener('click', () => {
        if (selectedRating === 0) {
            alert('Пожалуйста, выберите оценку!');
            return;
        }
        alert('Спасибо! Вы поставили ' + selectedRating + ' ' + getStarWord(selectedRating) + '.');
        rateModal.classList.remove('active');
        selectedRating = 0;
        stars.forEach(s => {
            s.classList.remove('active');
            s.style.color = 'var(--color-gray)';
            s.querySelector('svg').style.fill = 'none';
        });
    });

    function getStarWord(n) {
        if (n === 1) return 'звезду';
        if (n >= 2 && n <= 4) return 'звезды';
        return 'звёзд';
    }
});