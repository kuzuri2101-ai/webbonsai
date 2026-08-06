/* Bonsai Việt — public knowledge search */
(function () {
  const SUPABASE_URL = window.SUPABASE_URL || '';
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';
  const box = document.querySelector('[data-bonsai-search]');
  if (!box || !SUPABASE_URL || !SUPABASE_ANON_KEY) return;

  const input = box.querySelector('input');
  const results = box.querySelector('[data-search-results]');
  let timer;

  function esc(value) {
    return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  async function search(q) {
    if (!q || q.length < 2) {
      results.innerHTML = '';
      return;
    }
    results.innerHTML = '<div class="search-loading">Đang tìm kiếm…</div>';
    const headers = { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY };
    const encoded = encodeURIComponent(`%${q}%`);
    const requests = [
      ['Cây', 'bv_plants', `name.ilike.${encoded},scientific_name.ilike.${encoded}`],
      ['Kỹ thuật', 'bv_techniques', `name.ilike.${encoded}`],
      ['Dáng', 'bv_forms', `name.ilike.${encoded}`],
      ['Trường phái', 'bv_styles', `name.ilike.${encoded}`],
      ['Nghệ nhân', 'bv_artists', `name.ilike.${encoded}`],
      ['Tác phẩm', 'bv_works', `name.ilike.${encoded}`],
      ['Bài viết', 'bv_articles', `title.ilike.${encoded}`]
    ];
    const data = await Promise.all(requests.map(async ([type, table, filter]) => {
      const url = `${SUPABASE_URL}/rest/v1/${table}?select=id,name,title,slug&or=(${filter})&status=eq.PUBLISHED&limit=6`;
      const r = await fetch(url, { headers });
      if (!r.ok) return [];
      return (await r.json()).map(x => ({ ...x, type }));
    }));
    const items = data.flat();
    results.innerHTML = items.length ? items.map(x => `<a class="search-result" href="${esc(x.slug || '#')}"><span>${esc(x.type)}</span><strong>${esc(x.name || x.title)}</strong></a>`).join('') : '<div class="search-empty">Không tìm thấy nội dung phù hợp.</div>';
  }

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => search(input.value.trim()), 280);
  });
})();
