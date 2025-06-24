export const userMap = new Map();

export function userIDtoAccountID(user_id) {
  if (userMap.has(user_id)) {
    return userMap.get(user_id);
  }
}