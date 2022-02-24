import { useEffect, useState } from "react";
import { getAllGroups } from "../Services/groupService";
import GroupCard from "./GroupCard";
import '../styles.css';

// Parent Component of Groups
const Groups = () => {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    // fetch groups via Parse
    getAllGroups().then((res) => {
      console.log("res in useEffect: ", res);
      setGroups(
        res.map((group) => {
          return group.attributes;
        })
      );
    });
  }, []);

  // render the groups
  return (
    <div className="groupGrid">
      {groups.map((group) => {
          return <GroupCard key={group.createdAt} group={group} />
      })}
    </div>
  );
};

export default Groups;
