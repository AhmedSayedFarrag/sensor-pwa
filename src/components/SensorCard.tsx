import React from 'react';

interface SensorCardProps {
  sensorName: string;
  data: { [key: string]: number | null };
}

const SensorCard: React.FC<SensorCardProps> = ({ sensorName, data }) => {
  return (
    <div className="card">
      <div className="card-header">
        {sensorName}
      </div>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          {Object.entries(data).map(([key, value]) => (
            <li className="list-group-item" key={key}>
              {key}: {value !== null ? value.toFixed(2) : 'N/A'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SensorCard;
