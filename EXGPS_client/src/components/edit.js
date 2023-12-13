import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
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
    datetime: dtText,
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
      const response = await fetch(`http://localhost:3648/record/${params.id.toString()}`);
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        window.alert(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }
    fetchData();
    return;
  }, [params.id, navigate]);
  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return {...prev, ...value};
    });
  }
  async function onSubmit(e) {
    e.preventDefault();
    const editedTrack = {
      filename: form.filename,
      datetime: new Intl.DateTimeFormat('en-US').format(new Date(form.datetime),
                 {
                   hour12: true,
                   dayPeriod: "short",
                   year: "numeric",
                   month: "short",
                   day: "numeric",
                   hour: "numeric",
                   minute: "numeric"
                 }),
      mode: form.mode, // bike xbike, mtnbike, indrbike, UNKNWN
      lat: form.lat,
      long: form.long,
      dist_meter: form.dist_meter,
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
              value={form.filename}
              onChange={(e) => updateForm({filename: e.target.value})}
              />
          </div>
          <div className="form-group">
            <label htmlFor="datetime">DateTime: </label>
            <input
              type="date"
              className="form-control"
              id="datetime"
              value={new Intl.DateTimeFormat('en-US').format(new Date(form.datetime),
                 {
                   hour12: true,
                   dayPeriod: "short",
                   year: "numeric",
                   month: "short",
                   day: "numeric",
                   hour: "numeric",
                   minute: "numeric"
                 })}
              onChange={(e) => updateForm({datetime: e.target.value})}
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
                checked={form.mode === "Bike"}
                onChange={(e) => updateForm({mode: e.target.value})}
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
                checked={form.mode === "xBike"}
                onChange={(e) => updateForm({mode: e.target.value})}
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
                checked={form.mode === "IndrBike"}
                onChange={(e) => updateForm({mode: e.target.value})}
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
                checked={form.mode === "MtnBike"}
                onChange={(e) => updateForm({mode: e.target.value})}
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
                checked={form.mode === "UNKNWN"}
                onChange={(e) => updateForm({mode: e.target.value})}
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
              value={form.lat}
              onChange={(e) => updateForm({lat: e.target.value})}
              />
          </div>
          <div className="form-group">
            <label htmlFor="long">Long</label>
            <input
              type="number" min="-360.0" max='360.0' step="0.001"
              className="form-control"
              id="long"
              value={form.long}
              onChange={(e) => updateForm({long: e.target.value})}
              />
          </div>
          <div className="form-group">
            <label htmlFor="dist_m">Dist, meter</label>
            <input
              type="number" min="0.0" max='500000.0' step="0.01"
              className="form-control"
              id="dist_m"
              value={form.dist_meter}
              onChange={(e) => updateForm({dist_meter: e.target.value})}
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