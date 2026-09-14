interface ProgressiveBlurProps {
  blurBlockHeight?: string;
}

const ProgressiveBlur = ({ blurBlockHeight = '150px' }: ProgressiveBlurProps) => {
  const layers = [
    { z: 1, blur: '0.08px', mask: 'rgba(0,0,0,0) 0%, rgb(0,0,0) 12.5%, rgb(0,0,0) 25%, rgba(0,0,0,0) 37.5%' },
    { z: 2, blur: '0.16px', mask: 'rgba(0,0,0,0) 12.5%, rgb(0,0,0) 25%, rgb(0,0,0) 37.5%, rgba(0,0,0,0) 50%' },
    { z: 3, blur: '0.31px', mask: 'rgba(0,0,0,0) 25%, rgb(0,0,0) 37.5%, rgb(0,0,0) 50%, rgba(0,0,0,0) 62.5%' },
    { z: 4, blur: '0.63px', mask: 'rgba(0,0,0,0) 37.5%, rgb(0,0,0) 50%, rgb(0,0,0) 62.5%, rgba(0,0,0,0) 75%' },
    { z: 5, blur: '1.25px', mask: 'rgba(0,0,0,0) 50%, rgb(0,0,0) 62.5%, rgb(0,0,0) 75%, rgba(0,0,0,0) 87.5%' },
    { z: 6, blur: '2.5px', mask: 'rgba(0,0,0,0) 62.5%, rgb(0,0,0) 75%, rgb(0,0,0) 87.5%, rgba(0,0,0,0) 100%' },
    { z: 7, blur: '5px', mask: 'rgba(0,0,0,0) 75%, rgb(0,0,0) 87.5%, rgb(0,0,0) 100%' },
    { z: 8, blur: '10px', mask: 'rgba(0,0,0,0) 87.5%, rgb(0,0,0) 100%' },
  ];

  return (
    <div className='w-full' style={{ height: blurBlockHeight }}>
      <div className="relative w-full h-full">
        {layers.map((layer) => (
          <div
            key={layer.z}
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: layer.z,
              backdropFilter: `blur(${layer.blur})`,
              WebkitBackdropFilter: `blur(${layer.blur})`,
              maskImage: `linear-gradient(to top, ${layer.mask})`,
              WebkitMaskImage: `linear-gradient(to top, ${layer.mask})`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressiveBlur;
