// list service
// req data with Parse
import Parse from "parse";

// READ operation - get all groups in Parse class Group
export const getAllLists = async (groupId) => {
  const List = Parse.Object.extend("List");
  const query = new Parse.Query(List);
  query.equalTo("group", {
    __type: "Pointer",
    className: "Group",
    objectId: groupId,
  });
  return query.find().then((res) => {
    return res;
  });
};

// READ operation - get all group members from the Group relation
export const getAllGroupMembers = async (groupId) => {
  const Group = Parse.Object.extend("Group");
  const query = new Parse.Query(Group);
  query.equalTo("objectId", groupId);
  const group = await query.find();
  const relation = group[0].relation("users");
  const groupMembers = await relation.query().find({
    success: function (users) {
      return users;
    }
  })
  return groupMembers.map((member) => {
    return member;
  });
};

// READ operation - get the name of the group with the specified groupId
export const getGroupNameByGroupId = async (groupId) => {
  const Group = Parse.Object.extend("Group");
  const query = new Parse.Query(Group);
  query.equalTo("objectId", groupId);
  const group = await query.find();
  return group[0].attributes.name;
}

// READ operation - get a list object by its id
// Returns: list object on success, null on failure
export const getListById = async (listId) => {
  const List = Parse.Object.extend("List");
  const query = new Parse.Query(List);
  query.equalTo("objectId", listId);
  let list = await query.find();
  if (list) {
      list = list[0];
      console.log("list[0]: ", list);
      return list;
  } else {
      return null;
  }
}