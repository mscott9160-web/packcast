import rules from './rules.json';

export type Units = 'F' | 'C';
export type Category = 'Clothing' | 'Footwear' | 'Toiletries' | 'Electronics' | 'Documents' | 'Activity Gear' | 'Weather Gear' | 'Misc';
export type Source = 'base' | 'duration' | 'weather' | 'activity' | 'user';

export interface DayWeather {
  date: string;
  source: 'forecast' | 'climate' | 'unavailable';
  high: number;
  low: number;
  precipitation: number;
  wind: number;
  uv: number;
  icon: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  reasons: string[];
  sources: Source[];
  checked: boolean;
}

export interface TripInput {
  destination: string;
  startDate: string;
  endDate: string;
  activities: string[];
  laundry: boolean;
  luggage: 'carry-on' | 'checked';
  units: Units;
}

const toFahrenheit = (value: number, units: Units) => units === 'F' ? value : value * 9 / 5 + 32;
const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function dayCount(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T12:00:00`).getTime();
  const end = new Date(`${endDate}T12:00:00`).getTime();
  const count = Math.round((end - start) / 86400000) + 1;
  return Number.isFinite(count) && count > 0 ? count : 0;
}

export function generatePackingList(input: TripInput, weather: DayWeather[]): PackingItem[] {
  const days = dayCount(input.startDate, input.endDate);
  const quantities = new Map<string, { name: string; category: Category; quantity: number; reasons: Set<string>; sources: Set<Source> }>();
  const add = (name: string, category: Category, quantity: number, reason: string, source: Source) => {
    const key = slug(name);
    const existing = quantities.get(key) ?? { name, category, quantity: 0, reasons: new Set<string>(), sources: new Set<Source>() };
    existing.quantity = Math.max(existing.quantity, quantity);
    if (reason) existing.reasons.add(reason);
    existing.sources.add(source);
    quantities.set(key, existing);
  };

  for (const item of rules.base) {
    const quantity = item.duration ? Math.min(input.laundry ? 7 : 14, days + 1) : (item.quantity ?? 1);
    add(item.name, item.category as Category, quantity, 'Essential for every trip', item.duration ? 'duration' : 'base');
  }
  for (const activity of input.activities) {
    const activityItems = rules.activities[activity as keyof typeof rules.activities] ?? [];
    for (const item of activityItems) add(item.name, item.category as Category, 1, `For ${activity.toLowerCase()}`, 'activity');
  }

  const wetDays = weather.filter((day) => day.precipitation >= 50);
  const coldDays = weather.filter((day) => toFahrenheit(day.low, input.units) < 50);
  const freezingDays = weather.filter((day) => toFahrenheit(day.low, input.units) < 32);
  const hotDays = weather.filter((day) => toFahrenheit(day.high, input.units) > 85);
  const brightDays = weather.filter((day) => day.uv >= 6);
  const windyDays = weather.filter((day) => day.wind >= 25);
  if (wetDays.length) add(input.activities.includes('Hiking') ? 'Waterproof hiking shoes' : 'Rain jacket', 'Weather Gear', 1, `Rain expected ${wetDays.length} day${wetDays.length === 1 ? '' : 's'}`, 'weather');
  if (coldDays.length) add('Warm layer', 'Weather Gear', 1, `Cool mornings on ${coldDays.length} day${coldDays.length === 1 ? '' : 's'}`, 'weather');
  if (freezingDays.length) add('Heavy coat', 'Weather Gear', 1, `Freezing temperatures expected ${freezingDays.length} day${freezingDays.length === 1 ? '' : 's'}`, 'weather');
  if (freezingDays.length) add('Hat and gloves', 'Weather Gear', 1, 'Freezing temperatures expected', 'weather');
  if (hotDays.length) add('Breathable tops', 'Clothing', Math.min(3, days), `Highs above 85 F on ${hotDays.length} day${hotDays.length === 1 ? '' : 's'}`, 'weather');
  if (hotDays.length) add('Water bottle', 'Activity Gear', 1, 'Extra hydration for hot weather', 'weather');
  if (brightDays.length) add('Sunscreen', 'Toiletries', 1, `High UV expected ${brightDays.length} day${brightDays.length === 1 ? '' : 's'}`, 'weather');
  if (brightDays.length) add('Sunglasses', 'Weather Gear', 1, 'High UV expected', 'weather');
  if (windyDays.length) add('Windbreaker', 'Weather Gear', 1, 'Strong wind expected', 'weather');
  if (input.activities.includes('Beach / pool') && brightDays.length) add('Reef-safe sunscreen', 'Toiletries', 1, 'Beach days with high UV', 'weather');
  if (input.luggage === 'carry-on') add('Travel-size liquids bag', 'Toiletries', 1, 'Carry-on liquids must be 3.4 oz / 100 ml or less', 'weather');

  return [...quantities.values()].map((item) => ({ ...item, id: slug(item.name), reasons: [...item.reasons], sources: [...item.sources], checked: false }));
}