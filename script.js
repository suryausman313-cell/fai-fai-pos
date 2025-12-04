// Simple demo credentials (change here)
const CREDENTIALS = {
  admin: { user: 'admin', pass: 'admin123' },
  cashier: { user: 'cashier', pass: 'cashier123' }
};

// storage keys
const PRODUCTS_KEY = 'ff_products';

// util
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

// theme
const themeToggle = qs('#themeToggle');
themeToggle.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  if (cur==='dark'){ document.documentElement.removeAttribute('data-theme'); themeToggle.textContent='Dark'; }
  else { document.documentElement.setAttribute('data-theme','dark'); themeToggle.textContent='Light'; }
});

// install prompt (PWA)
let deferredPrompt;
const installBtn = qs('#installBtn');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); deferredPrompt = e; installBtn.style.display='inline-block';
});
installBtn.addEventListener('click', async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  const ans = await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.style.display='none';
});

// product storage
function loadProducts(){ return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]'); }
function saveProducts(arr){ localStorage.setItem(PRODUCTS_KEY, JSON.stringify(arr)); }

// render products in admin
function renderProductsList(){
  const list = qs('#productList'); list.innerHTML='';
  loadProducts().forEach((p, i)=>{
    const li = document.createElement('li');
    li.textContent = `${p.name} — ₹${p.price}`;
    const del = document.createElement('button'); del.textContent='Delete'; del.className='btn';
    del.onclick = ()=>{ const arr = loadProducts(); arr.splice(i,1); saveProducts(arr); renderProductsList(); renderMenu(); }
    li.appendChild(del); list.appendChild(li);
  });
}

// render menu for cashier
function renderMenu(){
  const container = qs('#menuList'); container.innerHTML='';
  loadProducts().forEach((p, i)=>{
    const d = document.createElement('div'); d.className='menu-item';
    d.innerHTML = `<strong>${p.name}</strong><div>₹${p.price}</div>`;
    d.onclick = ()=>{
      addToCart({...p, qty:1});
    }
    container.appendChild(d);
  });
}

// cart handling
let CART = [];
function addToCart(item){
  const found = CART.find(x=>x.name===item.name);
  if(found) found.qty++;
  else CART.push(item);
  renderCart();
}
function renderCart(){
  const ul = qs('#cartItems'); ul.innerHTML='';
  let total = 0;
  CART.forEach((c, i)=>{
    const li = document.createElement('li'); li.textContent = `${c.name} x ${c.qty} — ₹${(c.price*c.qty).toFixed(2)}`;
    const rm = document.createElement('button'); rm.textContent='-'; rm.className='btn';
    rm.onclick = ()=>{ c.qty--; if(c.qty<=0) CART.splice(i,1); renderCart(); }
    li.appendChild(rm); ul.appendChild(li);
    total += c.price*c.qty;
  });
  qs('#total').textContent = total.toFixed(2);
}

// login handling
let loginFor='admin';
qs('#adminBtn').onclick = ()=>{ loginFor='admin'; openLogin('Admin Login'); }
qs('#cashierBtn').onclick = ()=>{ loginFor='cashier'; openLogin('Cashier Login'); }
function openLogin(title){ qs('#loginMsg').textContent=''; qs('#loginTitle').textContent=title; qs('#loginModal').classList.remove('hidden'); }
qs('#loginCancel').onclick = ()=>qs('#loginModal').classList.add('hidden');

qs('#loginSubmit').onclick = ()=>{
  const u = qs('#username').value.trim();
  const p = qs('#password').value.trim();
  const cred = loginFor === 'admin' ? CREDENTIALS.admin : CREDENTIALS.cashier;
  if(u===cred.user && p===cred.pass){
    qs('#loginModal').classList.add('hidden');
    if(loginFor==='admin') openAdmin();
    else openCashier();
  } else {
    qs('#loginMsg').textContent = 'Invalid credentials';
  }
}

// open panels
function openAdmin(){ qs('#adminPanel').classList.remove('hidden'); qs('#welcome').classList.add('hidden'); renderProductsList(); }
qs('#adminBack').onclick = ()=>{ qs('#adminPanel').classList.add('hidden'); qs('#welcome').classList.remove('hidden'); }

function openCashier(){ qs('#cashierArea').classList.remove('hidden'); qs('#welcome').classList.add('hidden'); renderMenu(); }
qs('#cashierBack').onclick = ()=>{ qs('#cashierArea').classList.add('hidden'); qs('#welcome').classList.remove('hidden'); }

// admin add product
qs('#addProduct').onclick = ()=>{
  const name = qs('#pName').value.trim(); const price = parseFloat(qs('#pPrice').value || 0);
  if(!name || !price) return alert('Add name and price');
  const arr = loadProducts(); arr.push({name,price}); saveProducts(arr);
  qs('#pName').value=''; qs('#pPrice').value=''; renderProductsList(); renderMenu();
}

// checkout -> print
qs('#checkout').onclick = ()=>{
  if(CART.length===0) return alert('Cart empty');
  const now = new Date().toLocaleString();
  qs('#rDate').textContent = now;
  const ul = qs('#rItems'); ul.innerHTML='';
  let total = 0;
  CART.forEach(c=>{
    const li = document.createElement('li'); li.textContent = `${c.name} x ${c.qty} — ₹${(c.price*c.qty).toFixed(2)}`;
    ul.appendChild(li); total += c.price*c.qty;
  });
  qs('#rTotal').textContent = total.toFixed(2);
  // open print view
  window.print();
  // clear cart
  CART = []; renderCart();
}

// export/download zip note (just demo)
qs('#exportBtn').onclick = ()=>{
  alert('To download project as ZIP: go to the GitHub repo -> Code -> Download ZIP. For full backup, clone repo locally.');
}

// init
renderProductsList(); renderMenu();

// PWA: register service worker
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('service-worker.js').catch(()=>console.log('sw failed'));
}
