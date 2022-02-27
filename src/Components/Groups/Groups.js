import { useEffect, useState } from "react";
import { getAllGroups } from "../../Services/groupService";
import GroupCard from "./GroupCard";
import "./Groups.css";

// Parent Component of GroupCards
const Groups = () => {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    // fetch groups via Parse
    getAllGroups().then((res) => {
      console.log(`Groups: `, res);
      setGroups(res);
    });
  }, []);

  // render the groups
  return (
    <section>
      <h1
        style={{
          padding: "25px",
        }}
      >
        Groups Component
      </h1>
      <div className="groupGrid">
        {groups.map((group) => {
          return <GroupCard key={group.id} group={group} />;
        })}
      </div>
    </section>
  );
};

export default Groups;
