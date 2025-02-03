import React, { useMemo, useState } from 'react';
import { ButtonGroup, Button, Box } from '@mui/material';
import { useSelector } from 'react-redux';

const DurationSelector = ({ duration, onDurationChange }) => {
  const [selectedDuration, setSelectedDuration] = useState(duration);
  const { stocks, selectedStock } = useSelector((state) => state.stocks);
  const durations = ['6m', '1y', '5y'];

  const availableDurations = useMemo(() => {
    const stock = stocks.find((s) => s.id === selectedStock);
    return stock?.available || [];
  }, [stocks, selectedStock]);

  const handleClick = (stduration) => {
    setSelectedDuration(stduration);
    onDurationChange(stduration);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 2,
      }}
    >
      <ButtonGroup
        sx={{
          display: 'flex',
          flexWrap: 'wrap', // Ensures responsiveness on smaller screens
          gap: 1,
          p: 1,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {durations.map((stduration) => (
          <Button
            key={stduration}
            onClick={() => handleClick(stduration)}
            sx={{
              borderRadius: 10,
              minWidth: 80,
              fontWeight: 'bold',
              transition: '0.3s',
              backgroundColor: selectedDuration === stduration ? 'primary.main' : 'grey.300',
              color: selectedDuration === stduration ? 'white' : 'black',
              '&:hover': {
                backgroundColor: selectedDuration === stduration ? 'primary.dark' : 'grey.400',
              },
            }}
            disabled={!availableDurations.includes(stduration)}
          >
            {stduration}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default DurationSelector;
