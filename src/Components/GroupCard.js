import '../styles.css';

// GroupCard Component
const GroupCard = ({ group }) => {
    const { name } = group;
    // display group name
    return (
      <section className="groupCard">
        <div className="groupCardBody">
          <h2>{name}</h2>
        </div>
      </section>
    );
  };
  
  export default GroupCard;
  