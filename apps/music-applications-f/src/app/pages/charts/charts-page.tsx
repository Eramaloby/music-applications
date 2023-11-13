import { PickersLayoutContentWrapper } from '@mui/x-date-pickers';
import { useState, useEffect } from 'react';
import { fetchMostLikedRecords } from '../../requests';
import './charts.styles.scss';

type ChartItem = {
  type: string;
  likes: number;
  image: string;
};

const ChartsPage = () => {
  const [items, setItems] = useState<ChartItem[]>([]);

  useEffect(() => {
    const wrapper = async () => {
      const responce = await fetchMostLikedRecords();
      setItems([
        ...responce.slice(0, 100).map((item) => {
          return {
            type: item.itemType,
            likes: item.properties.likes.low,
            image: item.properties.image,
          };
        }),
      ]);
    };

    wrapper();
  }, []);

  return (
    <div className="charts-page-wrapper">
      <h1>The most popular music</h1>
      <div className="charts-wrapper">
        {items.map((item, index) => {
          return (
            <div key={index} className="chart-item-wrapper">
              <div className="item-number-wrapper">
                <span>{index + 1}.</span>
              </div>
              <img src={item.image} alt=""></img>
              <div className="item-info-wrapper">
                <span>{item.type}</span>
                <span>Likes: {item.likes}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartsPage;
