import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rtlzdtfocusiuiatrgwz.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_Cn_VtfKpjI4feu8dRldlHg_y7WhqzyP';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function pobierzArtykuly() {
    const kontener = document.getElementById('articlesList');
    if (!kontener) return;

    const { data: articles, error } = await supabase
        .from('article')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        kontener.innerHTML = `<p class="text-red-500 text-center">Błąd bazy: ${error.message}</p>`;
        return;
    }

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
}

window.addEventListener('DOMContentLoaded', () => {
    pobierzArtykuly();

    const form = document.getElementById('articleForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const { error } = await supabase.from('article').insert([
                {
                    title: document.getElementById('title').value,
                    subtitle: document.getElementById('subtitle').value,
                    author: document.getElementById('author').value,
                    content: document.getElementById('content').value
                }
            ]);

            if (error) {
                alert("Błąd zapisu: " + error.message);
            } else {
                form.reset();
                pobierzArtykuly();
            }
        });
    }
});