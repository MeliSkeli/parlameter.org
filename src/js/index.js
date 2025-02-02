import Promise from 'es6-promise';
import { fetch } from 'whatwg-fetch';
import AOS from 'aos';
import 'replaceme';


// ---
// Polyfill
// ---
if (!window.Promise) {
  window.Promise = Promise;
}
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// ---
// Animate/fade in elements on scroll
// ---
AOS.init({ duration: 800 });

// ---
// Loop text strings
// ---
const replaceElem = document.querySelector('.replace-me');
if (replaceElem) {
  new window.ReplaceMe(replaceElem, { speed: 5000 }).start();
}

// ---
// Smooth scroll to content on nav link click
// ---
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (href.indexOf('#') === 0) {
      event.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  });
});

// ---
// Handle language select
// ---
const langSelect = document.querySelector('.select-lang');
langSelect.addEventListener('change', (event) => {
  window.location = event.target.value;
});
langSelect.querySelectorAll('option').forEach((option) => {
  if (window.location.pathname.indexOf(option.value) === 0) {
    option.setAttribute('selected', true);
  }
});

// ---
// Carousel/Accordion combo
// ---
function changeCarousel(dt, i) {
  if (!dt.classList.contains('active')) {
    const imgs = document.querySelectorAll('.carousel img');
    imgs.forEach(img => img.classList.remove('active'));
    imgs[i % imgs.length].classList.add('active');
    dt.closest('dl').querySelectorAll('dt').forEach((e) => {
      const dd = e.nextElementSibling;
      const height = `${dd.firstElementChild.clientHeight}px`;
      dd.style.height = height;
      setTimeout(() => {
        dd.style.height = '0px';
      }, 0);
      e.classList.remove('active');
    });
    dt.classList.add('active');
    const dd = dt.nextElementSibling;
    const height = `${dd.firstElementChild.clientHeight}px`;
    dd.style.height = '0px';
    setTimeout(() => {
      dd.style.height = height;
    }, 0);
  }
}

let loopTID = null;

document.querySelectorAll('.carousel dt').forEach((dt, i) => {
  dt.addEventListener('click', (event) => {
    event.preventDefault();
    if (loopTID) {
      clearTimeout(loopTID);
      loopTID = null;
    }
    changeCarousel(dt, i);
  });
});

function loopCarousel(i) {
  const dts = document.querySelectorAll('.carousel dt');
  if (dts.length) {
    const idx = i % dts.length;
    const dt = dts[idx];
    changeCarousel(dt, idx);
    loopTID = setTimeout(() => {
      loopCarousel(i + 1);
    }, 8000);
  }
}

loopCarousel(0);


// ---
// Fix carousel height
// ---
const dl = document.querySelector('.carousel dl');
if (dl) {
  const height = dl.offsetHeight;
  let largest = 0;
  dl.querySelectorAll('dd > div').forEach((el) => {
    if (el.clientHeight > largest) {
      largest = el.clientHeight;
    }
  });
  dl.style.height = `${height + largest}px`;
}


// ---
// Contact form
// ---
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const btn = event.target.querySelector('button');
    const el = event.target.elements;
    const data = [
      `name=${encodeURIComponent(el.name.value)}`,
      `organization=${encodeURIComponent(el.organization.value)}`,
      `email=${encodeURIComponent(el.email.value)}`,
      `message=${encodeURIComponent(el.message.value)}`,
    ];

    btn.setAttribute('disabled', true);

    fetch(event.target.action, {
      method: event.target.method.toUpperCase(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data.join('&'),
    })
      .then(res => res.text())
      .then((text) => {
        if (text.toLowerCase().indexOf('error') === -1) {
          btn.textContent = 'Done!';
        } else {
          // eslint-disable-next-line no-console
          console.error(text);
          btn.removeAttribute('disabled');
          btn.textContent = 'Error :(';
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        btn.removeAttribute('disabled');
        btn.textContent = 'Error :(';
      });
  });
}
