import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStockData } from '../feature/StockSlice';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const StockGraph = ({ duration }) => {
  const dispatch = useDispatch();
  const { selectedStock, stockData } = useSelector((state) => state.stocks);
  
  useEffect(() => {
    if (selectedStock) {
      dispatch(fetchStockData({ id: selectedStock, duration }));
    }
  }, [dispatch, selectedStock, duration]);

  const formattedLabels = stockData?.length
    ? stockData.map((entry) =>
        new Date(entry.timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      )
    : [];

  const lineData = {
    labels: formattedLabels,
    datasets: [
      {
        label: 'Stock Price',
        data: stockData?.length ? stockData.map((entry) => entry.price) : [],
        borderColor: '#2196f3',
        fill: false,
      },
    ],
  };

  const barData = {
    labels: formattedLabels,
    datasets: [
      {
        label: 'Stock Volume',
        data: stockData?.length ? stockData.map((entry) => entry.volume) : [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      <div style={{ width: '45%' }}>
        <h2>Stock Price Trend</h2>
        <Line data={lineData} />
      </div>
      <div style={{ width: '45%' }}>
        <h2>Stock Volume</h2>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default StockGraph;
