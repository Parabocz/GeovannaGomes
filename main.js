import './style.css'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Swiper from 'swiper'
import { Pagination } from 'swiper/modules'

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

// 1. Initialize Lenis (Smooth Scroll)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// 2. GSAP Animations

// Hero Ken Burns Effect
gsap.to('.hero-video', {
  scale: 1, // scales down from 1.1 (CSS) to 1 over scroll/time
  duration: 10,
  ease: 'power1.out',
})

// Hero Fade-ups (Stagger)
gsap.to('.hero .fade-up', {
  y: 0,
  opacity: 1,
  duration: 1,
  stagger: 0.2,
  ease: 'power3.out',
  delay: 0.5
})

// ScrollTrigger Fade-ups for the rest of the page
const fadeElements = gsap.utils.toArray('section .fade-up, footer .fade-up')
fadeElements.forEach(el => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 85%', // triggers when the top of the element hits 85% of the viewport
      toggleActions: 'play none none none' // only play once
    },
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out'
  })
})

// Counter Animations for Trust Banner
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  const target = parseFloat(counter.getAttribute('data-target'));
  const decimals = parseInt(counter.getAttribute('data-decimals') || '0');
  
  let obj = { val: 0 };
  
  gsap.to(obj, {
    val: target,
    duration: 2.5,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.trust-banner',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    onUpdate: () => {
      counter.innerHTML = obj.val.toFixed(decimals);
    }
  });
});

// 3. Swiper Carousel (Mobile only logic)
let swiperInstance = null;

const initSwiper = () => {
  const isMobile = window.innerWidth <= 900;
  
  if (isMobile && !swiperInstance) {
    // Initialize Swiper
    swiperInstance = new Swiper('.swiper-services', {
      modules: [Pagination],
      slidesPerView: 1.1,
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        600: {
          slidesPerView: 2.1,
        }
      }
    });
  } else if (!isMobile && swiperInstance) {
    // Destroy Swiper if window resized to desktop
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }
}

// Initial check
initSwiper();

// Re-check on resize
window.addEventListener('resize', initSwiper);
