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