import { DayWeather, TripInput, dayCount } from './rules';

export function demoWeatherFor(input: TripInput, now = Date.now()): DayWeather[] {
  return Array.from({ length: Math.max(1, dayCount(input.startDate, input.endDate)) }, (_, index) => {
    const date = new Date(`${input.startDate}T12:00:00`);
    date.setDate(date.getDate() + index);
    const climate = new Date(`${input.startDate}T12:00:00`).getTime() - now > 1209600000;
    const wet = index === 1 || (input.activities.includes('Hiking') && index === 3);
    return { date: date.toISOString().slice(0, 10), source: climate ? 'climate' : 'forecast', high: 72 + (index % 3) * 4, low: 53 + (index % 2) * 3, precipitation: wet ? 70 : 18, wind: index === 2 ? 28 : 11, uv: 7, icon: wet ? 'RAIN' : 'SUN' };
  });
}