import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../data/typeData";

interface UserState {
  users: User[];
  currentUser: User;
}
const initialState: UserState = {
  users: [
    // {
    //   idUser: "1",
    //   userName: "John",
    //   surname: "Doe",
    //   pseudo: "johndoe",
    //   // isOnlinne: true,
    //   role: "admin",
    //   password: "password123",
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    //   statusUser: false,
    //   // avatar: "https://example.com/avatar1.jpg",
    // },
    // {
    //   idUser: "2",
    //   userName: "Jane",
    //   surname: "Smith",
    //   pseudo: "janesmith",
    //   // isOnlinne: false,
    //   role: "user",
    //   password: "mypassword",
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    //   statusUser: false,
    //   // avatar: "https://example.com/avatar1.jpg",
    // },
    // {
    //   idUser: "3",
    //   userName: "Alice",
    //   surname: "Johnson",
    //   pseudo: "alicejohnson",
    //   // isOnlinne: true,
    //   role: "user",
    //   password: "alicepassword",
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    //   statusUser: false,
    //   // avatar: "https://example.com/avatar1.jpg",
    // },
    // {
    //   idUser: "4",
    //   userName: "Bob",
    //   surname: "Brown",
    //   pseudo: "bobbrown",
    //   // isOnlinne: false,
    //   role: "user",
    //   password: "bobpassword",
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    //   statusUser: false,
    //   // avatar: "https://example.com/avatar1.jpg",
    // },
    // {
    //   idUser: "5",
    //   userName: "Charlie",
    //   surname: "Davis",
    //   pseudo: "charliedavis",
    //   // isOnlinne: true,
    //   role: "user",
    //   password: "charliepassword",
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    //   statusUser: false,
    //   // avatar: "https://example.com/avatar1.jpg",
    // },
  ],
  currentUser: {
    idUser: "1",
    userName: "John",
    surname: "Doe",
    pseudo: "johndoe",
    // isOnlinne: true,
    roleUser: "admin",
    password: "password123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusUser: false,
    // avatar: "https://example.com/avatar1.jpg",
    email: "",
    responsibilities: [], // Optional responsibilities
    avatar: "", // Optional avatar URL
  },
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    setUser(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
  },
});

export const { setCurrentUser, setUser } = userSlice.actions;
export default userSlice.reducer;
