import { Sunny, Windy, Rainy, Cloudy, Foggy, PartlyCloudy, Snowy } from '@/components/svg-components/WeatherIcons';
import { ComponentType } from 'react';
import { fetchWeather, getWeatherLabel } from '@/utils/weather';

interface WeatherIconProps {
  className?: string;
}

const ICON_MAP: Record<string, ComponentType<WeatherIconProps>> = {
  Windy: Windy,
  Sunny: Sunny,
  'Partly Cloudy': PartlyCloudy,
  Cloudy: Cloudy,
  Foggy: Foggy,
  Rainy: Rainy,
  Snowy: Snowy,
  Stormy: Rainy,
};

function getWeatherInfo(code: number, windSpeed = 0): { label: string; Icon: ComponentType<WeatherIconProps> } {
  const label = getWeatherLabel(code, windSpeed);
  return { label, Icon: ICON_MAP[label] ?? Sunny };
}

interface ForecastDay {
  day: string;
  hi: number;
  lo: number;
  Icon: ComponentType<WeatherIconProps>;
}

const WeatherModule = async () => {
  const data = await fetchWeather();

  const currentTemp = data ? Math.round(data.current.temperature_2m) : '--';
  const currentCode = data?.current.weather_code ?? 0;
  const currentWind = data?.current.wind_speed_10m ?? 0;
  const { label, Icon: CurrentIcon } = getWeatherInfo(currentCode, currentWind);

  const forecast = data
    ? data.daily.time.slice(1, 5).map((date: string, i: number) => {
        const idx = i + 1;
        const { Icon } = getWeatherInfo(data.daily.weather_code[idx]);
        return {
          day: new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
          hi: Math.round(data.daily.temperature_2m_max[idx]),
          lo: Math.round(data.daily.temperature_2m_min[idx]),
          Icon,
        };
      })
    : ([] as ForecastDay[]);

  return (
    <div className="weather-container flex flex-row items-center pr-6 bg-[#001914] md:bg-[#001e18] p-2 ml-auto justify-between rounded-2xl border-b border-bushwood-700/15">
      <div className="today-weather-container basis-[55%] sm:basis-[35%] bg-[#01251e] text-accent flex flex-col px-6 py-4 rounded-[12px] items-center justify-between space-y-3 realistic-shadow-md border-1 border-[#66727012]">
        <div className="today-weather flex flex-col justify-between items-center space-y-3 w-full">
          <div className="weather text-[13px] flex flex-row items-center">
            <span className="flex text-ns-green">{label}</span>
            <span className="today-weather-icon-box size-[15px] inline-block ml-3 overflow-hidden">
              <CurrentIcon className="fill-ns-green size-full" />
            </span>
          </div>
          <div className="today-temperature text-[1.5rem] leading-[.75] block text-ns-green">
            <span className="temperature tracking-[1px] semibold">{currentTemp}</span>°
          </div>
        </div>
        <div className="weather-header text-ns-green text-[13px]">Lee's Summit, MO</div>
      </div>

      <div className="flex flex-row justify-between w-[40%] sm:w-[60%]">
        {forecast.map(({ day, hi, lo, Icon }: ForecastDay, index: number) => (
          <div
            key={day}
            className={`tomorrow-weather-container flex flex-col items-center text-accent/60 gap-4 w-full monospaced${index >= 2 ? ' hidden md:flex' : ''}`}>
            <div className="tomorrow-day">{day}</div>
            <Icon className="opacity-60 size-[14px]" />
            <div className="tomorrow-temperatures">
              <span className="hi">{hi}°</span>/<span className="lo">{lo}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherModule;
