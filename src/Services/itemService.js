import Parse from "parse";
import {getUserById} from "./userService";
import {getListById} from "./listService";

// READ operation - get all items from the 
export const getAllItemsInList = async (listId) => {
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
    if (user.length > 0 && user[0].attributes.profilePhoto) {
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

// READ operation - get the users from the 'splitAmong' relation
// of the specified item
// Returns: a list of users (can be empty)
export const getUsersFromSplitAmongRelation = async (itemId) => {
  const Item = Parse.Object.extend("Item");
  const query = new Parse.Query(Item);
  query.equalTo("objectId", itemId);
  const item = await query.find();
  const relation = item[0].relation("splitAmong");
  const users = await relation.query().find({
    success: function (users) {
      return users;
    },
    error: function (e) {
        console.log("Error in getUsersFromSplitAmongRelation: ", e);
        return [];
    }
  })
  return users.length >= 1 ? users.map((member) => {
    // May return different info here in the future, such as an image url, etc.
    return member;
  }) : [];
}

// WRITE operation - set item as purchased by the provided userId
// Returns: -1 if unsuccessful, 0 if successful
export const setItemAsPurchasedByUserId = async (itemId, userId) => {
    const User = Parse.Object.extend("_User");
    const query1 = new Parse.Query(User);
    query1.equalTo("objectId", userId);
    const user = await query1.find();
    if (user.length === 0) {
        console.log("Issue retrieving user object to point purchased field towards");
        return -1;
    }
    const Item = Parse.Object.extend("Item");
    const query2 = new Parse.Query(Item);
    query2.equalTo("objectId", itemId);
    const item = await query2.first({
        success: function(item) {
            return item;
        },
        error: function(error) {
            console.log("Error fetching item: ", error);
            return null;
        }
    });
    if (item === null) {
        return -1;
    }
    const result = await item.save({purchased: user[0]});
    if (result.attributes.purchased === user[0]) {
        return 0;
    } else {
        return -1;
    }
}

// WRITE operation - set item as not purchased
// Returns: -1 if unsuccessful, 0 if successful
export const setItemAsNotPurchased = async (itemId) => {
    const Item = Parse.Object.extend("Item");
    const query = new Parse.Query(Item);
    query.equalTo("objectId", itemId);
    const item = await query.first({
        success: function(item) {
            return item;
        },
        error: function(error) {
            console.log("Error fetching item: ", error);
            return null;
        }
    });
    if (item === null) {
        return -1;
    }
    const result = await item.save({purchased: null});
    if (result.attributes.purchased === null) {
        return 0;
    } else {
        return -1;
    }
}


// WRITE operation - set item as desired by the provided user
// Returns: the users in the splitAmong relation (or an empty list if there are none) 
//          if successful, null otherwise
export const setItemAsDesiredByUser = async (itemId, userId) => {
    // grab the item from the database
    const Item = Parse.Object.extend("Item");
    const query1 = new Parse.Query(Item);
    query1.equalTo("objectId", itemId);
    const item = await query1.first({
        success: function(item) {
            return item;
        },
        error: function(error) {
            console.log("Error fetching item: ", error);
            return null;
        }
    });
    if (item === null) {
        return null;
    }
    // grab the splitAmong relation from the item
    const splitAmongRelation = item.relation("splitAmong");
    // grab the user from the database
    const User = Parse.Object.extend("_User");
    const query2 = new Parse.Query(User);
    query2.equalTo("objectId", userId);
    const user = await query2.find();
    // try to add the user to the splitAmong relation
    splitAmongRelation.add(user);
    try {
        await item.save();
        return await getUsersFromSplitAmongRelation(itemId);
    } catch (error) {
        console.log("Error saving User to splitAmong relation: ", error);
        return null;
    }
}

// WRITE operation - set item as not desired by the provided user
// Returns: the users in the splitAmong relation (or an empty list if there are none) 
//          if successful, null otherwise
export const setItemAsNotDesiredByUser = async (itemId, userId) => {
    // grab the item from the database
    const Item = Parse.Object.extend("Item");
    const query1 = new Parse.Query(Item);
    query1.equalTo("objectId", itemId);
    const item = await query1.first({
        success: function(item) {
            return item;
        },
        error: function(error) {
            console.log("Error fetching item: ", error);
            return null;
        }
    });
    if (item === null) {
        return null;
    }
    // grab the splitAmong relation from the item
    const splitAmongRelation = item.relation("splitAmong");
    // grab the user from the database
    const User = Parse.Object.extend("_User");
    const query2 = new Parse.Query(User);
    query2.equalTo("objectId", userId);
    const user = await query2.find();
    // try to remove the user from the splitAmong relation
    splitAmongRelation.remove(user);
    try {
        await item.save();
        return await getUsersFromSplitAmongRelation(itemId);
    } catch (error) {
        console.log("Error removing User from splitAmong relation: ", error);
        return null;
    }
}

// WRITE operation - delete the item from the database
// Returns: 0 on success, -1 on failure
export const deleteItemById = async (itemId) => {
    // grab the item from the database
    const Item = Parse.Object.extend("Item");
    const query1 = new Parse.Query(Item);
    query1.equalTo("objectId", itemId);
    const item = await query1.first({
        success: function(item) {
            return item;
        },
        error: function(error) {
            console.log("Error fetching item: ", error);
            return null;
        }
    });
    if (item === null) {
        return -1;
    }
    try{
        // delete the item
        let result = await item.destroy();
        console.log('Object deleted with objectId: ' + result.id);
        return 0;
    } catch(error) {
        console.log('Failed to delete object, with error code: ' + error.message);
        return -1;
    }
}

// WRITE operation - create a new item with the provided data
// Returns: object on success, null on failure
export const createItemWithAttributes = async (
    name, price, itemPhotoData, purchaserId, desirerId, listId
    ) => {
    // if listId doesn't exist, we can exit early
    if (!listId) {
        return null;
    }
    const listPointer = new Parse.Object("List");
    listPointer.set("objectId", listId);
    const noOp = () => {};
    const item = new Parse.Object("Item");
    item.set("list", listPointer);
    item.set("name", name);
    price ? item.set("price", price) : noOp();
    if (itemPhotoData) {
        let parseFile = new Parse.File(itemPhotoData.name, itemPhotoData);
        item.set("photo", parseFile);
    }
    if (purchaserId) {
        // retrieve the _User object and point to it in the 'desired' field
        const user = await getUserById(purchaserId);
        user ? item.set("purchased", user) : noOp();
    }
    if (desirerId) {
        // retrieve the _User object and add it to the splitAmong relation
        // for the item object
        let splitAmongRelation = item.relation("splitAmong");
        const user = await getUserById(desirerId);
        user ? splitAmongRelation.add(user) : noOp();
    }
    try{
        // save the Object
        let result = await item.save()
        console.log('New Item object created with objectId: ' + result.id);
        return result;
    } catch(error) {
        console.log('Failed to create new Item object, with error code: ' + error.message);
        return null;
    }
    
}