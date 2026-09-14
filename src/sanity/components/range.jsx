import { useState, useRef } from 'react';
import { set } from 'sanity';
import { Flex, Text, Card } from '@sanity/ui';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

export const RangeInput = ({ value, onChange, schemaType }) => {
  const { min = 3, max = 7, step = 0.25 } = schemaType.options ?? {};
  const [sliderValue, setSliderValue] = useState([min, value ?? min]);
  const ref = useRef();

  const handleInput = (next) => {
    setSliderValue(next);
    onChange(set(next[1]));
  };

  return (
    <Flex align="center" gap={3}>
      <Card className='slider-readout'>
        <Text size={2} weight="medium">
          {sliderValue[1]}
        </Text>
      </Card>

      <RangeSlider
        className="single-thumb"
        ref={ref}
        value={sliderValue}
        min={min}
        max={max}
        step={step}
        onInput={handleInput}
        defaultValue={[min, value ?? min]}
        thumbsDisabled={[true, false]}
        rangeSlideDisabled={true}
      />
    </Flex>
  );
};
