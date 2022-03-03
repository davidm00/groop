import "./Lists.css";

// ListCard Component
const ListCard = ({ list }) => {
  const { name } = list.attributes;
  // display list name
  return (
    <section className="listCard">
      <div className="listCardBody">
        <h2>{name}</h2>
      </div>
    </section>
  );
};

export default ListCard;
