/* Bonsai Việt — SEO metadata / JSON-LD helper */
(function(){
 const type=new URLSearchParams(location.search).get('type')||'plant';
 const slug=new URLSearchParams(location.search).get('slug')||'';
 const root=document.querySelector('[data-seo-knowledge]'); if(!root)return;
 const title=root.dataset.title||document.title;
 const description=root.dataset.description||'';
 const canonical=`${location.origin}${location.pathname}?type=${encodeURIComponent(type)}&slug=${encodeURIComponent(slug)}`;
 function meta(name,content){let e=document.head.querySelector(`meta[name="${name}"]`);if(!e){e=document.createElement('meta');e.name=name;document.head.appendChild(e)}e.content=content||''}
 document.title=title;
 meta('description',description);
 let c=document.head.querySelector('link[rel="canonical"]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.appendChild(c)}c.href=canonical;
 const ld={"@context":"https://schema.org","@type":type==='article'?'Article':'Article',headline:title,description,mainEntityOfPage:{"@type":"WebPage","@id":canonical},inLanguage:'vi-VN'};
 let s=document.getElementById('knowledge-jsonld');if(!s){s=document.createElement('script');s.id='knowledge-jsonld';s.type='application/ld+json';document.head.appendChild(s)}s.textContent=JSON.stringify(ld);
})();
