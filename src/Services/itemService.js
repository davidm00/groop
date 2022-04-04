import { NineKOutlined } from "@mui/icons-material";
import Parse from "parse";

// READ operation - get all items from the 
export const getAllItemsInList = async (listId) => {
    console.log("listId in getAllItemsInList: ", listId);
    const Item = Parse.Object.extend("Item");
    const query = new Parse.Query(Item);
    query.equalTo("list", {
        __type: "Pointer",
        className: "List",
        objectId: listId,
    });
    return query.find().then((res) => {
        console.log("getAllItemsInList result: ", res);
        return res;
    });
};

// READ operation - retrieve the groupId for the group
// that owns the provided listId
export const getGroupIdByListId = async (listId) => {
    const List = Parse.Object.extend("List");
    const query = new Parse.Query(List);
    query.equalTo("objectId", listId);
    return query.find().then((res) => {
        // return the groupId to which this list points
        return res[0].attributes.group.id;
    })
}

// READ operation - get the name of the list with the specified listId
export const getListNameByListId = async (listId) => {
    const List = Parse.Object.extend("List");
    const query = new Parse.Query(List);
    query.equalTo("objectId", listId);
    const list = await query.find();
    return list[0].attributes.name;
}

// READ operation - get the url for the profile photo of the provided user
export const getUserPhotoUrlByUserId = async (userId) => {
    if (!userId) {
        return null;
    }
    const User = Parse.Object.extend("_User");
    const query = new Parse.Query(User);
    query.equalTo("objectId", userId);
    const user = await query.find();
    if (user.length > 0) {
        return user[0].attributes.profilePhoto._url;
    }
    return null;
}

// READ operation - get the first and last name of the provided user as an array
export const getUserNameByUserId = async (userId) => {
    if (!userId) {
        return null;
    }
    const User = Parse.Object.extend("_User");
    const query = new Parse.Query(User);
    query.equalTo("objectId", userId);
    const user = await query.find();
    if (user.length > 0) {
        return [user[0].attributes.firstName, user[0].attributes.lastName];
    }
    return null;
}

// READ operation = get the users from the 'splitAmong' relation
// of the specified item
export const getUsersFromSplitAmongRelation = async (itemId) => {
  const Item = Parse.Object.extend("Item");
  const query = new Parse.Query(Item);
  query.equalTo("objectId", itemId);
  const item = await query.find();
  console.log("item in getUsersFromSplitAmongRelation: ", item);
  const relation = item[0].relation("splitAmong");
  const users = await relation.query().find({
    success: function (users) {
      return users;
    },
    error: function (e) {
        console.log("Error in getUsersFromSplitAmongRelation: ", e);
        return null;
    }
  })
  return users ? users.map((member) => {
    console.log("User in splitAmong relation: ", member.attributes.firstName, " ", member.attributes.lastName);
    // May return different info here in the future, such as an image url, etc.
    return member;
  }) : null;
}