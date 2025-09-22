
// frontend-only PETMATCH mock - simulated data stored in localStorage
(function(){
  const STORAGE_KEY = 'petmatch_products_v1';
  function uid(){ return Date.now() + Math.floor(Math.random()*1000); }

  // initial seed if not present
  if(!localStorage.getItem(STORAGE_KEY)){
    const seed = [
      {id:15, code:'15', name:'Coleira - Petcool Pupi', qty:20, price:69.9, status:'Ativo', rating:4.5, description:'Coleira confortável para cães.', images:[]},
      {id:14, code:'14', name:'Bola', qty:90, price:24.5, status:'Ativo', rating:4.0, description:'Bola de borracha resistente.', images:[]},
      {id:12, code:'12', name:'Osso Não Raspa Flex', qty:15, price:17.0, status:'Ativo', rating:3.5, description:'Osso flexível para roer.', images:[]},
      {id:11, code:'11', name:'Coleira Pettool Mesh', qty:200, price:59.99, status:'Ativo', rating:4.2, description:'Coleira respirável.', images:[]},
      {id:10, code:'10', name:'PEDIGREE Biscoito Adulto', qty:1, price:30.99, status:'Ativo', rating:4.7, description:'Biscoito sabor carne.', images:[]}
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  }
  function read(){ return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'); }
  function write(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

  // Utility to navigate
  function go(p){ location.href = p; }

  // Format money
  function money(v){ return 'R$ ' + Number(v).toFixed(2); }

  // Page: products.html
  if(location.pathname.endsWith('products.html')){
    const list = document.getElementById('list');
    const search = document.getElementById('search');
    const pagination = document.getElementById('pagination');
    const addBtn = document.getElementById('addBtn');
    let page = 1, size = 10;

    function render(){
      const all = read().slice().sort((a,b)=>b.id - a.id);
      const q = (search.value||'').toLowerCase().trim();
      const filtered = q ? all.filter(p=> p.name.toLowerCase().includes(q) || (p.code||'').toLowerCase().includes(q)) : all;
      const total = filtered.length;
      const start = (page-1)*size;
      const items = filtered.slice(start, start+size);
      if(items.length===0) list.innerHTML = '<div class="card">Nenhum produto encontrado</div>';
      else{
        list.innerHTML = items.map(p=>`
          <div class="card product-row">
            <div style="display:flex;gap:12px;align-items:center">
              <img class="thumb" src="${p.images[0]?.dataUrl || 'assets/placeholder.png'}" alt="thumb">
              <div>
                <div style="font-weight:900">${p.name}</div>
                <div class="small" style="margin-top:6px">${p.code || p.id} · Qtd: ${p.qty} · ${money(p.price)}</div>
              </div>
            </div>
            <div style="text-align:right">
              <div class="pill">${p.status}</div>
              <div style="margin-top:8px" class="row-actions">
                <a class="a-view" href="productView.html?id=${p.id}">Visualizar</a>
                <a class="a-edit" href="productForm.html?id=${p.id}">Alterar</a>
                <a class="a-toggle" href="#" data-id="${p.id}">${p.status==='Ativo'?'Inativar':'Reativar'}</a>
              </div>
            </div>
          </div>
        `).join('');
      }
      // pagination
      const totalPages = Math.max(1, Math.ceil(filtered.length/size));
      pagination.innerHTML = '';
      for(let i=1;i<=totalPages;i++){
        const btn = document.createElement('button');
        btn.className = 'page';
        btn.textContent = i;
        if(i===page) btn.style.boxShadow = 'inset 0 -3px 0 rgba(0,0,0,0.08)';
        btn.addEventListener('click', ()=>{ page=i; render(); });
        pagination.appendChild(btn);
      }
      // bind toggles
      document.querySelectorAll('.a-toggle').forEach(a=> a.addEventListener('click', (ev)=>{
        ev.preventDefault();
        const id = Number(a.dataset.id);
        const data = read();
        const prod = data.find(p=>p.id===id);
        if(!prod) return alert('Produto não encontrado');
        const action = prod.status==='Ativo'?'inativar':'reativar';
        showConfirm(`Confirma ${action} o produto "${prod.name}"?`, ()=>{
          prod.status = prod.status==='Ativo'?'Desativado':'Ativo';
          write(data);
          render();
        });
      }));
    }

    document.getElementById('searchBtn').addEventListener('click', ()=>{ page=1; render(); });
    search.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ page=1; render(); } });
    document.getElementById('addBtn').addEventListener('click', ()=> go('productForm.html'));
    render();
  }

  // Page: productForm.html (create/edit)
  if(location.pathname.endsWith('productForm.html')){
    const params = new URLSearchParams(location.search);
    const id = params.get('id') ? Number(params.get('id')) : null;
    const nameIn = document.getElementById('name');
    const priceIn = document.getElementById('price');
    const qtyIn = document.getElementById('qty');
    const ratingIn = document.getElementById('rating');
    const descIn = document.getElementById('description');
    const imagesIn = document.getElementById('images');
    const imagesContainer = document.getElementById('imagesContainer');
    const bigPreview = document.getElementById('bigPreview');
    let imagesList = [];

    function renderImages(){
      imagesContainer.innerHTML = imagesList.map((img,idx)=>`
        <div class="image-item" data-idx="${idx}">
          <img src="${img.dataUrl}" alt="img">
          <div class="star" title="Definir como principal">${img.isMain? '★':'☆'}</div>
          <div class="del" title="Remover">✕</div>
        </div>
      `).join('');
      // bind star and del
      imagesContainer.querySelectorAll('.image-item').forEach(el=>{
        const idx = Number(el.dataset.idx);
        el.querySelector('.star').addEventListener('click', ()=>{
          imagesList = imagesList.map((im,i)=> ({...im, isMain: i===idx}));
          renderImages();
        });
        el.querySelector('.del').addEventListener('click', ()=>{
          imagesList.splice(idx,1); renderImages();
        });
        el.querySelector('img').addEventListener('click', (ev)=> bigPreview.src = ev.target.src);
      });
      bigPreview.src = imagesList.find(i=>i.isMain)?.dataUrl || (imagesList[0]?.dataUrl || '');
    }

    imagesIn.addEventListener('change', (ev)=>{
      const files = Array.from(ev.target.files);
      files.forEach(f=>{
        const reader = new FileReader();
        reader.onload = (e)=>{
          imagesList.push({id: uid(), filename: 'img_'+uid()+'.png', dataUrl: e.target.result, isMain: imagesList.length===0});
          renderImages();
        };
        reader.readAsDataURL(f);
      });
      ev.target.value='';
    });

    // load if edit
    if(id){
      const p = read().find(x=>x.id===id);
      if(p){
        nameIn.value = p.name; priceIn.value = p.price; qtyIn.value = p.qty; ratingIn.value = p.rating || 0; descIn.value = p.description || '';
        imagesList = (p.images||[]).map(im=> ({...im, dataUrl: im.dataUrl || im.url || 'assets/placeholder.png'}));
        renderImages();
      }
    }

    document.getElementById('saveBtn').addEventListener('click', (ev)=>{
      ev.preventDefault();
      const name = nameIn.value.trim();
      if(!name) return alert('Nome é obrigatório');
      if(name.length>200) return alert('Nome excede 200 caracteres');
      const price = Number(priceIn.value || 0).toFixed(2);
      const qty = parseInt(qtyIn.value||0);
      const rating = Number(ratingIn.value||0);
      if(rating<0 || rating>5) return alert('Avaliação inválida');
      // simulate renaming files (we already created filename)
      const data = read();
      if(id){
        const prod = data.find(p=>p.id===id);
        prod.name = name; prod.price = Number(price); prod.qty = qty; prod.rating = rating; prod.description = descIn.value;
        prod.images = imagesList.map((im,i)=> ({filename:im.filename, dataUrl:im.dataUrl, isMain: im.isMain}));
      } else {
        const newId = Math.max(0, ...data.map(d=>d.id))+1;
        const code = String(newId);
        data.push({id:newId, code, name, price: Number(price), qty, status:'Ativo', rating, description: descIn.value, images: imagesList.map(im=> ({filename:im.filename, dataUrl:im.dataUrl, isMain: im.isMain}))});
      }
      write(data);
      alert('Produto salvo (simulado). Voltando à lista.');
      go('products.html');
    });

    document.getElementById('cancelBtn').addEventListener('click', ()=> go('products.html'));
  }

  // estoquistaForm.html - only qty editable
  if(location.pathname.endsWith('estoquistaForm.html')){
    const params = new URLSearchParams(location.search);
    const id = params.get('id') ? Number(params.get('id')) : null;
    const nameIn = document.getElementById('ename');
    const qtyIn = document.getElementById('eqty');
    const priceIn = document.getElementById('eprice');
    const others = document.querySelectorAll('.estoq-disabled');
    if(!id) return alert('ID ausente');
    const p = read().find(x=>x.id===id);
    if(!p) return alert('Produto não encontrado');
    nameIn.value = p.name; qtyIn.value = p.qty; priceIn.value = p.price;
    others.forEach(i=> i.disabled=true);
    document.getElementById('esave').addEventListener('click', ()=>{
      const data = read(); const prod = data.find(x=>x.id===id);
      prod.qty = Number(qtyIn.value||0); write(data); alert('Quantidade atualizada (simulado)'); location.href='products.html';
    });
    document.getElementById('ecancel').addEventListener('click', ()=> location.href='products.html');
  }

  // productView.html - carousel and disabled buy button
  if(location.pathname.endsWith('productView.html')){
    const params = new URLSearchParams(location.search);
    const id = params.get('id') ? Number(params.get('id')) : null;
    const mainImg = document.getElementById('mainImg');
    const thumbs = document.getElementById('thumbs');
    const pname = document.getElementById('pname');
    const pprice = document.getElementById('pprice');
    const pdesc = document.getElementById('pdesc');
    const prating = document.getElementById('prating');
    if(!id) return alert('ID ausente');
    const p = read().find(x=>x.id===id);
    if(!p) return alert('Produto não encontrado');
    pname.textContent = p.name; pprice.textContent = money(p.price); pdesc.textContent = p.description || '';
    prating.textContent = 'Avaliação: ' + (p.rating ? p.rating.toFixed(1) : '0');
    const imgs = p.images || [];
    if(imgs.length){
      mainImg.src = imgs.find(i=>i.isMain)?.dataUrl || imgs[0].dataUrl;
      thumbs.innerHTML = imgs.map(i=>`<img src="${i.dataUrl}" onclick="document.getElementById('mainImg').src='${i.dataUrl}'">`).join('');
    } else {
      mainImg.src = 'assets/placeholder.png';
      thumbs.innerHTML = '';
    }
    // buy button disabled by design
  }

  // helper: modal confirm
  window.showConfirm = function(msg, onOk){
    const bd = document.createElement('div'); bd.className='modal-backdrop';
    const md = document.createElement('div'); md.className='modal';
    md.innerHTML = `<h3>Confirmação</h3><p class="small">${msg}</p><div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px"><button class="btn" id="no">Cancelar</button><button class="btn btn-accent" id="yes">Confirmar</button></div>`;
    bd.appendChild(md); document.body.appendChild(bd);
    md.querySelector('#no').addEventListener('click', ()=> bd.remove());
    md.querySelector('#yes').addEventListener('click', ()=>{ bd.remove(); onOk && onOk(); });
  };

  //Page: login.html
  if (location.pathname.endsWith("login.html")) {
    const emailIn = document.getElementById("email");
    const passIn = document.getElementById("password");
    const btn = document.getElementById("loginBtn");

    btn.addEventListener("click", (ev) => {
      ev.preventDefault();

      const payload = {
        email: emailIn.value,
        senha: passIn.value,
      };

      fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.text()) // aqui porque o back retorna String
        .then((data) => {
          if (data === "login") {
            alert("Login bem sucedido!");
            location.href = "products.html"; // vai para a lista de produtos
          } else {
            alert("Falha no login");
          }
        })
        .catch((err) => {
          alert("Erro na chamada: " + err.message);
        });
    });
  }

})();
