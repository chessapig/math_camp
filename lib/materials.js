// Materials helpers. Each activity lists materials in its front matter:
//
//   materials:
//     - item: Uncooked spaghetti (1 lb box)
//       qty: 2
//       cost: 1.50        # cost per unit, in dollars
//       consumable: true  # used up by the activity (default: false)

const num = (v, fallback = 0) => (v === undefined || v === null || v === "" ? fallback : Number(v));

export function lineCost(m) {
  return num(m.qty, 1) * num(m.cost);
}

export function materialsCost(materials = []) {
  return materials.reduce((sum, m) => sum + lineCost(m), 0);
}

export function money(value) {
  return "$" + num(value).toFixed(2);
}

// Combine the materials of several activities into one shopping list.
// Consumables add up (every activity uses its own supply); reusable items
// don't, so we only need as many as the most demanding activity requires.
// An activity scheduled twice counts its consumables twice.
export function aggregateMaterials(activities = []) {
  const items = new Map();
  for (const activity of activities) {
    if (!activity) continue;
    for (const m of activity.data.materials ?? []) {
      const key = String(m.item).trim().toLowerCase();
      const qty = num(m.qty, 1);
      let entry = items.get(key);
      if (!entry) {
        entry = { item: m.item, cost: num(m.cost), consumable: !!m.consumable, qty: 0, usedBy: [] };
        items.set(key, entry);
      }
      entry.qty = entry.consumable ? entry.qty + qty : Math.max(entry.qty, qty);
      if (!entry.usedBy.some((u) => u.url === activity.url)) {
        entry.usedBy.push({ title: activity.data.title, url: activity.url });
      }
    }
  }

  const all = [...items.values()]
    .map((e) => ({ ...e, total: e.qty * e.cost }))
    .sort((a, b) => a.item.localeCompare(b.item));
  const consumable = all.filter((e) => e.consumable);
  const reusable = all.filter((e) => !e.consumable);
  const sum = (list) => list.reduce((s, e) => s + e.total, 0);

  return {
    consumable,
    reusable,
    totals: { consumable: sum(consumable), reusable: sum(reusable), all: sum(all) },
  };
}
