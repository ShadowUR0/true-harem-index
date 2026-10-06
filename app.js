(() => {
  const works0 = window.TRUE_HAREM_DATA.works;
  const sources = window.TRUE_HAREM_DATA.sources;
  const savedMeta = JSON.parse(localStorage.getItem("trueHaremAniListMeta") || "{}");
  let posters = {};
  let relatedMedia = {};
  let seriesAliases = {};

  const labels = {
    type:{anime:"Anime",manga:"Manga",manhwa:"Manhwa",manhua:"Manhua",novel:"Light Novel",game:"Game"},
    status:{complete:"مكتمل",ongoing:"مستمر",hiatus:"Hiatus",cancelled:"Cancelled",upcoming:"Upcoming",unknown:"غير محسوم"},
    verification:{confirmed:"مؤكد","source-only":"المصدر مؤكد"},
    origin:{JP:"Japan",KR:"Korea",CN:"China",Other:"Other"},
    power:{op:"Overpowered","grows-op":"Becomes OP","latent-op":"Latent OP"}
  };

  const config = {
    status:{el:"statusFilter",placeholder:"Any",options:[["all","Any"],["complete","Completed"],["ongoing","Ongoing"],["hiatus","Hiatus"],["cancelled","Cancelled"],["upcoming","Upcoming"],["unknown","Unknown"]]},
    verification:{el:"verificationFilter",placeholder:"Any",options:[["all","Any"],["confirmed","Confirmed"],["source-only","Source Confirmed"]]},
    content:{el:"contentFilter",placeholder:"Any",options:[["all","Any"],["sfw","SFW"],["ecchi","Ecchi"]]},
    sort:{el:"sortFilter",placeholder:"Featured",options:[["featured","Featured"],["title","Title"],["complete","Completed First"]]},
    origin:{el:"originFilter",placeholder:"Any",options:[["all","Any"],["JP","Japan"],["KR","Korea"],["CN","China"],["Other","Other"]]},
    power:{el:"powerFilter",placeholder:"Any",options:[["all","Any"],["op","Overpowered"],["grows-op","Becomes OP"],["latent-op","Latent OP"]]}
  };

  const state={q:"",type:"all",status:"all",verification:"all",content:"all",sort:"featured",origin:"all",power:"all"};
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  const key=w=>w.type+"::"+w.title;
  const norm=s=>String(s||"").toLowerCase().normalize("NFKC").replace(/[^a-z0-9]+/g," ").trim();
  const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

  function merged(){
    return works0.map(w=>{
      const media=posters[key(w)]||{};
      return {
        ...w,
        ...(savedMeta[key(w)]||{}),
        ...(media.status?{status:media.status}:{}),
        hiddenAdult:Boolean(w.hiddenAdult||media.hiddenAdult),
        media
      };
    }).filter(w=>!w.hiddenAdult);
  }

  function seriesKey(w){
    const n=norm(w.title);
    return seriesAliases[n]||n;
  }

  function groupAll(){
    const map=new Map();
    for(const w of merged()){
      const k=seriesKey(w);
      if(!map.has(k)) map.set(k,{id:k,title:w.title,versions:[]});
      map.get(k).versions.push(w);
    }
    return [...map.values()].map(g=>{
      const relatedRaw=g.versions.flatMap(v=>relatedMedia[v.title]||[]);
      const indexedTypes=new Set(g.versions.map(v=>v.type));
      const seenRelated=new Set();
      const seenRelatedTypes=new Set();
      const related=relatedRaw.filter(r=>{
        if(indexedTypes.has(r.type)) return false;
        if(g.versions.some(v=>v.media?.anilist&&v.media.anilist===r.anilist)) return false;
        const rk=r.anilist||[r.type,r.title].join("|");
        if(seenRelated.has(rk)||seenRelatedTypes.has(r.type)) return false;
        seenRelated.add(rk);
        seenRelatedTypes.add(r.type);
        return true;
      });
      const priority={anime:0,manhwa:1,manga:2,manhua:3,novel:4,game:5};
      const primary=[...g.versions].sort((a,b)=>
        Number(!!b.media?.poster)-Number(!!a.media?.poster) ||
        (priority[a.type]??9)-(priority[b.type]??9) ||
        Number(b.verification==="confirmed")-Number(a.verification==="confirmed")
      )[0];
      const knownVersions=[
        ...g.versions.map(v=>({...v,indexed:true})),
        ...related.map(r=>({...r,indexed:false,verification:"unreviewed",contentClass:null,origin:null,powerClass:null}))
      ];
      return {...g,primary,related,knownVersions};
    });
  }

  function filtered(){
    const q=norm(state.q);
    const rows=groupAll().filter(g=>{
      const indexed=g.versions;
      const known=g.knownVersions;
      const searchable=[
        g.title,
        ...indexed.flatMap(v=>[v.title,v.media?.titleEnglish,v.media?.titleRomaji].filter(Boolean)),
        ...g.related.flatMap(v=>[v.title,v.romaji].filter(Boolean))
      ].map(norm).join(" ");
      return (!q||searchable.includes(q)) &&
        (state.type==="all"||known.some(v=>v.type===state.type)) &&
        (state.status==="all"||known.some(v=>v.status===state.status)) &&
        (state.verification==="all"||indexed.some(v=>v.verification===state.verification)) &&
        (state.content==="all"||indexed.some(v=>v.contentClass===state.content)) &&
        (state.origin==="all"||indexed.some(v=>v.origin===state.origin)) &&
        (state.power==="all"||indexed.some(v=>v.powerClass===state.power));
    });
    if(state.sort==="title") rows.sort((a,b)=>a.title.localeCompare(b.title));
    else if(state.sort==="complete") rows.sort((a,b)=>
      Number(b.knownVersions.some(v=>v.status==="complete"))-Number(a.knownVersions.some(v=>v.status==="complete")) ||
      a.title.localeCompare(b.title)
    );
    else rows.sort((a,b)=>{
      const score=g=>Number(!!g.primary?.media?.poster)*8+Number(g.versions.some(v=>v.verification==="confirmed"))*4+Number(g.knownVersions.some(v=>v.status==="complete"))*2;
      return score(b)-score(a);
    });
    return rows;
  }

  function selectedLabel(k){
    if(k==="type") return state.type==="all" ? "All" : labels.type[state.type];
    return config[k].options.find(([v])=>v===state[k])?.[1] || config[k].placeholder;
  }

  let openKey=null;
  function closeSelect(k,instant=false){
    const root=document.querySelector('.ani-select[data-key="'+k+'"]');
    if(!root) return;
    const menu=root.querySelector(".ani-select-menu");
    if(menu.hidden) return;
    root.classList.remove("open");
    const control=root.querySelector(".ani-select-control");
    if(control) control.setAttribute("aria-expanded","false");
    if(instant){menu.hidden=true;menu.classList.remove("opening","closing");}
    else{
      menu.classList.remove("opening");
      menu.classList.add("closing");
      setTimeout(()=>{menu.hidden=true;menu.classList.remove("closing");},155);
    }
    if(openKey===k) openKey=null;
  }

  function closeAll(except=null){
    Object.keys(config).forEach(k=>{if(k!==except) closeSelect(k);});
  }

  function openSelect(k){
    closeAll(k);
    const root=document.querySelector('.ani-select[data-key="'+k+'"]');
    const menu=root.querySelector(".ani-select-menu");
    menu.hidden=false;
    menu.classList.remove("closing");
    menu.classList.add("opening");
    root.classList.add("open");
    const control=root.querySelector(".ani-select-control");
    if(control) control.setAttribute("aria-expanded","true");
    openKey=k;
    setTimeout(()=>menu.classList.remove("opening"),300);
  }

  function renderSelect(k){
    const c=config[k];
    const host=$("#"+c.el);
    host.innerHTML=`
      <div class="ani-select" data-key="${k}">
        <button class="ani-select-control" type="button" aria-haspopup="listbox" aria-expanded="false">
          <span class="ani-select-value">${esc(selectedLabel(k))}</span>
          <svg class="ani-select-chevron" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M207 381 13 187c-9-9-9-25 0-34l23-23c9-9 24-9 34 0l154 154 155-154c9-9 24-9 34 0l22 23c10 9 10 25 0 34L241 381c-9 9-25 9-34 0z"/></svg>
        </button>
        <div class="ani-select-menu" role="listbox" hidden>
          ${c.options.map(([v,t])=>`
            <button class="ani-option ${state[k]===v?"selected":""}" type="button" role="option" data-value="${v}" aria-selected="${state[k]===v}">
              <span>${esc(t)}</span><span class="ani-option-check">✓</span>
            </button>`).join("")}
        </div>
      </div>`;

    const root=host.querySelector(".ani-select");
    const control=root.querySelector(".ani-select-control");
    const menu=root.querySelector(".ani-select-menu");

    control.addEventListener("click",e=>{
      e.stopPropagation();
      menu.hidden ? openSelect(k) : closeSelect(k);

    });

    root.querySelectorAll(".ani-option").forEach(opt=>{
      opt.addEventListener("click",e=>{
        e.stopPropagation();
        state[k]=opt.dataset.value;
        closeSelect(k,true);
        renderSelect(k);
        renderActiveFilters();
        syncFilterCount();
        renderGrid();
      });
    });

    root.addEventListener("keydown",e=>{
      const opts=[...root.querySelectorAll(".ani-option")];
      if(menu.hidden && ["ArrowDown","ArrowUp"].includes(e.key)){
        e.preventDefault(); openSelect(k); opts[0]?.focus(); return;
      }
      if(menu.hidden) return;
      const i=opts.indexOf(document.activeElement);
      if(e.key==="ArrowDown"){e.preventDefault();opts[(i+1+opts.length)%opts.length]?.focus();}
      if(e.key==="ArrowUp"){e.preventDefault();opts[(i-1+opts.length)%opts.length]?.focus();}
      if(e.key==="Escape"){e.preventDefault();closeSelect(k);control.focus();}
    });
  }

  function renderFilterGroup(k){
    const c=config[k];
    const host=$("#"+c.el);
    host.innerHTML=`<div class="filter-choice-group">${c.options.map(([value,text])=>
      `<button class="filter-choice ${state[k]===value?"active":""}" type="button" data-value="${value}">${esc(text)}</button>`
    ).join("")}</div>`;
    host.querySelectorAll(".filter-choice").forEach(button=>button.addEventListener("click",()=>{
      state[k]=button.dataset.value;
      renderFilterGroup(k);
      renderActiveFilters();
      syncFilterCount();
      renderGrid();
    }));
  }

  function renderAllSelects(){Object.keys(config).forEach(renderFilterGroup);}

  function renderTypeTabs(){
    const options=[["all","All"],["anime","Anime"],["manga","Manga"],["manhwa","Manhwa"],["manhua","Manhua"],["novel","Light Novel"],["game","Game"]];
    const all=groupAll();
    const counts={all:all.length};
    for(const g of all){
      for(const t of new Set(g.knownVersions.map(v=>v.type))) counts[t]=(counts[t]||0)+1;
    }
    $("#typeTabs").innerHTML=options.map(([value,text])=>
      `<button class="media-type-tab ${state.type===value?"active":""}" type="button" data-value="${value}">
        <span>${text}</span><span class="media-type-tab-count">${counts[value]||0}</span>
      </button>`
    ).join("");
    $$("#typeTabs .media-type-tab").forEach(button=>button.addEventListener("click",()=>{
      state.type=button.dataset.value;
      renderTypeTabs();
      renderGrid();
    }));
  }

  function secondaryFilterCount(){
    return ["status","verification","content","origin","power","sort"].filter(k=>state[k]!==((k==="sort")?"featured":"all")).length;
  }

  function syncFilterCount(){
    const count=secondaryFilterCount();
    $("#filterCount").textContent=count;
    $("#filterCount").hidden=count===0;
  }

  function renderActiveFilters(){
    const defs=[
      ["status","Status"],["verification","True Harem"],
      ["content","Content"],["origin","Origin"],["power","Power"],["sort","Sort"]
    ];
    const active=defs.filter(([k])=>state[k]!==((k==="sort")?"featured":"all"));
    $("#activeFilters").innerHTML=active.map(([k,n])=>`
      <button class="ani-filter-chip" data-key="${k}" type="button">
        <span>${n}: ${esc(selectedLabel(k))}</span><span class="x">×</span>
      </button>`).join("");
    $$("#activeFilters .ani-filter-chip").forEach(b=>b.addEventListener("click",()=>{
      const k=b.dataset.key;
      state[k]=k==="sort"?"featured":"all";
      renderFilterGroup(k); renderActiveFilters(); syncFilterCount(); renderGrid();
    }));
    syncFilterCount();
  }

  function cover(w,i){
    if(!w.media.poster) return '<div class="cover-placeholder">TH</div>';
    return `<img class="cover ${w.media.fit==="contain"?"contain":""}" src="${w.media.poster}" alt="${esc(w.title)}" loading="${i<10?"eager":"lazy"}" fetchpriority="${i<5?"high":"auto"}" referrerpolicy="no-referrer" onload="this.classList.add('loaded')" onerror="this.style.display='none';this.nextElementSibling.hidden=false"><div class="cover-placeholder" hidden>TH</div>`;
  }

  function renderGrid(){
    const rows=filtered();
    const indexedCount=rows.reduce((n,g)=>n+g.versions.length,0);
    $("#resultCount").textContent=rows.length+" أعمال · "+indexedCount+" نسخ مفهرسة";
    $("#empty").hidden=rows.length!==0;
    $("#grid").innerHTML=rows.map((g,i)=>{
      const w=g.primary;
      const side=(i%5<3)?"left":"right";
      const types=[...new Set(g.knownVersions.map(v=>v.type))];
      const groupVerification=g.versions.some(v=>v.verification==="confirmed")?"confirmed":"source-only";
      const statusSummary=[...new Set(g.knownVersions.map(v=>labels.status[v.status]||v.status))].join(" · ");
      return `
      <article class="media-card" data-index="${i}" tabindex="0" role="button">
        <div class="cover-wrap">
          ${cover(w,i)}
          <div class="media-type-stack">
            ${types.map(t=>`<span class="media-type type-${t}">${labels.type[t]||t}</span>`).join("")}
          </div>
          <span class="confirm-badge ${groupVerification}" title="${labels.verification[groupVerification]}">${groupVerification==="confirmed"?"✓":"•"}</span>
        </div>
        <h3 class="media-title">${esc(g.title)}</h3>
        <aside class="ani-hover-data ${side}">
          <div class="ani-hover-title">${esc(g.title)}</div>
          <div class="ani-hover-meta">
            <div><strong>Versions:</strong> ${types.map(t=>labels.type[t]||t).join(" · ")}</div>
            <div><strong>Status:</strong> ${esc(statusSummary)}</div>
            <div><strong>Indexed:</strong> ${g.versions.length}</div>
            <div><strong>Known:</strong> ${g.knownVersions.length}</div>
            <div><strong>True Harem:</strong> ${labels.verification[groupVerification]}</div>
            ${w.powerClass?`<div><strong>Power:</strong> ${labels.power[w.powerClass]}</div>`:""}
          </div>
          <div class="ani-hover-tags">
            <span class="ani-hover-tag">${w.haremType}</span>
            ${g.related.length?`<span class="ani-hover-tag related-tag">+${g.related.length} related</span>`:""}
            ${w.powerClass?`<span class="ani-hover-tag power-tag power-${w.powerClass}">${labels.power[w.powerClass]}</span>`:""}
          </div>
        </aside>
      </article>`;
    }).join("");

    $$(".media-card").forEach(card=>{
      const open=()=>openDetails(rows[Number(card.dataset.index)]);
      card.addEventListener("click",open);
      card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});
    });
  }

  function renderSources(){
    const domain=u=>{
      try{return new URL(u).hostname.replace(/^www\./,"");}
      catch{return "";}
    };
    const legend=["حكم True Harem","بيانات","API","قوائم","مجتمع"];
    $("#sourcesList").innerHTML=
      `<div class="sources-legend">${legend.map(x=>`<span class="source-legend-chip">${x}</span>`).join("")}</div>`+
      `<div class="sources-table">`+
      sources.map((s,i)=>`
        <article class="source-row">
          <span class="source-index">${String(i+1).padStart(2,"0")}</span>
          <div class="source-main">
            <h3 class="source-name">${esc(s.name)}</h3>
            <div class="source-domain">${esc(domain(s.url))}</div>
          </div>
          <div class="source-role">${esc(s.role)}</div>
          <span class="source-mode">${esc(s.mode)}</span>
          <a class="source-open" href="${s.url}" target="_blank" rel="noreferrer" aria-label="فتح ${esc(s.name)}">↗</a>
        </article>`).join("")+
      `</div>`;
  }

  function setWorkUrl(group){
    const w=group.primary;
    const url=new URL(location.href);
    url.searchParams.set("work",key(w));
    history.pushState({work:key(w)},"",url);
  }

  function clearWorkUrl(){
    const url=new URL(location.href);
    if(!url.searchParams.has("work")) return;
    url.searchParams.delete("work");
    history.replaceState({},"",url);
  }

  function versionRow(v){
    const status=labels.status[v.status]||v.status||"غير معروف";
    const verify=v.indexed?(labels.verification[v.verification]||v.verification):"Not reviewed";
    const link=v.indexed?(v.media?.anilist||v.media?.mangadex||v.sourceUrl):(v.anilist||v.url);
    return `<div class="version-row ${v.indexed?"indexed":"unreviewed"}">
      <div class="version-main">
        <span class="version-type type-${v.type}">${labels.type[v.type]||v.type}</span>
        <div><strong>${esc(v.title)}</strong><small>${v.indexed?"مفهرسة في True Harem Index":"نسخة معروفة — لم تراجع بعد"}</small></div>
      </div>
      <span class="version-status status-${v.status}">${esc(status)}</span>
      <span class="version-verification">${esc(verify)}</span>
      ${link?`<a class="version-link" href="${link}" target="_blank" rel="noreferrer">↗</a>`:"<span></span>"}
    </div>`;
  }

  function openDetails(group,syncUrl=true){
    const w=group.primary;
    if(syncUrl) setWorkUrl(group);
    const links=[
      `<a class="detail-link" href="${w.sourceUrl}" target="_blank" rel="noreferrer">True Harem ↗</a>`
    ].join("");
    $("#dialogContent").innerHTML=`
      <div class="detail-top">
        <div>${w.media.poster?`<img class="detail-cover" src="${w.media.poster}" alt="${esc(group.title)}" referrerpolicy="no-referrer">`:'<div class="detail-cover cover-placeholder">TH</div>'}</div>
        <div class="detail-info">
          <h2 id="detailTitle">${esc(group.title)}</h2>
          <div class="detail-tags">
            ${[...new Set(group.knownVersions.map(v=>v.type))].map(t=>`<span class="detail-tag">${labels.type[t]||t}</span>`).join("")}
            ${w.powerClass?`<span class="detail-tag power-tag power-${w.powerClass}">${labels.power[w.powerClass]}</span>`:""}
          </div>
          <div class="detail-verification">Indexed versions: <strong>${group.versions.length}</strong> · Known versions: <strong>${group.knownVersions.length}</strong></div>
        </div>
      </div>
      <div class="detail-body">
        <div class="versions-heading">النسخ والحالة</div>
        <div class="versions-list">${group.knownVersions.map(versionRow).join("")}</div>
        <div class="detail-note">الحالة تخص كل نسخة بشكل مستقل. النسخ الموسومة Not reviewed معروفة من AniList لكنها لم تعتمد بعد كـ True Harem في هذا الدليل.</div>
        <div class="detail-links">${links}<button id="copyWorkLink" class="detail-link copy-link" type="button">نسخ الرابط</button></div>
      </div>`;
    $("#detailDialog").showModal();
    $("#copyWorkLink")?.addEventListener("click",async()=>{
      try{await navigator.clipboard.writeText(location.href);toast("تم نسخ رابط العمل.");}
      catch{toast("انسخ الرابط من شريط العنوان.");}
    });
  }

  function closeExtra(instant=false){
    const p=$("#extraFilters");
    if(p.hidden) return;
    $("#filtersToggle").classList.remove("active");
    $("#filtersToggle").setAttribute("aria-expanded","false");
    if(instant){p.hidden=true;p.classList.remove("opening","closing");return;}
    p.classList.remove("opening");p.classList.add("closing");
    setTimeout(()=>{p.hidden=true;p.classList.remove("closing");},155);
  }
  function openExtra(){
    closeAll();
    const p=$("#extraFilters");
    p.hidden=false;p.classList.remove("closing");p.classList.add("opening");
    $("#filtersToggle").classList.add("active");
    $("#filtersToggle").setAttribute("aria-expanded","true");
    setTimeout(()=>p.classList.remove("opening"),300);
  }

  $("#filtersToggle").addEventListener("click",e=>{
    e.stopPropagation();
    $("#extraFilters").hidden?openExtra():closeExtra();
  });
  $("#extraFilters").addEventListener("click",e=>e.stopPropagation());
  $("#resetFilters").addEventListener("click",()=>{
    Object.assign(state,{status:"all",verification:"all",content:"all",sort:"featured",origin:"all",power:"all"});
    renderAllSelects();renderActiveFilters();syncFilterCount();renderGrid();closeExtra();
  });

  $("#searchInput").addEventListener("input",e=>{
    state.q=e.target.value;$("#clearSearch").hidden=!state.q;renderGrid();
  });
  $("#clearSearch").addEventListener("click",()=>{
    state.q="";$("#searchInput").value="";$("#clearSearch").hidden=true;renderGrid();$("#searchInput").focus();
  });

  const openCatalogAndFocusSearch=()=>{
    $("#catalogView").hidden=false;
    $("#sourcesView").hidden=true;
    $$(".nav-link").forEach(x=>x.classList.toggle("active",x.dataset.tab==="catalog"));
    $("#searchInput").scrollIntoView({behavior:"smooth",block:"center"});
    setTimeout(()=>$("#searchInput").focus(),220);
  };
  $("#headerSearch").addEventListener("click",openCatalogAndFocusSearch);
  $(".brand").addEventListener("click",e=>{e.preventDefault();openCatalogAndFocusSearch();});

  document.addEventListener("click",()=>{closeAll();closeExtra();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAll();closeExtra();}});

  $("#dialogClose").addEventListener("click",()=>$("#detailDialog").close());
  $("#detailDialog").addEventListener("click",e=>{if(e.target===$("#detailDialog"))$("#detailDialog").close();});
  $("#detailDialog").addEventListener("close",clearWorkUrl);
  $$(".nav-link").forEach(b=>b.addEventListener("click",()=>{
    $("#catalogView").hidden=b.dataset.tab!=="catalog";
    $("#sourcesView").hidden=b.dataset.tab!=="sources";
    $$(".nav-link").forEach(x=>x.classList.toggle("active",x===b));
  }));

  function toast(msg){const e=$("#toast");e.textContent=msg;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2200);}

  async function init(){
    try{const r=await fetch("./posters.json",{cache:"no-store"});if(r.ok)posters=await r.json();}catch{}
    try{const r=await fetch("./related-media.json",{cache:"no-store"});if(r.ok)relatedMedia=await r.json();}catch{}
    try{const r=await fetch("./series-aliases.json",{cache:"no-store"});if(r.ok)seriesAliases=await r.json();}catch{}
    renderAllSelects();renderTypeTabs();renderActiveFilters();syncFilterCount();renderGrid();renderSources();
    const requested=new URL(location.href).searchParams.get("work");
    if(requested){
      const groups=groupAll();
      const match=groups.find(g=>g.versions.some(w=>key(w)===requested));
      if(match) openDetails(match,false);
    }
  }
  init();
})();