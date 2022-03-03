import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllLists, getAllGroupMembers } from "../../Services/listService";
import ListCard from "./ListCard";

// List Component
const List = () => {
  const [lists, setLists] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const params = useParams();
  console.log("List component params: ", params);

  useEffect(() => {
    // Get all lists in a specific group
    getAllLists(params.groupId).then((res) => {
      console.log(`${params.groupId} Lists: `, res);
      setLists(res);
    });
  }, [params.groupId]);

  useEffect(() => {
    getAllGroupMembers(params.groupId).then((res) => {
      setGroupMembers(res);
    });
  }, [params.groupId])

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
      <h1
        style={{
          padding: "25px",
        }}
      >
      <div className="groupMembers">
        <p>Group Members:</p>
        <ul>
        {
        groupMembers.length > 0 ? 
          groupMembers.map((member) => {
          return <li>{member}</li>;
        }) : <>No Group Members</>
        }
        </ul>
      </div>
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