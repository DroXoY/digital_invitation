// Get elements
const openBtn = document.getElementById('open-invitation');
const gate = document.getElementById('gate');
const mainContent = document.getElementById('main-content');
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = musicToggle.querySelector('i');
let isPlaying = false;

// Function to handle open invitation
openBtn.addEventListener('click', () => {
    // Add slide up class
    gate.classList.add('gate-slide-up');

    // Show main content
    mainContent.classList.remove('hidden-content');
    mainContent.classList.add('show-content');

    // Start music
    bgMusic.play().then(() => {
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-compact-disc');
    }).catch(error => {
        console.log("Audio playback was prevented. User needs to interact first.");
    });

    // Wait for gate animation to finish, then remove it from DOM to prevent scrolling issues
    setTimeout(() => {
        gate.style.display = 'none';
        window.scrollTo(0, 0); // Reset scroll to top
    }, 1000);
});

// Music Toggle
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        isPlaying = false;
        musicToggle.classList.remove('playing');
        musicIcon.classList.add('fa-music');
        musicIcon.classList.remove('fa-compact-disc');
    } else {
        bgMusic.play();
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-compact-disc');
    }
});

// Countdown Timer logic
// Target date: 15 November 2026, 10:00:00
const targetDate = new Date("Aug 9, 2026 18:00:00").getTime();

const timerInterval = setInterval(function () {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        clearInterval(timerInterval);
        document.getElementById("countdown").innerHTML = "<h3>The event has started!</h3>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

}, 1000);


// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animElements = document.querySelectorAll('.slide-up-anim');
    animElements.forEach(el => observer.observe(el));

    // Set guest name from URL parameter if available (?to=Guest+Name)
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        document.getElementById('guest-name').innerText = guestName;
    }
});

// Gallery Modal functions
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");

function openModal(src) {
    modal.style.display = "flex";
    modalImg.src = src;
}

function closeModal() {
    modal.style.display = "none";
}

// Close modal when clicking outside image
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Wishes Form Logic
function addWish(event) {
    event.preventDefault();

    const name = document.getElementById('wish-name').value;
    const msg = document.getElementById('wish-msg').value;

    if (!name || !msg) return;

    const list = document.getElementById('wishes-list');

    const div = document.createElement('div');
    div.className = 'wish-item';

    const h4 = document.createElement('h4');
    h4.textContent = name;

    const p = document.createElement('p');
    p.textContent = msg;

    const span = document.createElement('span');
    span.className = 'wish-time';
    span.textContent = 'Just now';

    div.appendChild(h4);
    div.appendChild(p);
    div.appendChild(span);

    // Add to top of list
    list.insertBefore(div, list.firstChild);

    // Reset form
    event.target.reset();
}
