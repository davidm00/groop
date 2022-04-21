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

// WRITE operation - create a list with the provided name
// Returns: the list object on success, null on failure
export const createList = async (listName, groupId) => {
  const list = new Parse.Object("List");
  list.set("name", listName);
  const groupPointer = new Parse.Object("Group");
  groupPointer.set("objectId", groupId);
  list.set("group", groupPointer);
  try{
    // save the Object
    let result = await list.save()
    console.log('New List object created with objectId: ' + result.id);
    return result;
  } catch(error) {
      console.log('Failed to create new List object, with error code: ' + error.message);
      return null;
  }
}

// WRITE operation - update the name of an existing list
// Returns: the list object on success, null on failure
export const setListName = async (listId, newListName) => {
  const List = Parse.Object.extend("List");
  const query = new Parse.Query(List);
  const list = await query.first({
    success: function(list) {
        return list;
    },
    error: function(error) {
        console.log("Error fetching list: ", error);
        return null;
    }
  });
  if (!list) {
    // couldn't retrieve list item
    return null;
  }
  // make changes to send to parse
  list.set("name", newListName);
  try{
    // update the list
    const result = await list.save();
    if (result) {
        console.log("Success updating object");
        return result;
    } else {
        return null;
    }
  } catch(error) {
      console.log('Failed to update object, with error code: ' + error.message);
      return null;
  }
}

// WRITE operation: deletes the list with the provided ID
// Returns: 0 on success, -1 on failure
export const deleteList = async (listId) => {
  console.log("in deleteList with id: ", listId);
  const List = Parse.Object.extend("List");
  const query = new Parse.Query(List);
  query.equalTo("objectId", listId);
  const list = await query.first({
    success: function(list) {
      console.log("fetched list: ", list);
      return list;
    },
    error: function(error) {
        console.log("Error fetching list: ", error);
        return null;
    }
  });
  if (!list) {
    // couldn't retrieve list object
    return -1;
  }
  try{
    // delete the list
    let result = await list.destroy();
    console.log('Object deleted with objectId: ' + result.id);
    return 0;
  } catch(error) {
      console.log('Failed to delete object, with error code: ' + error.message);
      return -1;
  }
}