// chat service
// req data with Parse
import Parse from "parse/lib/browser/Parse";
import * as Env from "../environment";

let client = new Parse.LiveQueryClient({
  applicationId: Env.APPLICATION_ID,
  serverURL: "wss://groop.b4a.io", //Env.SERVER_URL + "groop.b4a.io", // Example: 'wss://livequerytutorial.back4app.io'
  javascriptKey: Env.JAVASCRIPT_KEY,
});
let subscription = "";

export const handleClient = async (action) => {
  switch (action) {
    case "open":
      console.log("OPEN CLIENT");
      client.open();
      let Message = Parse.Object.extend("Message");
      let query = new Parse.Query(Message);
      query.find().then((results) => {
        console.log("getAllMessages result: ", results);
      });
      subscription = client.subscribe(query);
      break;
    case "close":
      // console.log("CLOSE SUB");
      await client.unsubscribe(subscription);
      client.close();
      break;
    default:
      break;
  }
  // CLIENT
  client.on("open", () => {
    console.log("connection opened");
  });

  client.on("close", () => {
    console.log("connection closed");
  });

  if (subscription) {
    // SUBSCRIPTION
    subscription.on("open", () => {
      console.log("sub.open: CONNECTED");
    });

    subscription.on("create", (object) => {
      console.log("object created: ", object);
    });

    subscription.on("update", (object) => {
      console.log("object updated: ", object);
    });
  }

  if (action === "open") {
    return subscription;
  }
};

export const createClient = async () => {
  console.log("CREATE CLIENT CALLED");
  client.open();

  let Message = Parse.Object.extend("Message");
  let query = new Parse.Query(Message);
  query.find().then((results) => {
    console.log("getAllMessages result: ", results);
  });
  subscription = await client.subscribe(query);
  // if(subscription){
  //   console.log("Connection Successful: ", subscription);
  //   return subscription;
  // }
  // .then((res) => {
  //   console.log("Connection Successful: ", res);
  //   // return res;
  // })
  // .catch((e) => {
  //   console.log("Connection Failed: ", e);
  //   return "error";
  // });

  subscription.on("open", () => {
    console.log("subscription opened");
  });

  subscription.on("create", (object) => {
    console.log("object created: ", object);
  });

  subscription.on("update", (object) => {
    console.log("object updated: ", object);
  });

  return subscription;

  // let client = new Parse.LiveQueryClient({
  //   applicationId: Env.APPLICATION_ID,
  //   serverURL: Env.SERVER_URL + "groop.b4a.io", // Example: 'wss://livequerytutorial.back4app.io'
  //   javascriptKey: Env.JAVASCRIPT_KEY,
  // });
  // let query = new Parse.Query("Message");
  // query.ascending("createdAt").limit(5);
  // let subscription = client.subscribe(query);
  // client.open();
  // client.on("open", () => {
  //   console.log("socket connection established");
  // });
};

// READ operation - get all messages in Parse class Message for a specific group
export const getAllMessages = async (client, id) => {
  // const Group = Parse.Object.extend("Group");
  // const query = new Parse.Query(Group);
  // return await query.get(id).then((result) => {
  //   console.log("groupById result: ", result);
  //   return result;
  // });
  var query = new Parse.Query("Message");
  query.ascending("createdAt").limit(5);
  var subscription = client.subscribe(query);
};
