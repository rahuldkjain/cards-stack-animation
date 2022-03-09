import React from "react";
import "./style.css";
import QRSampleImg from "../../constants/assets/qr-sample.png";

interface CardProps {
  card: {
    source: string;
    destination: string;
    date: string;
    arrival_time: string;
    departure_time: string;
    qr_url: string;
    meta: Array<{ title: string; subtitle: string }>;
  };
}
const Card = (props: CardProps) => {
  const { card } = props;

  return (
    <div className="card-container">
      <div className="row hr-1">
        <div className="hr-1-title">{card.source}</div>
        <div>{card.date}</div>
        <div className="hr-1-title">{card.destination}</div>
      </div>
      <div className="row hr-2">
        <div>{card.departure_time}</div>
        <div>{card.arrival_time}</div>
      </div>
      <div className="row row-start meta-section">
        <div className="meta-container">
          {card.meta &&
            card.meta.map((details, index) => (
              <div key={"details-" + index} className="meta">
                <div className="title">{details.title}</div>
                <div className="subtitle">{details.subtitle}</div>
              </div>
            ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <img src={QRSampleImg} alt="QR code" width={80} height={80} />
          <a href="https://github.com/rahuldkjain" className="know-more">
            know more
          </a>
        </div>
      </div>
      <svg
        className="line-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 172.03 0.8"
      >
        <path
          d="M341.49,225h172"
          transform="translate(-341.49 -224.5)"
          fill="none"
          stroke="#000000"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  );
};

export default Card;
