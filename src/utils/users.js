const users = [];
const addUser = (id, username, room) => {
   username = username.trim().toLowerCase();
   room = room.trim().toLowerCase();
  if (!username || !room) return { error: "invalid credentials" };
  const exits = users.find((user) => {
    return user.username === username && room === user.room;
  });
  if (exits) return { error: "user present there" };
const user={ id, username, room }
  users.push(user);
  return {user};
};
const findUser = (id) => {
  return users.find((user) => id === user.id);
};
const findInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user) =>{return room===user.room})
}
const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  if (index === -1) return { error: "not present " };

  return {user:users.splice(index, 1)[0]};
};
module.exports={
    addUser,findUser,removeUser,findInRoom
}
