import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Record = (props) => (
 <tr>
   <td>{props.record.filename}</td>

   <td>{new Intl.DateTimeFormat('en-US').format(new Date(props.record.datetime),
      {
        hour12: true,
        dayPeriod: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      })}</td>
   <td>{props.record.mode}</td> 
   <td>{props.record.lat}</td> 
   <td>{props.record.long}</td> 
   <td>{props.record.dist_meter}</td> 
   <td>
     <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link>
     <button className="btn btn-link"
       onClick={() => {
         props.deleteRecord(props.record._id);
       }}
     >
       Delete
     </button>
   </td>
 </tr>
);
export default function RecordList() {
 console.log("RecordList.js: ");  
 const [records, setRecords] = useState([]);
  // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
     console.log("recordList.js: getRecords");
     const response = await fetch(`http://localhost:3648/record/`);
      if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       // window.alert(message);
       console.log("getRecords returned error ",message);
       return;
     }
      const records = await response.json();
      console.log("getRecords returned records ");
      setRecords(records);
   }
    getRecords();
    return;
 }, [records.length]);
  // This method will delete a record
 async function deleteRecord(id) {
   await fetch(`http://localhost:3648/${id}`, {
     method: "DELETE"
   });
    const newRecords = records.filter((el) => el._id !== id);
   setRecords(newRecords);
 }
  // This method will map out the records on the table
 function recordList() {
   console.log("recordList.js: recordList");

   return records.map((record) => {
     return (
       <Record
         record={record}
         deleteRecord={() => deleteRecord(record._id)}
         key={record._id}
       />
     );
   });
 }
  // This following section will display the table with the records of individuals.
 return (
   <div>
     <h3>Record List</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>File Name</th>
           <th>DatetTme</th>
           <th>Mode</th>
           <th>Lat</th>
           <th>Long</th>
           <th>Dist, meter</th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
     </table>
   </div>
 );
}