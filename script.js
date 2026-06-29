function app() {
    return {
        heroes: [],
        filtered: [],
        loading: true,
        q: '',
        sort: 'name',
        region: '',
        modal: false,
        sel: null,
        showTop: false,
        scrolled: false,
        rk: {
            aceh: ['aceh','banda aceh','teuku','cut nyak','sisingamangaraja','perang aceh'],
            sumatera: ['sumatera','sumatra','padang','palembang','jambi','lampung','riau','bengkulu','medan','minang','batak','melayu'],
            jawa: ['jawa','jakarta','surabaya','bandung','yogyakarta','jogja','semarang','solo','surakarta','banten','cirebon','malang','bogor','majalengka','blitar'],
            bali: ['bali','denpasar','badung','singaraja'],
            kalimantan: ['kalimantan','borneo','banjarmasin','pontianak','balikpapan','samarinda','palangkaraya','banjar','melawi'],
            sulawesi: ['sulawesi','makassar','manado','toraja','bugis','minahasa','gorontalo','palu','kendari'],
            maluku: ['maluku','ambon','ternate','tidore','pattimura','maluku utara'],
            papua: ['papua','jayapura','irian']
        },
        async init() {
            try {
                const r = await fetch('https://indonesia-public-static-api.vercel.app/api/heroes');
                this.heroes = await r.json();
            } catch (e) { console.error(e); }
            this.loading = false;
            this.sortBy('name');
            window.addEventListener('scroll', () => {
                this.scrolled = window.scrollY > 50;
                this.showTop = window.scrollY > 400;
            });
        },
        reg(h) {
            const t = (h.name + ' ' + (h.description || '')).toLowerCase();
            const lbl = { aceh:'Aceh', sumatera:'Sumatera', jawa:'Jawa', bali:'Bali', kalimantan:'Kalimantan', sulawesi:'Sulawesi', maluku:'Maluku', papua:'Papua' };
            for (const [k, v] of Object.entries(this.rk)) {
                if (v.some(w => t.includes(w))) return lbl[k];
            }
            return '';
        },
        cat(h) {
            const t = (h.name + ' ' + (h.description || '')).toLowerCase();
            const y = h.ascension_year;
            const rn = ['ahmad yani','suprapto','siswondo parman','mas tirtodarmo haryono','sutoyo','donald izacus panjaitan','pierre tendean','katamso darmokusumo','sugiyono mangunwiyoto','karel satsuit tubun'];
            if (rn.some(n => t.includes(n)) || t.includes('gerakan 30 september') || t.includes('g30s'))
                return { name:'Pahlawan Revolusi', cls:'cat-revolusi', icon:'fas fa-fire' };
            if (t.includes('revolusi nasional') || t.includes('kemerdekaan') || t.includes('proklamasi') || t.includes('aktivis kemerdekaan') || t.includes('nasionalis'))
                return { name:'Pahlawan Kemerdekaan', cls:'cat-kemerdekaan', icon:'fas fa-flag' };
            if ((t.includes('kolonial') || t.includes('voc') || t.includes('perang padri') || t.includes('perang banjar') || t.includes('gerilyawan') || t.includes('perlawanan')) && y < 1945)
                return { name:'Pahlawan Perintis', cls:'cat-perintis', icon:'fas fa-chess-rook' };
            if (t.includes('pengajar') || t.includes('pendidikan') || t.includes('sekolah') || t.includes('universitas') || t.includes('taman siswa') || t.includes('budi utomo'))
                return { name:'Pahlawan Pendidikan', cls:'cat-pendidikan', icon:'fas fa-graduation-cap' };
            if (t.includes('ulama') || t.includes('islam') || t.includes('muhammadiyah') || t.includes('nahdlatul ulama') || t.includes('katolik') || t.includes('uskup'))
                return { name:'Tokoh Agama', cls:'cat-ulama', icon:'fas fa-mosque' };
            if (t.includes('menteri') || t.includes('gubernur') || t.includes('presiden') || t.includes('perdana menteri') || t.includes('bank indonesia') || t.includes('insinyur'))
                return { name:'Pahlawan Pembangunan', cls:'cat-pembangunan', icon:'fas fa-building' };
            return { name:'', cls:'', icon:'' };
        },
        filter() {
            const q = this.q.toLowerCase();
            const rg = this.region;
            this.filtered = this.heroes.filter(h => {
                const ms = !q || h.name.toLowerCase().includes(q) || (h.description && h.description.toLowerCase().includes(q));
                const mr = !rg || this.reg(h).toLowerCase() === rg;
                return ms && mr;
            });
        },
        sortBy(by) {
            this.sort = by;
            if (by === 'name') this.heroes.sort((a, b) => a.name.localeCompare(b.name));
            else if (by === 'year') this.heroes.sort((a, b) => (b.ascension_year || 0) - (a.ascension_year || 0));
            this.filter();
        },
        open(h) { this.sel = h; this.modal = true; document.body.style.overflow = 'hidden'; },
        close() { this.modal = false; this.sel = null; document.body.style.overflow = ''; },
        age(h) {
            if (!h) return '-';
            const b = parseInt(h.birth_year), d = parseInt(h.death_year);
            if (isNaN(b) || isNaN(d)) return '-';
            return (d - b) + ' tahun';
        }
    };
}

function closeMenu() {
    document.querySelector('.hamburger')?.classList.remove('active');
    document.querySelector('.nav-menu')?.classList.remove('show');
}
