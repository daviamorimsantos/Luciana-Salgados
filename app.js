const products = [
  {id:"coxinha",name:"Coxinha",desc:"Pacote com 15 unidades.",price:30,category:"fritos",tag:"Favorito",image:"assets/hero-assorted.jpg"},
  {id:"risoles",name:"Risoles",desc:"Presunto e queijo. 15 unidades.",price:30,category:"fritos",image:"assets/hero-assorted.jpg"},
  {id:"kibe",name:"Kibe",desc:"Pacote com 15 unidades.",price:30,category:"fritos",image:"assets/hero-assorted.jpg"},
  {id:"bolinha",name:"Bolinha de queijo",desc:"Pacote com 15 unidades.",price:30,category:"fritos",image:"assets/hero-assorted.jpg"},
  {id:"cento",name:"Cento frito",desc:"Misto de salgados fritos, 100 unidades.",price:100,category:"fritos",tag:"Para festas",image:"assets/hero-assorted.jpg"},
  {id:"esfiha",name:"Esfihas",desc:"Frango, calabresa com catupiry ou carne. Pacote com 15 unidades.",price:30,category:"assados",image:"assets/esfihas.jpg"},
  {id:"empada",name:"Empadinhas",desc:"Frango com catupiry ou palmito. Pacote com 15 unidades.",price:30,category:"assados",image:"assets/paozinho.jpg"},
  {id:"enroladinho",name:"Enroladinhos",desc:"Presunto, queijo e orégano. Pacote com 15 unidades.",price:30,category:"assados",image:"assets/paozinho.jpg"},
  {id:"troxinha",name:"Troxinha",desc:"Carne de hambúrguer e vinagrete. Pacote com 15 unidades.",price:30,category:"especiais",image:"assets/hero-assorted.jpg"},
  {id:"nhoque",name:"Nhoque",desc:"Pacote de 1 kg.",price:30,category:"especiais",image:"assets/menu-orange.jpg"}
];
const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
let cart = {};
const grid=document.querySelector("#productGrid"), drawer=document.querySelector("#cartDrawer"), overlay=document.querySelector("#overlay");
function renderProducts(filter="todos"){
  grid.innerHTML=products.filter(p=>filter==="todos"||p.category===filter).map(p=>`
  <article class="product-card"><div class="product-photo"><img src="${p.image}" alt="${p.name}" loading="lazy">${p.tag?`<span class="tag">${p.tag}</span>`:""}</div>
  <div class="product-info"><div><h3>${p.name}</h3><p>${p.desc}</p></div><div class="product-buy"><strong>${money(p.price)}</strong><button class="add-btn" data-add="${p.id}" aria-label="Adicionar ${p.name}">+</button></div></div></article>`).join("");
}
function renderCart(){
 const entries=Object.entries(cart).filter(([,q])=>q>0);
 document.querySelector("#cartCount").textContent=entries.reduce((s,[,q])=>s+q,0);
 document.querySelector("#cartTotal").textContent=money(entries.reduce((s,[id,q])=>s+products.find(p=>p.id===id).price*q,0));
 document.querySelector("#cartItems").innerHTML=entries.length?entries.map(([id,q])=>{const p=products.find(x=>x.id===id);return `<div class="cart-line"><div><strong>${p.name}</strong><small>${money(p.price)} cada</small></div><div class="qty"><button data-minus="${id}">−</button><b>${q}</b><button data-plus="${id}">+</button></div></div>`}).join(""):`<div class="empty">Sua sacola está vazia.<br>Escolha seus salgados favoritos!</div>`;
}
function showCart(){drawer.classList.add("open");overlay.classList.add("show")}
function hideCart(){drawer.classList.remove("open");overlay.classList.remove("show")}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]"); if(add){cart[add.dataset.add]=(cart[add.dataset.add]||0)+1;renderCart();showCart()}
 const plus=e.target.closest("[data-plus]");if(plus){cart[plus.dataset.plus]++;renderCart()}
 const minus=e.target.closest("[data-minus]");if(minus){cart[minus.dataset.minus]--;if(cart[minus.dataset.minus]<=0)delete cart[minus.dataset.minus];renderCart()}
 const filter=e.target.closest("[data-filter]");if(filter){document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===filter));renderProducts(filter.dataset.filter)}
});
document.querySelector("#openCart").onclick=showCart;document.querySelector("#closeCart").onclick=hideCart;overlay.onclick=hideCart;
document.querySelector("#checkoutBtn").onclick=()=>{if(!Object.keys(cart).length){alert("Adicione pelo menos um item à sacola.");return}hideCart();document.querySelector("#checkoutModal").classList.add("show")};
document.querySelector("#closeModal").onclick=()=>document.querySelector("#checkoutModal").classList.remove("show");
document.querySelector("#checkoutModal").addEventListener("click",e=>{if(e.target.id==="checkoutModal")e.currentTarget.classList.remove("show")});
document.querySelector("#checkoutForm").onsubmit=e=>{
 e.preventDefault();const data=new FormData(e.currentTarget);const items=Object.entries(cart).map(([id,q])=>{const p=products.find(x=>x.id===id);return `• ${q}x ${p.name} — ${money(p.price*q)}`}).join("\n");
 const total=Object.entries(cart).reduce((s,[id,q])=>s+products.find(p=>p.id===id).price*q,0);
 const msg=`Olá, Luciana! Gostaria de fazer um pedido:\n\n${items}\n\n*Total dos produtos: ${money(total)}*\n\n*Nome:* ${data.get("name")}\n*Entrega/retirada:* ${data.get("delivery")}\n*Endereço:* ${data.get("address")||"A combinar"}\n*Observações:* ${data.get("notes")||"Nenhuma"}\n\nPode confirmar a disponibilidade, por favor?`;
 window.open("https://wa.me/5517997677843?text="+encodeURIComponent(msg),"_blank");
};
document.querySelector("#year").textContent=new Date().getFullYear();
document.querySelector("#menuToggle").onclick=()=>document.querySelector("nav").classList.toggle("mobile-open");
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector("nav").classList.remove("mobile-open")));
renderProducts();renderCart();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".section-heading,.product-card,.feature-copy,.feature-image,.assortment-copy,.assortment>img,.about").forEach(el=>{el.classList.add("reveal");observer.observe(el)});
