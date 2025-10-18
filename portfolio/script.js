// Step 1: Animate the image
gsap.fromTo(
  ".profile",
  { scale: 0, x: 0 },
  {
    scale: 1,
    x: 0,
    duration: 1,
    ease: "power2.out",
    onComplete: moveLeft
  }
);

function moveLeft() {
  setTimeout(() => {
    // Shift the profile to the left so content can reveal to the right
    const amount = window.innerWidth < 768 ? '-6vw' : '-8vw';

    gsap.to('.profile', {
      x: amount,
      scale: 0.95,
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => {
        // reveal other page elements
        document.body.classList.remove('before-shift');
  // add reveal class to elements we want animated in
    document.querySelectorAll('.top-nav, .bg-shapes, .typing-text, .projects, .contact, .projects-grid, .download-instruction.bottom, .site-footer').forEach(el => el.classList.add('reveal-after-shift'));
  // ensure the about section expands its max-height so it occupies layout space
  const aboutEl = document.querySelector('.about');
  if (aboutEl) { aboutEl.classList.add('reveal-after-shift'); aboutEl.classList.add('visible'); }
        startTyping();
      }
    });
  }, 600); // brief initial pause so entrance completes
}

// Step 2: Typing animation
function startTyping() {
  gsap.to(".typing-text", { opacity: 1, duration: 1 });

  // We'll reveal the about section after the first full loop completes.
  let loopCount = 0;

  new Typed("#typed", {
    strings: [
      "Hi, I'm Moneme Somadina...",
      "A Frontend Developer 💻",
      "A UI/UX Enthusiast 🎨",
    ],
    typeSpeed: 60,
    backSpeed: 50,
    loop: true,
    backDelay: 4000, // wait before deleting
    onComplete: function(self) {
      // not called for looped instances reliably; we'll use onLastStringBackspaced
    },
    onLastStringBackspaced: function() {
      // This runs after the last string has been fully backspaced.
      loopCount += 1;
      if (loopCount === 1) {
        const about = document.querySelector('.about');
        if (about) about.classList.add('visible');
      }
    }
  });
} 