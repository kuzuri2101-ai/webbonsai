const db = window.getSupabase ? window.getSupabase() : null;
const $ = id => document.getElementById(id);
let editingId = null;
const cache = { plants: [], techniques: [], forms: [], styles: [], works: [] };

function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function slugify(v=''){return v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}

async function auth(){
  if(!db){$('accountInfo').textContent='Chưa cấu hình Supabase';return false;}
  const {data:{session}}=await db.auth.getSession();
  if(!session){location.href='login.html?next=articles-admin.html';return false;}
  const {data:p,error}=await db.from('bv_profiles').select('display_name,role').eq('id',session.user.id).maybeSingle();
  if(error||!p||!['ADMIN','EDITOR'].includes(p.role)){$('accountInfo').textContent='Không có quyền quản trị';return false;}
  $('accountInfo').textContent=`${p.display_name} · ${p.role}`;return true;
}

async function loadRelations(){
  const specs=[['plants','bv_plants','name','status'],['techniques','bv_techniques','name','status'],['forms','bv_forms','name','status'],['styles','bv_styles','name','status'],['works','bv_works','name','status']];
  await Promise.all(specs.map(async ([key,table,label,status])=>{
    const {data,error}=await db.from(table).select(`id,${label},${status}`).order(label);
    if(!error) cache[key]=data||[];
    renderChecks(key, label);
  }));
}
function renderChecks(key,label){
  $(key).innerHTML=cache[key].filter(x=>x.status==='PUBLISHED').map(x=>`<label class="check"><input type="checkbox" value="${x.id}"> ${esc(x[label])}</label>`).join('')||'<span class="muted">Chưa có dữ liệu xuất bản.</span>';
}
function selected(key){return [...$(key).querySelectorAll('input:checked')].map(x=>Number(x.value));}
function setSelected(key,ids){const set=new Set(ids||[]);$(key).querySelectorAll('input').forEach(x=>x.checked=set.has(Number(x.value)));}

async function loadArticles(){
  let q=db.from('bv_articles').select('*').order('created_at',{ascending:false});
  const s=$('search').value.trim(), st=$('status').value;
  if(st)q=q.eq('status',st);
  if(s)q=q.or(`title.ilike.%${s}%,slug.ilike.%${s}%`);
  const {data,error}=await q;
  if(error){$('list').innerHTML=`<div class="error">${esc(error.message)}</div>`;return;}
  $('list').innerHTML=(data||[]).map(a=>`<div class="article-item"><div><strong>${esc(a.title)}</strong><br><small>${esc(a.slug)} · ${esc(a.article_type)} · <span class="status">${esc(a.status)}</span></small></div><div class="row"><button data-edit="${a.id}">Sửa</button><button class="danger" data-delete="${a.id}">Xóa</button></div></div>`).join('')||'<p class="muted">Chưa có bài viết.</p>';
  document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openArticle(Number(b.dataset.edit)));
  document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteArticle(Number(b.dataset.delete)));
}

function reset(){editingId=null;$('form').reset();$('title').textContent='Bài viết mới';$('error').textContent='';setSelected('plants',[]);setSelected('techniques',[]);setSelected('forms',[]);setSelected('styles',[]);setSelected('works',[]);}
async function relationIds(table, column, articleId){const {data,error}=await db.from(table).select(column).eq('article_id',articleId);if(error)throw error;return (data||[]).map(x=>x[column]);}
async function openArticle(id=null){reset();if(id){const {data,error}=await db.from('bv_articles').select('*').eq('id',id).single();if(error){$('error').textContent=error.message;return;}editingId=id;$('title').textContent='Sửa bài viết';$('articleTitle').value=data.title||'';$('slug').value=data.slug||'';$('excerpt').value=data.excerpt||'';$('content').value=data.content||'';$('articleType').value=data.article_type||'TECHNIQUE';$('articleStatus').value=data.status||'DRAFT';$('image').value=data.featured_image||'';$('metaTitle').value=data.meta_title||'';$('metaDescription').value=data.meta_description||'';try{setSelected('plants',await relationIds('bv_article_plants','plant_id',id));setSelected('techniques',await relationIds('bv_article_techniques','technique_id',id));setSelected('forms',await relationIds('bv_article_forms','form_id',id));setSelected('styles',await relationIds('bv_article_styles','style_id',id));setSelected('works',await relationIds('bv_article_works','work_id',id));}catch(e){$('error').textContent=e.message;}}
$('dialog').showModal();}

async function save(e){e.preventDefault();$('error').textContent='';const payload={title:$('articleTitle').value.trim(),slug:slugify($('slug').value.trim()),excerpt:$('excerpt').value.trim()||null,content:$('content').value.trim(),article_type:$('articleType').value,status:$('articleStatus').value,featured_image:$('image').value.trim()||null,meta_title:$('metaTitle').value.trim()||$('articleTitle').value.trim(),meta_description:$('metaDescription').value.trim()||$('excerpt').value.trim()||null,updated_at:new Date().toISOString(),published_at:$('articleStatus').value==='PUBLISHED'?new Date().toISOString():null};
  const result=editingId?await db.from('bv_articles').update(payload).eq('id',editingId).select().single():await db.from('bv_articles').insert(payload).select().single();
  if(result.error){$('error').textContent=result.error.message;return;}const id=result.data.id;
  const rels=[['bv_article_plants','plant_id',selected('plants')],['bv_article_techniques','technique_id',selected('techniques')],['bv_article_forms','form_id',selected('forms')],['bv_article_styles','style_id',selected('styles')],['bv_article_works','work_id',selected('works')]];
  for(const [table,col,ids] of rels){const {error}=await db.from(table).delete().eq('article_id',id);if(error){$('error').textContent=error.message;return;}if(ids.length){const rows=ids.map(x=>({article_id:id,[col]:x}));const r=await db.from(table).insert(rows);if(r.error){$('error').textContent=r.error.message;return;}}}
  $('dialog').close();await loadArticles();}
async function deleteArticle(id){if(!confirm('Xóa bài viết này và các liên kết?'))return;const {error}=await db.from('bv_articles').delete().eq('id',id);if(error){alert(error.message);return;}await loadArticles();}

$('newArticle').onclick=()=>openArticle();$('form').onsubmit=save;$('close').onclick=()=>$('dialog').close();$('cancel').onclick=()=>$('dialog').close();$('search').oninput=loadArticles;$('status').onchange=loadArticles;
(async()=>{if(await auth()){await loadRelations();await loadArticles();}})();
