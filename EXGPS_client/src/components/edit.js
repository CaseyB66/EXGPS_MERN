import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import DateTimePicker from 'react-datetime-picker';

export default function Edit() {
  const dtText = new Intl.DateTimeFormat('en-US').format(new Date(),
   {
     hour12: true,
     dayPeriod: "short",
     year: "numeric",
     month: "short",
     day: "numeric",
     hour: "numeric",
     minute: "numeric"
   });    
  const [form, setForm] = useState({
    filename: "",
    datetime: new Date,
    mode: "bike", // bike xbike, mtnbike, indrbike, UNKNWN
    lat: 0.0,
    long: 0.0,
    dist_meter: 0.0,
    tracks: [],
  });
  const [tempForm, setTempForm] = useState({
    filename: "",
    datetime: new Date(),
    mode: "bike", // bike xbike, mtnbike, indrbike, UNKNWN
    lat: 0.0,
    long: 0.0,
    dist_meter: 0.0,
    tracks: [],
  });
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const theUrl = `http://localhost:3648/record/${params.id}`;
      console.log('fetchData id ',id,' ',theUrl);
      await fetch(theUrl).then((response)=>{
        if (response.status === 404){
          // setNotFound(true);
          console.log('fetchData returned 404');
        }
        return response.json();
      }).then((data) => {
        console.log('fetchData found valid response ');
        console.log('fetchData record ',data.toString());
        setForm(data);
        setTempForm(data);
        console.log('fetchData found datetime = ',tempForm.datetime)
      });

    }
    fetchData();
    return;
  }, [params.id, navigate]);
  async function onSubmit(e) {
    e.preventDefault();
    const editedTrack = {
      filename: tempForm.filename,
      datetime: tempForm.datetime,
//      datetime: new Intl.DateTimeFormat('en-US').format(new Date(tempForm.datetime),
//        {
//          hour12: true,
//          dayPeriod: "short",
//          year: "numeric",
//          month: "short",
//          day: "numeric",
//          hour: "numeric",
//          minute: "numeric"
//        }),
      mode: tempForm.mode, // bike xbike, mtnbike, indrbike, UNKNWN
      lat: tempForm.lat,
      long: tempForm.long,
      dist_meter: tempForm.dist_meter,
    };
    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:3648/update/${params.id}`, {
      method: "POST",
      body: JSON.stringify(editedTrack),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    navigate("/");
  }
  // This following section will display the form that takes input from the user to update the data.
  return (
      <div>
        <h3>Update Record</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="filename">File Name: </label>
            <input
              type="text"
              className="form-control"
              id="filename"
              value={tempForm.filename}
              onChange={(e) => {
                setTempForm({...tempForm, filename: e.target.value})
              }}
              />
          </div>
          <div className="form-group">
            <label htmlFor="datetime">DateTime: </label>
             <DateTimePicker 
              className="form-control"
              id="datetime"
              disableClock="true"
              value={tempForm.datetime}
              onChange={(e) => {
                setTempForm({...tempForm, datetime: e.target.value})
              }}
             />
          </div>
          <div className="form-group">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="modeOptions"
                id="modeBike"
                value="Bike"
                checked={tempForm.mode === "Bike"}
                onChange={(e) => {
                setTempForm({...tempForm, mode: e.target.value})
                }}
                />
              <label htmlFor="modeBike" className="form-check-label">Intern</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="modeOptions"
                id="modeXBike"
                value="xBike"
                checked={tempForm.mode === "xBike"}
                onChange={(e) => {
                setTempForm({...tempForm, mode: e.target.value})
                }}
                />
              <label htmlFor="modeXBike" className="form-check-label">xBike</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="modeOptions"
                id="modeIndrBike"
                value="IndrBike"
                checked={tempForm.mode === "IndrBike"}
                onChange={(e) => {
                setTempForm({...tempForm, mode: e.target.value})
                }}
                />
              <label htmlFor="modeIndrBike" className="form-check-label">IndrBike</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="modeOptions"
                id="modeMtnBike"
                value="MtnBike"
                checked={tempForm.mode === "MtnBike"}
                onChange={(e) => {
                setTempForm({...tempForm, mode: e.target.value})
                }}
                />
              <label htmlFor="modeMtnBike" className="form-check-label">MtnBike</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="modeOptions"
                id="modeUNKNWN"
                value="UNKNWN"
                checked={tempForm.mode === "UNKNWN"}
                onChange={(e) => {
                setTempForm({...tempForm, mode: e.target.value})
                }}
                />
              <label htmlFor="modeUNKNWN" className="form-check-label">UNKNWN</label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="lat">Lat</label>
            <input
              type="number" min="-360.0" max='360.0' step="0.001"
              className="form-control"
              id="lat"
              value={tempForm.lat}
              onChange={(e) => {
                setTempForm({...tempForm, lat: e.target.value})
                }}
              />
          </div>
          <div className="form-group">
            <label htmlFor="long">Long</label>
            <input
              type="number" min="-360.0" max='360.0' step="0.001"
              className="form-control"
              id="long"
              value={tempForm.long}
              onChange={(e) => {
                setTempForm({...tempForm, long: e.target.value})
                }}
              />
          </div>
          <div className="form-group">
            <label htmlFor="dist_m">Dist, meter</label>
            <input
              type="number" min="0.0" max='500000.0' step="0.01"
              className="form-control"
              id="dist_m"
              value={tempForm.dist_meter}
              onChange={(e) => {
                setTempForm({...tempForm, dist_meter: e.target.value})
                }}
              />
          </div>
      
          <br />
      
          <div className="form-group">
            <input
              type="submit"
              value="Update Record"
              className="btn btn-primary"
              />
          </div>
        </form>
      </div>
      );
}