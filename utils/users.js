let users = [];

//add user

const addUser = ({ username, room, id }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!username || !room) {
    return {
      error: "Username and room name are required",
    };
  }
  let isUserExists = users.find(
    (user) => user.room === room && user.username === username
  );
  if (isUserExists) {
    return {
      error: "Username already taken",
    };
  }
  let user = {
    username,
    room,
    id,
  };
  users.push(user);
  return { user };
};

//remove user

const removeUser = (id) => {
  let index = users.findIndex((user) => user.id == id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//get user

const getUser = (id) => {
  return users.find((user) => user.id == id);
};

//get all users in a room

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};
module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
