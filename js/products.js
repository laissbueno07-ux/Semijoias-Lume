// ---------------------------------------------------------------
// LUME — catálogo de produtos (compartilhado entre páginas)
// ---------------------------------------------------------------

const ICONS = {
  anel: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="none" stroke="var(--gold)" stroke-width="6"/></svg>`,
  brinco: `<svg viewBox="0 0 100 100"><circle cx="50" cy="30" r="8" fill="var(--gold)"/><path d="M50 38 L50 60" stroke="var(--gold)" stroke-width="3"/><circle cx="50" cy="70" r="12" fill="none" stroke="var(--wine)" stroke-width="4"/></svg>`,
  colar: `<svg viewBox="0 0 100 100"><path d="M20 25 Q50 70 80 25" fill="none" stroke="var(--gold)" stroke-width="4"/><circle cx="50" cy="66" r="10" fill="var(--wine)"/></svg>`,
  pulseira: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="38" ry="16" fill="none" stroke="var(--gold)" stroke-width="5"/><circle cx="50" cy="34" r="6" fill="var(--wine)"/></svg>`,
  pingente: `<svg viewBox="0 0 100 100"><path d="M20 20 Q50 55 80 20" fill="none" stroke="var(--gold)" stroke-width="3"/><path d="M40 55 Q50 40 60 55 Q68 68 50 78 Q32 68 40 55 Z" fill="var(--wine)"/></svg>`,
  conjunto: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="28" fill="none" stroke="var(--gold)" stroke-width="4"/><circle cx="50" cy="50" r="10" fill="var(--wine)"/></svg>`,
};

const images = ICONS;

const PRODUCTS = [
  {
    id: "p1",
    name: "Anel Constelação",
    price: 89.9,
    icon: "anel",
    category: "aneis",
    desc: "Zircônia central, banho de ouro 18k",
    images: [
      "https://pandorajoias.vtexassets.com/arquivos/ids/436990/PNGTRPNT_162333C01_RGB.png?v=639045265778630000",
      "https://de9mvi9pqgvkh.cloudfront.net/media/catalog/product/cache/435936c762cb3065f86a2e52a9f7d6e2/1/6/162333c01-xx-3_7.png"
    ]
  },
  {
    id: "p2",
    name: "Anel Duo Zircônia",
    price: 94.9,
    icon: "anel",
    category: "aneis",
    desc: "Dupla fileira de zircônias, ajuste confortável",
    images: [
      "https://monrealejoias.bwimg.com.br/monrealejoias/produtos/anel-zirconia-dupla-oval-1772451598.4371.jpg",
      "https://atacadodepratascombr.bwimg.com.br/atacadodepratascombr/produtos/anel-zirconia-dupla-oval-1772451701.0364.jpg"
    ]
  },
  {
    id: "p3",
    name: "Brinco Gota Dourada",
    price: 74.9,
    icon: "brinco",
    category: "brincos",
    desc: "Formato gota, fecho tarraxa",
    images: [
      "https://acdn-us.mitiendanube.com/stores/473/030/products/brinco-de-gota-dourada-brilhante-2-042cd20617ab84444b16994938735881-1024-1024.webp",
      "https://acdn-us.mitiendanube.com/stores/473/030/products/brinco-de-gota-dourada-brilhante-3-d3cf99d26bb46edcc816994938764005-1024-1024.webp"
    ]
  },
  {
    id: "p4",
    name: "Brinco Argola Clássica",
    price: 69.9,
    icon: "brinco",
    category: "brincos",
    desc: "Argola média, acabamento liso",
    images: [
      "https://lojavivarafsv3.vtexassets.com/arquivos/ids/782462-1600-1600/Argola-Redonda-em-Ouro-Amarelo-18k-18mm-7766_1_set.jpg?v=638441400109470000",
      "https://lojavivarafsv3.vtexassets.com/arquivos/ids/782468-1600-1600/Argola-Redonda-em-Ouro-Amarelo-18k-18mm-7767_2_set.jpg?v=638441400118500000"
    ]
  },
  {
    id: "p5",
    name: "Colar Ponto de Luz",
    price: 129.9,
    icon: "colar",
    category: "colares",
    desc: "Corrente fina 45cm, pingente zircônia",
    images: [
      "https://lojavivarafsv3.vtexassets.com/arquivos/ids/2490811-1600-1600/Colar-em-Prata-925-com-Quartzo-Rosa-e-Topazios-Incolores-45cm-111956_1_set.jpg?v=638931306303430000",
      "https://lojavivarafsv3.vtexassets.com/arquivos/ids/2490813-1600-1600/Colar-em-Prata-925-com-Quartzo-Rosa-e-Topazios-Incolores-45cm-112001_3_set.jpg?v=638931306317430000"
    ]
  },
  {
    id: "p6",
    name: "Pingente Coração",
    price: 59.9,
    icon: "pingente",
    category: "colares",
    desc: "Acompanha correntinha fina",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQzj6otndnk6RBuTKQ0Eh9MM5VER7fBejAmUxOdXwe9oZbLi74EPjzVUkP&s=10",
      "https://blackpowerjoias.com/wp-content/uploads/2024/12/Design-sem-nome-2024-12-03T190007.864.png"
    ]
  },
  {
    id: "p7",
    name: "Pulseira Riviera",
    price: 99.9,
    icon: "pulseira",
    category: "pulseiras",
    desc: "Elos delicados, fecho reforçado",
    images: [
      "https://lojavivarafsv3.vtexassets.com/arquivos/ids/2479814-1600-1600/Pulseira-Life-Riviera-II-em-Prata-925-com-Pedras-Verdes-103811_1_set.jpg?v=638872572109670000",
      "https://lojavivarafsv3.vtexassets.com/arquivos/ids/2479812-1600-1600/Pulseira-Life-Riviera-II-em-Prata-925-com-Pedras-Verdes-101391_2_set.jpg?v=639083213253600000"
    ]
  },
  {
    id: "p8",
    name: "Pulseira Elos Duplos",
    price: 104.9,
    icon: "pulseira",
    category: "pulseiras",
    desc: "Correntes duplas entrelaçadas",
    images: [
      "https://cuff.com.br/cdn/shop/files/Pulseira_Carlotta_Dourada_-_PU0091D_1_8c3ec57c-3983-4d1c-9398-c811b0635958.jpg?v=1773236387&width=1000",
      "https://cuff.com.br/cdn/shop/files/Pulseira_Carlotta_Dourada_1_Pulseira_Always_Dourada_1_2353d620-ba00-46b7-84aa-b0f12e2241db.jpg?v=1773236387&width=1000"
    ]
  },
  {
    id: "p9",
    name: "Conjunto Vintage",
    price: 159.9,
    icon: "conjunto",
    category: "conjuntos",
    desc: "Colar + brinco a jogo, pedra zircônia esmeralda",
    images: [
      "https://images.tcdn.com.br/img/img_prod/680812/conjunto_colar_e_brinco_gota_zircnia_folheado_em_o_2_20260211123458_bd5984aa8ee8.jpg"
    ]
  },
   {
    id: "p10",
    name: "Conjunto Pedra Cravejada ",
    price: 219.90,
    icon: "conjunto",
    category: "conjuntos",
    desc: "conjunto colar, brinco e anel",
    images: [
      "https://lcsemijoiasatacado.bwimg.com.br/lcsemijoiasatacado/produtos/conjunto-colar-brinco-e-anel-com-pedras-de-zirconia-1765830357.6231.jpg"
    ]
    },
    {
    id: "p11",
    name: "Tornozeleira cravejada cruz",
    price: 79.90,
    icon: "tornozeleira",
    category: "tornozeleiras",
    desc: "Tornozeleira cravejada com pingentes de cruz e ponto de luz",
    images: [
      "https://img.gopage.bio/page-33616/9947f1a1-80f8-49f0-bac9-0b62b47fc22e.webp",
      "https://img.gopage.bio/page-33616/54538bd8-dec3-4975-9fdc-d652585be939.webp"
    ]
    },
    {
    id: "p12",
    name: "Tornozeleira banhada a ouro",
    price: 119.90,
    icon: "tornozeleira",
    category: "tornozeleiras",
    desc: "Tornozeleira com pingentes diversos",
    images: [
      "https://primaziasemijoias.cdn.magazord.com.br/img/2026/03/produto/5725/chatgpt-image-19-de-mar-de-2026-13-49-06.png?ims=600x600",
      "https://joiasbeout.com/cdn/shop/files/Tornozeleira_Serena_Banhado_em_Ouro_18k.jpg?v=1769433602&width=1100"
    ]
    }


];

const CATEGORY_LABELS = {
  todas: "Todas",
  brincos: "Brincos",
  colares: "Colares",
  aneis: "Anéis",
  pulseiras: "Pulseiras",
  conjuntos: "Conjuntos",
  tornozeleiras: "Tornozeleiras",
};