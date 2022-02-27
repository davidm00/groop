import "./Groups.css";
import { useNavigate } from "react-router-dom";

// GroupCard Component
const GroupCard = ({ group }) => {
  const { name } = group.attributes;
  let navigate = useNavigate();

  // display group name
  return (
    <section className="groupCard" onClick={() => {
      navigate(`/list/${group.id}`)
    }}>
      <div className="groupCardBody">
        <h2>{name}</h2>
      </div>
    </section>
  );
};

export default GroupCard;
