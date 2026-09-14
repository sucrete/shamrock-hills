import Image from 'next/image';
import RevealAnimation from '../animation/RevealAnimation';
import { fetchWeather, getWeatherLabel } from '@/utils/weather';
const Weather = async () => {
  const data = await fetchWeather();
  return (
    <>
      {data ? (
        <>
          {Math.round(data.current.temperature_2m)}°F,{' '}
          <span className="capitalize">
            {getWeatherLabel(data.current.weather_code, data.current.wind_speed_10m).toLowerCase()},{' '}
            {Math.round(data.current.wind_speed_10m)}mph wind
          </span>
        </>
      ) : (
        <span>Weather unavailable</span>
      )}
    </>
  );
};
const CourseInfo = async () => {
  return (
    <section className="bg-[#f8feda] before:content-[''] before:h-full before:w-[20%] before:max-md:hidden before:bg-[linear-gradient(to_right,#fafafa,yellow)] before:absolute before:inset-0">
      <div className="main-container py-10 sm:py-7 ">
        <div className="max-w-[950px] grid grid-cols-3 max-md:space-y-5 mx-auto">
          <div className="col-span-12 sm:col-span-1 md:border-r border-[#02020228]">
            <RevealAnimation delay={0.3} offset={10}>
              <div className="text-center monospaced text-black/60 pb-1">weather</div>
              <div className="text-center weather max-md:text-[14px]">
                <Weather />
              </div>
            </RevealAnimation>
          </div>
          <div className="col-span-12 sm:col-span-1  md:border-r border-[#02020228]">
            <RevealAnimation delay={0.4} offset={10}>
              <div className="text-center monospaced text-black/60 pb-1">date</div>
              <div className="text-center max-md:text-[14px]">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </RevealAnimation>
          </div>
          <div className="col-span-12 sm:col-span-1 ">
            <RevealAnimation delay={0.5} offset={10}>
              <div className="text-center monospaced text-black/60 pb-1">yardage</div>
              <div className="text-center max-md:text-[14px]">White markers: 5,965</div>
            </RevealAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseInfo;
