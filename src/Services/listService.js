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

// READ operation - get all group members from the Group relation
export const getAllGroupMembers = async (groupId) => {
  console.log("GroupID in getAllGroupMembers: ", groupId);
  const Group = Parse.Object.extend("Group");
  const query = new Parse.Query(Group);
  query.equalTo("objectId", groupId);
  const group = await query.find();
  console.log("group in getAllGroupMembers: ", group);
  const relation = group[0].relation("persons");
  const groupMembers = await relation.query().find({
    success: function (persons) {
      return persons;
    }
  })
  console.log("groupMembers: ", groupMembers);
  return groupMembers.map((member) => {
    console.log("Group member name: ", member.attributes.name);
    // May return more here in the future, such as an image url, etc.
    return member.attributes.name;
  });
};