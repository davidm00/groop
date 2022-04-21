// group service
// req data with Parse
import Parse from "parse";

// READ operation - get all groups in Parse class Group
export const getAllGroups = async() => {
  const Group = Parse.Object.extend("Group");
  const query = new Parse.Query(Group);
  return await query.find().then((results) => {
    console.log("getAllGroups result: ", results);
    // returns array of Group objects
    return results;
  });
};

// READ operation - get group by ID
export const getGroupById = async(id) => {
  const Group = Parse.Object.extend("Group");
  const query = new Parse.Query(Group);
  return await query.get(id).then((result) => {
    console.log("groupById result: ", result);
    return result;
  });
};

// READ operation - get all groups in a user's 'groups' relation
export const getUsersGroups = async() => {
  const user = Parse.User.current();
  const relation = user.relation("groups");
  return await relation.query().find({
    success: function(groups) {
      console.log("User's Groups: ", groups);
      return groups;
    },
    error: function(e) {
      console.log(e);
    }
  });
}

// WRITE operation - creates a group with the provided name
// Returns: the group object on success, null on failure
export const createGroup = async (groupName, userId) => {
  // first grab the user so we can add the new group
  // to their "groups" relation once its created
  const User = Parse.Object.extend("User");
  const query = new Parse.Query(User);
  query.equalTo("objectId", userId);
  const user = await query.first({
    success: function(user) {
      return user;
    },
    error: function(user){
      // failed to retrieve user
      return null;
    }
  });
  if (!user) {
    console.log("failed to retrieve user, so cannot create group");
    return -1;
  }
  // grab the user's "group" relation
  let groupRelation = user.relation("group");
  // now try to create the group
  const group = new Parse.Object("Group");
  group.set("name", groupName);
  try{
    // save the Object
    let groupResult = await group.save()
    console.log('New Group object created with objectId: ' + groupResult.id);
    // now add the new group to the "group" relation for the user
    groupRelation.add(groupResult);
    const userSaveResult = await user.save();
    if (!userSaveResult) {
      // if we can't add this group to a user's "group" relation,
      // then delete it because it won't have an references to it
      await deleteGroup(groupResult.id);
      return null;
    }
    return groupResult;
  } catch(error) {
      console.log('Failed in createGroup, with error code: ' + error.message);
      return null;
  }
}

// WRITE operation - update the name of an existing group
// Returns: the group object on success, null on failure
export const setGroupName = async (groupId, newGroupName) => {
  const Group = Parse.Object.extend("Group");
  const query = new Parse.Query(Group);
  const group = await query.first({
    success: function(group) {
      return group;
    },
    error: function(error) {
        console.log("Error fetching group: ", error);
        return null;
    }
  });
  if (!group) {
    // couldn't retrieve group object
    return null;
  }
  // make changes and send to parse
  group.set("name", newGroupName);
  try {
    // update the group
    const result = await group.save();
    if (result) {
      console.log("Success updating group");
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Failed to update object, with error code: ", error.message);
    return null;
  }
}




// WRITE operation - delete an existing group
// Returns: 0 on success, -1 on failure
export const deleteGroup = async (groupId) => {
  console.log("in deleteGroup with id: ", groupId);
  const Group = Parse.Object.extend("Group");
  const query = new Parse.Query(Group);
  query.equalTo("objectId", groupId);
  const group = await query.first({
    success: function(group) {
      console.log("fetched group: ", group);
      return group;
    },
    error: function(error) {
        console.log("Error fetching group: ", error);
        return null;
    }
  });
  if (!group) {
    // couldn't retrieve group object
    return -1;
  }
  try {
    // delete the group
    let result = await group.destroy();
    console.log("Object deleted with objectId: " + result.id);
    return 0;
  } catch (error) {
    console.log("failed to delete object, with error code: " + error.message);
    return -1;
  }
}