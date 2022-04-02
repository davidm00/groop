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