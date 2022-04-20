// chat service
// req data with Parse
import Parse from "parse/lib/browser/Parse";
import * as Env from "../environment";

let client = new Parse.LiveQueryClient({
  applicationId: Env.APPLICATION_ID,
  serverURL: Env.WS_SERVER_URL, //"wss://groop.b4a.io", //Env.SERVER_URL + "groop.b4a.io", // Example: 'wss://livequerytutorial.back4app.io'
  javascriptKey: Env.JAVASCRIPT_KEY,
});
let subscription = "";

// Close client
export const closeClient = async () => {
  await client.unsubscribe(subscription);
  client.close();
};

// WEBSOCKET - Open and create client
export const createClient = async () => {
  client.open();

  let Message = Parse.Object.extend("Message");
  let query = new Parse.Query(Message);
  query.find();
  subscription = await client.subscribe(query);

  return subscription;
};

// READ operation - get all messages in Parse class Message for a specific group
export const getAllMessages = async (groupId) => {
  const Message = Parse.Object.extend("Message");
  const query = new Parse.Query(Message);
  query.equalTo("group", {
    __type: "Pointer",
    className: "Group",
    objectId: groupId,
  });
  return query
    .descending("createdAt")
    .limit(7)
    .find()
    .then((res) => {
      let messages = res.map((message) => {
        return { ...message.attributes, id: message.id };
      });
      return messages.reverse();
    });
};

// CREATE - create a new message for a specific group
export const createMessage = async (groupId, userId, body) => {
  const Message = Parse.Object.extend("Message");
  const message = new Message();

  message.set("body", body);
  message.set("group", {
    __type: "Pointer",
    className: "Group",
    objectId: groupId,
  });
  message.set("group", {
    __type: "Pointer",
    className: "Group",
    objectId: groupId,
  });
  message.set("user", {
    __type: "Pointer",
    className: "_User",
    objectId: userId,
  });

  message.save().then(
    (message) => {
      // console.log("New message created: " + message.attributes.body);
    },
    (error) => {
      console.log(
        "Failed to create new message, with error code: " + error.message
      );
    }
  );
};

// UPDATE - load more messages for a specific group
export const loadMoreMessages = async (count, groupId) => {
  const Message = Parse.Object.extend("Message");
  const query = new Parse.Query(Message);
  query.equalTo("group", {
    __type: "Pointer",
    className: "Group",
    objectId: groupId,
  });
  return await query
    .descending("createdAt")
    .skip(count)
    .limit(7)
    .find()
    .then((res) => {
      if (res.length > 0) {
        let messages = res.map((message) => {
          return { ...message.attributes, id: message.id };
        });
        return messages.reverse();
      } else if (res.length < 1) {
        return [];
      }
    });
};

// DELETE - delete a message
export const deleteMessage = async (messageId) => {
  const Message = Parse.Object.extend("Message");
  const query = new Parse.Query(Message);
  return await query.get(messageId).then((res) => {
    res
      .destroy()
      .then((res) => {})
      .catch((e) => {
        console.log("Error: ", e);
      });
  });
};
