import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

// Initialize Swiper
const swiper = new Swiper('.swiper', {
    
    speed: 1200,
    spaceBetween: 30,
    loop: true,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },

    // Autoplay Progress Calculations
    on: {
        autoplayTimeLeft(s, time, progress) {
            document.querySelector('.autoplay-progress svg').style.setProperty("--progress", 1 - progress);
            document.querySelector('.autoplay-progress span').textContent = `${Math.ceil(time / 1000)}s`;
        }
    }

});

// Restart the autoplay
document.getElementById('restartBtn').addEventListener('click', () => {
    swiper.autoplay.start();
});