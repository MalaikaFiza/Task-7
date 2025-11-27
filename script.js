// ====== Mobile menu toggle & active nav highlight ======
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('main-nav');
menuToggle?.addEventListener('click', () => nav.classList.toggle('active'));

function setActiveNav() {
  const links = document.querySelectorAll('.nav-link');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current || (href === 'index.html' && current === '')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}
setActiveNav();

// ====== Smooth scroll for anchors ======
document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href.includes('contact.html') || href.includes('about.html') || href.includes('dashboard.php')) return;
    const id = href.split('#')[1];
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nav.classList.remove('active');
    }
  });
});

// ====== Reveal on scroll ======
const revealEls = document.querySelectorAll('.card, .project-card, .team-card, .hero-text, .split-image, .split-text, .service-card');
revealEls.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'transform .8s ease, opacity .8s ease';
});
function revealOnScroll(){
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ====== Dynamic content (services example) ======
const services = [
  {icon:"https://cdn-icons-png.flaticon.com/512/1006/1006771.png", title:"Web Design", desc:"Designing clean, modern interfaces and layouts for websites and apps."},
  {icon:"https://cdn-icons-png.flaticon.com/512/1006/1006777.png", title:"Front-End Development", desc:"Building responsive, accessible sites using semantic HTML, modern CSS and JS."},
  {icon:"https://cdn-icons-png.flaticon.com/512/2913/2913444.png", title:"UI Prototyping", desc:"Interactive prototypes and mockups to validate product flow and UI decisions."}
];
const servicesContainer = document.getElementById('services-container');
if (servicesContainer) {
  servicesContainer.innerHTML = services.map(s=>`
    <article class="service-card">
      <img class="card-icon" src="${s.icon}" alt="${s.title} icon" style="width:54px;margin-bottom:12px;">
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </article>`).join('');
  // mark as visible after insertion
  setTimeout(()=> document.querySelectorAll('.service-card').forEach(el => el.classList.add('visible')), 120);
}

// ====== Quotes fetch (example API integration) ======
const quotesContainer = document.getElementById('quotes-container');
if (quotesContainer) {
  fetch('https://type.fit/api/quotes')
    .then(res=>res.json())
    .then(data=>{
      const randomQuotes = data.slice(0,3);
      quotesContainer.innerHTML = randomQuotes.map(q=>`<blockquote>"${q.text}" - ${q.author||"Unknown"}</blockquote>`).join('');
    }).catch(()=>quotesContainer.textContent="Failed to load quotes.");
}

// ====== Contact form validation (client-side) ======
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();
    const status = document.getElementById('form-status');

    if (!name || !email || !message) {
      status.textContent = 'Please complete all required fields.';
      status.style.color = '#b91c1c';
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.style.color = '#b91c1c';
      return;
    }
    status.textContent = 'Message sent successfully — thank you!';
    status.style.color = '#065f46';
    contactForm.reset();
  });
}

// ====== Helper for escaping HTML (used by admin rendering) ======
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// ====== Admin: loadItems, deleteItem, confirmDelete ======
async function loadItems(searchTerm = '') {
  const container = document.getElementById('itemsContainer');
  if (!container) return;
  container.innerHTML = '<p>Loading...</p>';
  try {
    const res = await fetch('api_get_items.php');
    const data = await res.json();
    let items = data.items || [];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      items = items.filter(i => (i.title || '').toLowerCase().includes(q));
    }
    if (items.length === 0) {
      container.innerHTML = '<p>No items found.</p>';
      return;
    }
    let html = '<table class="items-table"><thead><tr><th>Title</th><th>Description</th><th>Created</th><th>Actions</th></tr></thead><tbody>';
    for (const it of items) {
      const shortDesc = (it.description || '').length > 140 ? it.description.slice(0,140) + '…' : it.description;
      html += `<tr data-id="${it.id}">
        <td>${escapeHtml(it.title)}</td>
        <td>${escapeHtml(shortDesc)}</td>
        <td>${escapeHtml(it.created_at)}</td>
        <td>
          <a class="btn ghost" href="edit_item.php?id=${it.id}">Edit</a>
          <button class="btn" onclick="confirmDelete(${it.id}, this)">Delete</button>
        </td>
      </tr>`;
    }
    html += '</tbody></table>';
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = '<p>Error loading items.</p>';
    console.error(err);
  }
}

function confirmDelete(id, btn) {
  if (!confirm('Delete this item? This action cannot be undone.')) return;
  deleteItem(id, btn);
}

async function deleteItem(id, btn) {
  btn.disabled = true;
  const original = btn.textContent;
  btn.textContent = 'Deleting...';
  try {
    const res = await fetch('delete_item.php', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({id})
    });
    const data = await res.json();
    if (data.status === 'success' || data.success === true) {
      const tr = document.querySelector(`tr[data-id="${id}"]`);
      if (tr) tr.remove();
    } else {
      alert('Delete failed: ' + (data.error || 'Unknown'));
    }
  } catch (err) {
    alert('Error deleting item.');
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
}
