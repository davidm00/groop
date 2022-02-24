// json data service
// req data with Parse
import Parse from "parse";

// READ operation - get all groups in Parse class Group
export const getAllGroups = () => {
  const Group = Parse.Object.extend("Group");
  const query = new Parse.Query(Group);
  return query.find().then((results) => {
    console.log("getAllGroups result: ", results);
    // returns array of Group objects
    return results;
  });
};

// READ operation - get lesson by ID
export const getGroupById = (id) => {
  const Group = Parse.Object.extend("Group");
  const query = new Parse.Query(Group);
  return query.get(id).then((result) => {
    // return Lesson object with objectId: id
    console.log("groupById result: ", result);
    console.log("groupById result: ", result.attributes);
    return result.attributes;
  });
};
