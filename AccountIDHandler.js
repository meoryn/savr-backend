export const userMap = new Map();

export function userIDtoAccountID(user_id) {

  console.log(userMap);

  if (userMap.has(user_id)) {
    return userMap.get(user_id);
  }
}
