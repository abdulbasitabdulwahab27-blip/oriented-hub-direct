import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit, X, Save, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: AdminProducts,
});

type DBProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  description: string;
  features: string[];
  best_seller: boolean;
  sort_order: number;
  price: number;
  currency: string;
  stock: number;
  track_stock: boolean;
};

const empty: Omit<DBProduct, "id"> = { slug: "", name: "", category: "books", image: "", description: "", features: [], best_seller: false, sort_order: 0, price: 0, currency: "NGN", stock: 0, track_stock: false };

function AdminProducts() {
  const [items, setItems] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DBProduct | null>(null);
  const [form, setForm] = useState<Omit<DBProduct, "id">>(empty);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data ?? []) as DBProduct[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (p: DBProduct) => { setEditing(p); setForm({ slug: p.slug, name: p.name, category: p.category, image: p.image, description: p.description, features: p.features, best_seller: p.best_seller, sort_order: p.sort_order, price: p.price ?? 0, currency: p.currency ?? "NGN", stock: p.stock ?? 0, track_stock: p.track_stock ?? false }); setShowForm(true); };

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (!form.image.trim()) { toast.error("Image URL is required"); return; }
    const slug = form.slug.trim() || slugify(form.name);
    setBusy(true);
    try {
      if (editing) {
        const { error } = await supabase.from("products").update({ ...form, slug }).eq("id", editing.id);
        if (error) throw error;
        toast.success("Product updated.");
      } else {
        const { error } = await supabase.from("products").insert({ ...form, slug });
        if (error) throw error;
        toast.success("Product added.");
      }
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted."); load(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold">Custom Products</h2>
          <p className="text-sm text-muted-foreground">These appear on the shop alongside the built-in catalogue.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft">
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="mb-8 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{editing ? "Edit product" : "New product"}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Slug (auto)" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="leave blank to auto-generate" />
            <label className="block">
              <span className="text-sm font-semibold">Category *</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm">
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </label>
            <Field label="Image URL *" value={form.image} onChange={(v) => setForm({ ...form, image: v })} placeholder="https://..." />
            <Field label="Sort order" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) || 0 })} />
            <label className="flex items-center gap-2 mt-7">
              <input type="checkbox" checked={form.best_seller} onChange={(e) => setForm({ ...form, best_seller: e.target.checked })} />
              <span className="text-sm font-semibold">Best seller (show on home)</span>
            </label>
            <Field label="Price (0 = Price on Request)" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) || 0 })} />
            <label className="block">
              <span className="text-sm font-semibold">Currency</span>
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm">
                {["NGN","USD","GBP","EUR","GHS","KES","ZAR"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <Field label="Stock quantity" type="number" value={String(form.stock)} onChange={(v) => setForm({ ...form, stock: Number(v) || 0 })} />
            <label className="flex items-center gap-2 mt-7">
              <input type="checkbox" checked={form.track_stock} onChange={(e) => setForm({ ...form, track_stock: e.target.checked })} />
              <span className="text-sm font-semibold">Track inventory (show out-of-stock badge)</span>
            </label>
          <label className="block mt-4">
            <span className="text-sm font-semibold">Description</span>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm" />
          </label>
          <label className="block mt-4">
            <span className="text-sm font-semibold">Features (one per line)</span>
            <textarea value={form.features.join("\n")} onChange={(e) => setForm({ ...form, features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} rows={3} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm" />
          </label>
          <div className="mt-5 flex gap-2">
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              <Save className="h-4 w-4" /> {busy ? "Saving…" : "Save product"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-border bg-card/50">
          <Package className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No custom products yet. Click <b>Add product</b> to create your first one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Best seller</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3"><img src={p.image} alt={p.name} className="h-12 w-12 rounded object-cover" /></td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{categories.find((c) => c.slug === p.category)?.name ?? p.category}</td>
                  <td className="px-4 py-3">{p.best_seller ? "Yes" : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold hover:bg-muted"><Edit className="h-3.5 w-3.5" /> Edit</button>
                    <button onClick={() => remove(p.id)} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input type={type ?? "text"} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
    </label>
  );
}

