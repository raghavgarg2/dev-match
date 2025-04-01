// import io from "socket.io-client";

// import { BASE_URL } from "./constants";

// export const createSocketConnection = () => {
//   return io(BASE_URL);
// };

// import io from "socket.io-client";
// import { BASE_URL } from "./constants";

// export const createSocketConnection = () => {
//   if (location.hostname === "localhost") {
//     return io(BASE_URL);
//   } else {
//     return io("/", { path: "/api/socket.io" });
//   }
// };

import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  if (typeof window !== "undefined" && location.hostname === "localhost") {
    return io(BASE_URL);
  } else {
    return io(BASE_URL, {
      path: "/socket.io", // Backend ke socket route ka path
      transports: ["websocket", "polling"], // Transport methods specify karna
      withCredentials: true, // CORS issue avoid karne ke liye
    });
  }
};
