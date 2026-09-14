import { LargeGear, SmallGear, Club } from '@/components/svg-components/ClubAndGears';

const TQSGears = () => {
  return (
    <div className="tqs-gears-container relative w-fit mr-1">
      <SmallGear />
      <LargeGear />
      <Club />
    </div>
  );
};

export default TQSGears;
