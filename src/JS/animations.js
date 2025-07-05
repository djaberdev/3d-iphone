import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Hero Section
gsap.to(".hero__title", { opacity: 1, delay: 1.5 });
gsap.fromTo(".cta", { opacity: 0, y: 50 }, { opacity: 1, y: 0, delay: 1.5 });

// Highlights Section
const hTL = gsap.timeline({
    scrollTrigger: {
        trigger: "#highlights",
        start: "top-=20% 20%",
        end: "bottom top",
        // markers: true,
    },

    defaults: { 
        duration: 1,
        ease: "power1.inOut",
    }
});
    
hTL.to('.highlights__title', {
    opacity: 1,
    y: 0,    
});

hTL.fromTo('.highlights__links a',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, stagger: 0.25, duration: 0.5 },
    "-=0.5"
);

//? hTL => Hero timeline

// Take a close look Section
gsap.to('.closer__look__title', {
    opacity: 1,
    y: 0,
    ease: "power1.inOut",
    duration: 1,
    scrollTrigger: {
        trigger: ".closer__look",
        start: "-80 20%",
        end: "bottom top",
    }
});

// Features Section
gsap.to('.features__title', {
    opacity: 1,
    y: 0,
    ease: "power1.inOut",
    duration: 1,
    scrollTrigger: {
        trigger: ".features",
        start: "-80 20%",
        end: "bottom top",
    }
});

const fTL = gsap.timeline({
    scrollTrigger: {
        trigger: ".features",
        start: "center-=40 center",
        end: "bottom+=140 center",
        scrub: 0.6,
    },

    defaults: {
        duration: 1, 
        ease: "power1.inOut"
    }
});

fTL.fromTo('.media img', { scale: 1.3, opacity: 0.4 }, { scale: 1, opacity: 1 });
fTL.fromTo('.features__wrapper .details .paragraph', { y: 100 }, { y: 0, duration: 0.6 }, "-=1");

//? fTL => Features timeline

// How It Works Section
gsap.from('#chip', {
    scale: 1.5,
    opacity: 0,
    ease: "power2.inOut",
    duration: 2,
    scrollTrigger: {
        trigger: "#chip",
        start: "20% bottom"
    }
});

gsap.to('.paragraphs .paragraph, .GPU__info', 
    {
        opacity: 1,
        y: 0,
        ease: "power1.inOut",
        duration: 1,
        stagger: 0.35,
        scrollTrigger: {
            trigger: ".general__info",
            start: "40% bottom",
        }
    }
);