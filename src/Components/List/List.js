import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllLists } from "../../Services/listService";
import ListCard from "./ListCard";

// List Component
const List = () => {
  const [lists, setLists] = useState([]);
  const params = useParams();
  console.log("List component params: ", params);

  useEffect(() => {
    // Get all lists in a specific group
    getAllLists(params.groupId).then((res) => {
      console.log(`${params.groupId} Lists: `, res);
      setLists(res);
    });
  }, [params.groupId]);

  // display list
  return (
    <section>
      <h1
        style={{
          padding: "25px",
        }}
      >
        List Component
      </h1>
      <div className="listGrid">
        {lists.length > 0 ? lists.map((list) => {
          return <ListCard key={list.id} list={list} />;
        }) : <>No Lists</>}
      </div>
    </section>
  );
};

export default List;
