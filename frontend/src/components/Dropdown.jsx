import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks, selectStock } from '../feature/StockSlice';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const StockDropdown = () => {
  const dispatch = useDispatch();
  const { stocks, selectedStock } = useSelector((state) => state.stocks);

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);
  
  const handleChange = (event) => {
    dispatch(selectStock(event.target.value));
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <FormControl
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <InputLabel>Select Stock</InputLabel>
        <Select
          value={selectedStock || ''}
          onChange={handleChange}
          sx={{
            borderRadius: 2,
            '&:hover': { bgcolor: '#f5f5f5' },
          }}
        >
          {stocks.map((stock) => (
            <MenuItem
              key={stock.id}
              value={stock.id}
              sx={{
                '&:hover': { bgcolor: '#e0f7fa' },
                transition: 'background 0.3s',
              }}
            >
              {stock.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default StockDropdown;
