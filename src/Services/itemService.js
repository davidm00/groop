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