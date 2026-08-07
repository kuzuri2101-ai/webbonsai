/* Bonsai Việt — dynamic breadcrumb + SEO helper */
(function(){
 const root=document.querySelector('[data-knowledge-breadcrumb]');
 const title=document.querySelector('[data-knowledge-title]');
 const desc=document.querySelector('[data-knowledge-description]');
 if(!root)return;
 const p=new URLSearchParams(location.search),type=p.get('type')||'plant',slug=p.get('slug')||'';
 const labels={plant:['🌳 Cây','Cây bonsai'],technique:['🔧 Kỹ thuật','Kỹ thuật'],form:['🌿 Dáng','Dáng cây'],style:['🎎 Trường phái','Trường phái'],artist:['👨‍🌾 Nghệ nhân','Nghệ nhân'],work:['🏆 Tác phẩm','Tác phẩm'],article:['📝 Bài viết','Bài viết']};
 const l=labels[type]||['📚 Kiến thức','Kiến thức'];
 root.innerHTML=`<a href="knowledge-index.html">Bách khoa Bonsai Việt</a><span>›</span><span>${l[0]}</span>${slug?`<span>›</span><strong>${slug.replace(/-/g,' ')}</strong>`:''}`;
 const text=(title?.textContent||'Bách khoa Bonsai Việt').trim();
 const d=(desc?.textContent||'Tra cứu kiến thức bonsai Việt Nam.').trim();
 document.title=text+' | Bách khoa Bonsai Việt';
 let m=document.querySelector('meta[name="description"]');if(!m){m=document.createElement('meta');m.name='description';document.head.appendChild(m)}m.content=d.slice(0,160);
 let c=document.querySelector('link[rel="canonical"]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.appendChild(c)}c.href=location.href.split('#')[0];
 const ld={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Bách khoa Bonsai Việt",item:location.origin+'/knowledge-index.html'},{"@type":"ListItem",position:2,name:l[1],item:location.href}]};
 let s=document.getElementById('breadcrumb-jsonld');if(!s){s=document.createElement('script');s.id='breadcrumb-jsonld';s.type='application/ld+json';document.head.appendChild(s)}s.textContent=JSON.stringify(ld);
})();