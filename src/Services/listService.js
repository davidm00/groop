// list service
// req data with Parse
import Parse from "parse";

// READ operation - get all groups in Parse class Group
export const getAllLists = async (groupId) => {
  console.log("GroupID in getALL: ", groupId);
  const List = Parse.Object.extend("List");
  const query = new Parse.Query(List);
  query.equalTo("group", {
    __type: "Pointer",
    className: "Group",
    objectId: groupId,
  });
  return query.find().then((res) => {
    console.log("getAllLists result: ", res);
    return res;
  });
};
