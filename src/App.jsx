import React, { useState, useMemo } from "react";
import perfume from "./assets/perfume.png";
import shoes from "./assets/shoes.png";
import bag from "./assets/bag.png";
import dress from "./assets/dress.png";
import lipstick from "./assets/lipstick.png";

const IMAGE_MAP = [
  { keys: ["perfume", "عطر", "طيب", "عطور", "fragrance", "spray"], img: perfume },
  { keys: ["shoe", "shoes", "حذاء", "جزمة", "sneaker", "boot"], img: shoes },
  { keys: ["bag", "شنطة", "حقيبة"], img: bag },
  { keys: ["dress", "فستان", "ملابس"], img: dress },
  { keys: ["lipstick", "مسكرة", "mascara"], img: lipstick },
];

export function autoImageForName(name) {
  if (!name) return perfume;
  const lowerName = name.toLowerCase().trim();
  const found = IMAGE_MAP.find(({ keys }) =>
    keys.some(k => lowerName.includes(k.toLowerCase()))
  );
  return found?.img || perfume;
}

const defaultItems = [
  { id: crypto.randomUUID(), name: "perfume", price: 35, image: perfume },
  { id: crypto.randomUUID(), name: "shoes", price: 60, image: shoes },
  { id: crypto.randomUUID(), name: "bag", price: 25, image: bag },
  { id: crypto.randomUUID(), name: "dress", price: 120, image: dress },
  { id: crypto.randomUUID(), name: "lipstick", price: 15, image: lipstick },
];

export default function App() {
  const [items, setItems] = useState(defaultItems);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const total = useMemo(() => items.reduce((s, i) => s + Number(i.price || 0), 0), [items]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(i => i.name.toLowerCase().includes(q));
  }, [items, search]);

  function onAdd(e) {
    e?.preventDefault();
    const n = name.trim();
    const p = Number(price);
    if (!n || isNaN(p)) return;
    if (items.some(i => i.name.toLowerCase() === n.toLowerCase())) {
      alert("This item already exists!");
      return;
    }
    const img = autoImageForName(n);
    const newItem = { id: crypto.randomUUID(), name: n, price: p, image: img };
    setItems([newItem, ...items]);
    setName(""); setPrice("");
  }

  function onDelete(id) {
    setItems(items.filter(i => i.id !== id));
  }

  function startEdit(item) {
    setEditingId(item.id);
    setName(item.name);
    setPrice(String(item.price));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveEdit(e) {
    e?.preventDefault();
    const n = name.trim();
    const p = Number(price);
    if (!n || isNaN(p)) return;
    if (items.some(i => i.id !== editingId && i.name.toLowerCase() === n.toLowerCase())) {
      alert("Duplicate name with another item!");
      return;
    }
    const img = autoImageForName(n);
    setItems(items.map(i => i.id === editingId ? { ...i, name: n, price: p, image: img } : i));
    setEditingId(null); setName(""); setPrice("");
  }

  const Price = ({ value }) => {
    const v = Number(value);
    let cls = "text-emerald-400"; 
    if (v > 100) cls = "text-rose-500"; 
    else if (v > 50) cls = "text-orange-400"; 
    return <div className={`font-semibold ${cls}`}>${v}</div>;
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-br from-[#69127f] to-[#03000e] text-white">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-sm">Shopping List</h1>
      </header>

      {/* Add / Edit Form */}
      <form onSubmit={editingId ? saveEdit : onAdd} 
        className="glass p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-3 items-center rounded-2xl">
        <input 
          className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-white/70 text-white md:col-span-5" 
          placeholder="Item name / اسم العنصر"
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
        <input 
          className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-white/70 text-white md:col-span-5" 
          placeholder="Price / السعر" 
          type="number" 
          min="0"
          value={price} 
          onChange={e => setPrice(e.target.value)} 
        />
        <button 
          className="h-full px-6 py-2 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md md:col-span-2">
          {editingId ? "💾 Save" : "➕ Add"}
        </button>
      </form>

      {/* Search */}
      <div className="mt-4 flex gap-3">
        <input 
          className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 focus:ring-2 focus:ring-purple-400 focus:outline-none placeholder-white/70 text-white" 
          placeholder="ابحث... Search items (e.g. mascara, car, apple)"
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
        <div className="glass px-4 py-2 flex items-center gap-2 rounded-xl">
          <span className="opacity-70 text-sm">Total</span>
          <span className="font-bold">${total}</span>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="glass mt-10 p-10 text-center rounded-2xl">
          <p className="text-lg">لا توجد عناصر مطابقة لبحثك.</p>
          <p className="opacity-70">Tip: اكتب كلمات مثل "عطر" أو "mascara" ليتم اختيار الصور تلقائياً.</p>
        </div>
      )}

      {/* Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(item => (
          <article key={item.id} className="glass p-4 flex flex-col rounded-2xl">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-3 flex items-center justify-center bg-white/10">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold capitalize">{item.name}</h3>
              <Price value={item.price} />
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => startEdit(item)} 
                className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md">
                ✏️ Edit
              </button>
              <button 
                onClick={() => onDelete(item.id)} 
                className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 transition-all shadow-md">
                🗑️ Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <footer className="text-center opacity-70 mt-20">
        <p>Huda Hussein Ali shopping site</p>
      </footer>
    </div>
  );
}
