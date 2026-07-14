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

// Wishes Form Logic - Moved to handle UI update after Supabase success
function addWishToDOM(name, msg) {
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
}

// Inisialisasi Supabase
const SUPABASE_URL = "https://omzgahymdhnyfdikikvj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9temdhaHltZGhueWZkaWtpa3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5OTU5ODksImV4cCI6MjA5OTU3MTk4OX0.8LYdQme-8nH6dys1TcgK9KFwdA--orzZy7rLVLDYdeM";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. LOGIKA UNTUK SUBMIT RSVP
const rsvpForm = document.getElementById('rsvp-form');
rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = rsvpForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = "Sending...";
    btn.disabled = true;

    const { data, error } = await supabaseClient
        .from('rsvp')
        .insert([
            {
                name: document.getElementById('rsvp-name').value,
                number_of_guest: parseInt(document.getElementById('rsvp-guests').value),
                attendance: document.querySelector('input[name="attendance"]:checked').value === 'yes'
            }
        ]);

    btn.disabled = false;
    btn.textContent = originalText;

    if (error) {
        alert("Error dari Supabase: " + error.message + "\nDetail: " + (error.details || ""));
        console.error("Supabase Error Object:", error);
    } else {
        alert("Thank you for your RSVP!");
        rsvpForm.reset();
    }
});

// 2. LOGIKA UNTUK SUBMIT WISH
const wishForm = document.getElementById('wishes-form');
wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('wish-name').value;
    const wishInput = document.getElementById('wish-text').value;
    const btn = wishForm.querySelector('button');
    const originalText = btn.textContent;

    btn.textContent = "Submitting...";
    btn.disabled = true;

    const { data, error } = await supabaseClient
        .from('wishes')
        .insert([
            {
                name: nameInput,
                wish: wishInput
            }
        ]);

    btn.disabled = false;
    btn.textContent = originalText;

    if (error) {
        alert("Error dari Supabase: " + error.message + "\nDetail: " + (error.details || ""));
        console.error("Supabase Error Object:", error);
    } else {
        addWishToDOM(nameInput, wishInput);
        wishForm.reset();
    }
});

async function getWishes() {
    const { data: wishes, error } = await supabaseClient
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false }); // Urutkan dari yang paling baru

    if (wishes) {
        const list = document.getElementById('wishes-list');
        list.innerHTML = ''; // Bersihkan ucapan bawaan (dummy)

        wishes.forEach(item => {
            const date = new Date(item.created_at);
            // Format waktu menjadi (cth: 15 Nov 2026, 10:00)
            const timeString = date.toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            const div = document.createElement('div');
            div.className = 'wish-item';

            const h4 = document.createElement('h4');
            h4.textContent = item.name;

            const p = document.createElement('p');
            p.textContent = item.wish;

            const span = document.createElement('span');
            span.className = 'wish-time';
            span.textContent = timeString;

            div.appendChild(h4);
            div.appendChild(p);
            div.appendChild(span);

            // Tambahkan ke dalam list
            list.appendChild(div);
        });
    } else if (error) {
        console.error("Failed to load wishes:", error);
    }
}

// Panggil fungsi getWishes saat halaman dimuat
getWishes();
