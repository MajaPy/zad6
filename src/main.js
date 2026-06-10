
const SUPABASE_URL = 'https://rtlzdtfocusiuiatrgwz.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_Cn_VtfKpjI4feu8dRldlHg_y7WhqzyP';


async function pobierzArtykuly() {
    const kontener = document.getElementById('articlesList');
    if (!kontener) return;

    try {
        const url = `${SUPABASE_URL}/rest/v1/article?select=*&order=created_at.desc`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Błąd serwera: ${response.status}`);
        }

        const articles = await response.json();

        if (!articles || articles.length === 0) {
            kontener.innerHTML = '<p class="text-center text-gray-500">Brak artykułów w bazie.</p>';
            return;
        }

        kontener.innerHTML = articles.map(art => `
            <div class="border-b pb-4 last:border-0">
                <h2 class="text-xl font-bold text-gray-900">${art.title}</h2>
                <h3 class="text-gray-500 text-sm italic">${art.subtitle || ''}</h3>
                <p class="text-xs text-gray-400 mt-1">Autor: <span class="font-semibold text-gray-600">${art.author}</span></p>
                <p class="mt-2 text-gray-700 whitespace-pre-line">${art.content}</p>
            </div>
        `).join('');

    } catch (error) {
        kontener.innerHTML = `<p class="text-red-500 text-center">Błąd bazy: ${error.message}</p>`;
    }
}


window.addEventListener('DOMContentLoaded', () => {
    pobierzArtykuly();

    const form = document.getElementById('articleForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                const url = `${SUPABASE_URL}/rest/v1/article`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        title: document.getElementById('title').value,
                        subtitle: document.getElementById('subtitle').value,
                        author: document.getElementById('author').value,
                        content: document.getElementById('content').value
                    })
                });

                if (!response.ok) {
                    throw new Error(`Błąd serwera: ${response.status}`);
                }

                form.reset();
                pobierzArtykuly();

            } catch (error) {
                alert("Błąd zapisu: " + error.message);
            }
        });
    }
});