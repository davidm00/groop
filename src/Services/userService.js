// user service
// req data with Parse
import Parse from "parse";

// UPLOAD PROFILE PHOTO
export const uploadPhoto = async (currentUser, data) => {
  const User = Parse.Object.extend("User");
  const query = new Parse.Query(User);
  if (data) {
    let parseFile = new Parse.File(data.name, data);
    let user = await query.get(currentUser.id);
    user.set("profilePhoto", parseFile);
    user
      .save()
      .then((res) => {
        console.log("Successfully saved image!", res);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }
  return;
};

// RESET PASSWORD
export const resetPassword = async (currentUser, newPassword) => {
  const User = Parse.Object.extend("User");
  const query = new Parse.Query(User);
  let user = await query.get(currentUser.id);
    user.set("password", newPassword);
    user
      .save()
      .then((res) => {
        console.log("Successfully changed password!", res);
      })
      .catch((error) => {
        console.log("Failed - error: ", error);
      });
  return;
};
