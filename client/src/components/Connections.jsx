// import axios from "axios";
// import { BASE_URL } from "../utils/constants";
// import { useEffect } from "react";
// import {  useDispatch, useSelector } from "react-redux";
// import { addConnections } from "../utils/conectionSlice";
// import { Link } from "react-router-dom";



// const Connections = () => {
//   const connections = useSelector((store) => store.connections);
//   const dispatch = useDispatch();
//   const fetchConnections = async () => {
//     try {
//       const res = await axios.get(BASE_URL + "/user/connections", {
//         withCredentials: true,
//       });
//       dispatch(addConnections(res.data.data));
//     } catch (err) {
//       // Handle Error Case
//     }
//   };

//   useEffect(() => {
//     fetchConnections();
//   }, []);

//   if (!connections) return;

//   if (connections.length === 0) return <h1> No Connections Found</h1>;

//   return (
//     <div className="text-center my-10 flex">
//       <h1 className="text-bold text-white text-3xl">Connections</h1>

//       {connections.map((connection) => {
//         const { _id, firstName, lastName, photoUrl, age, gender, about } =
//           connection;

//         return (
//           <div
//             key={_id}
//             className=" m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto"
//           >
//             <div>
//               <img
//                 alt="photo"
//                 className="w-20 h-20 rounded-full object-cover"
//                 src={photoUrl}
//               />
//             </div>
//             <div className="text-left mx-4 ">
//               <h2 className="font-bold text-xl">
//                 {firstName + " " + lastName}
//               </h2>
//               {age && gender && <p>{age + ", " + gender}</p>}
//               <p>{about}</p>
//             </div>
             
//               <Link to={"/chat/" + _id}> 
//                <button className="btn btn-primary">Chat</button> 
//             </Link>

                
//           </div>
//         );
//       })}
    
//     </div>
    
//   );
// };
// export default Connections;

import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      // Handle Error Case
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;
  if (connections.length === 0) return <h1 className="text-center text-white text-2xl mt-10"> No Connections Found</h1>;

  return (
    <div className="my-10 mx-auto max-w-5xl px-4">
      <h1 className="text-white text-3xl font-bold text-center mb-6">Connections</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;

          return (
            <div key={_id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-white">
              <img alt="photo" className="w-20 h-20 rounded-full object-cover mb-4" src={photoUrl} />
              <div className="text-center">
                <h2 className="text-xl font-bold">{firstName + " " + lastName}</h2>
                {age && gender && <p className="text-sm opacity-80">{age + ", " + gender}</p>}
                <p className="text-sm mt-2">{about}</p>
              </div>
              <Link to={"/chat/" + _id} className="mt-4">
                <button className="btn btn-primary w-full">Chat</button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
