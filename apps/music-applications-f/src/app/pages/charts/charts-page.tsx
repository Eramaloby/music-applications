import { PickersLayoutContentWrapper } from '@mui/x-date-pickers';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMostLikedRecords } from '../../requests';
import './charts.styles.scss';

type ChartItem = {
  type: string;
  name: string;
  likes: number;
  image: string;
  id: string;
};

type TableViewProps = {
  items: ChartItem[];
};

const ChartsPage = () => {
  const [items, setItems] = useState<ChartItem[]>([]);

  useEffect(() => {
    const wrapper = async () => {
      const responce = await fetchMostLikedRecords();
      setItems([
        ...responce.slice(0, 100).map((item) => {
          return {
            id: item.properties.id,
            type: item.itemType,
            name: item.properties.name,
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
      <div className="charts-wrapper">
        <h1>The most popular music</h1>
        <TableView items={items}></TableView>
      </div>
    </div>
  );
};

export default ChartsPage;

const TableView = ({ items }: TableViewProps) => {
  const router = useNavigate();
  return (
    <div className="table">
      <div className="tableRow">
        <div className="numberContainer">
          <span>#</span>
        </div>
        <div className="numberContainer">
          <span></span>
        </div>
        <div className="numberContainer">
          <span>Title</span>
        </div>
        <div className="numberContainer">
          <span>Type</span>
        </div>
        <div className="numberContainer">
          <span>Likes</span>
        </div>
      </div>
      {items.map((item, index) => {
        return (
          <div className="tableRow" key={index}>
            <div className="numberContainer">
              <span>{index + 1}</span>
            </div>
            <img src={item.image} alt=""></img>
            <div className="numberContainer">
              <span
                className="link"
                onClick={() => router(`/db/${item.type}/${item.id}`)}
              >
                {item.name}
              </span>
            </div>
            <div className="numberContainer">
              <span>{item.type}</span>
            </div>
            <div className="numberContainer">
              <span>{item.likes}</span>
            </div>
          </div>
        );
      })}
    </div>
    // <table>
    //   <tr>
    //     <th>#</th>
    //     <th>Title</th>
    //     <th></th>
    //     <th>Type</th>
    //     <th>Likes</th>
    //   </tr>
    //   {items.map((item, index) => {
    //     return (
    //       <tr>
    //         <td>{index + 1}</td>
    //         <td>
    //           <img src={item.image} alt=""></img>
    //         </td>
    //         <td>{item.name}</td>
    //         <td>{item.type}</td>
    //         <td>{item.likes}</td>
    //       </tr>
    //     );
    //   })}
    // </table>
  );
};
