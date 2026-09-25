import { describe, expect, it } from 'vitest';
import { DayWeather, TripInput, dayCount, generatePackingList } from './rules';

const trip: TripInput = { destination: 'Lisbon', startDate: '2026-10-01', endDate: '2026-10-04', activities: ['Hiking', 'Beach / pool'], laundry: false, luggage: 'carry-on', units: 'F' };
const weather: DayWeather[] = [
  { date: '2026-10-01', source: 'forecast', high: 90, low: 60, precipitation: 10, wind: 12, uv: 7, icon: 'SUN' },
  { date: '2026-10-02', source: 'forecast', high: 78, low: 48, precipitation: 70, wind: 28, uv: 5, icon: 'RAIN' },
];

describe('packing rules', () => {
  it('counts inclusive trip days and caps duration quantities with laundry', () => {
    expect(dayCount('2026-10-01', '2026-10-04')).toBe(4);
    expect(generatePackingList({ ...trip, endDate: '2026-10-20', laundry: true }, weather).find((item) => item.name === 'Underwear')?.quantity).toBe(7);
  });

  it('adds weather and activity recommendations and merges reasons', () => {
    const list = generatePackingList(trip, weather);
    expect(list.some((item) => item.name === 'Waterproof hiking shoes')).toBe(true);
    expect(list.find((item) => item.name === 'Water bottle')?.reasons).toContain('Extra hydration for hot weather');
    expect(list.find((item) => item.name === 'Sunscreen')?.reasons[0]).toContain('High UV');
    expect(list.find((item) => item.name === 'Travel-size liquids bag')).toBeTruthy();
  });

  it('does not add thresholds that are not met', () => {
    const mild: DayWeather = { date: '2026-10-01', source: 'forecast', high: 70, low: 55, precipitation: 10, wind: 8, uv: 3, icon: 'SUN' };
    const list = generatePackingList({ ...trip, activities: ['Sightseeing'], luggage: 'checked' }, [mild]);
    expect(list.some((item) => item.sources.includes('weather'))).toBe(false);
  });
});