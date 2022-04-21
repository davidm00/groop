// group service
// req data with Parse
import Parse from "parse";

// READ operation - get all groups in Parse class Group
export const getAllGroups = async () => {
  const Group = Parse.Object.extend("Group");
  const query = new Parse.Query(Group);
  return await query.find().then((results) => {
    console.log("getAllGroups result: ", results);
    // returns array of Group objects
    return results;
  });
};

// READ operation - get group by ID
export const getGroupById = async (id) => {
  const Group = Parse.Object.extend("Group");
  const query = new Parse.Query(Group);
  return await query.get(id).then((result) => {
    console.log("groupById result: ", result);
    return result;
  });
};

// READ operation - get all groups in a user's 'groups' relation
export const getUsersGroups = async () => {
  const user = Parse.User.current();
  const relation = user.relation("groups");
  return await relation.query().find({
    success: function (groups) {
      console.log("User's Groups: ", groups);
      return groups;
    },
    error: function (e) {
      console.log(e);
    },
  });
};

// CREATE operation - join group by ID
export const joinGroup = async (groupId) => {
  console.log("ID: ", groupId);
  let user = Parse.User.current();
  const Group = Parse.Object.extend("Group");
  let query = new Parse.Query(Group);
  let group;
  await query.get(groupId).then((res) => {
    console.log("THE ANSW: ", res);
    group = res;
  });
  let groupRelation = group.relation("users");
  let userQuery = groupRelation.query();
  userQuery
    .get(user.id)
    .then((res) => {
      console.log("YES FOUND: ", res);
      // return result;
    })
    .then(() => {
      console.log("Already in query");
    })
    .catch(() => {
      console.log("group", group);
      let userRelation = user.relation("groups");
      userRelation.add(group);
      user.save();
      groupRelation.add(user);
      group.save();
    });
  return group;
};

// DELETE operation - leave group by ID
export const leaveGroup = async (groupId) => {
  let user = Parse.User.current();
  const Group = Parse.Object.extend("Group");
  let query = new Parse.Query(Group);
  let group;
  await query.get(groupId).then((res) => {
    // return Lesson object with objectId: id
    group = res;
    // return result;
  });
  let groupRelation = group.relation("users");
  let userQuery = groupRelation.query();
  userQuery
    .get(user.id)
    .then((res) => {
      // return Lesson object with objectId: id
      // return result;
    })
    .then(() => {
      console.log("group", group);
      let userRelation = user.relation("groups");
      userRelation.remove(group);
      user.save();
      groupRelation.remove(user);
      group.save();
    })
    .catch(() => {
      console.log("Not in query");
    });
    return groupId;
};
