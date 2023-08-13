import React, { useEffect, useState } from "react";
import "./Weather.css";
import axios from "axios";
import VisitorAPI from "visitorapi";

export default function Weather() {
  const [name, setName] = useState("");
  const [manual, setManual] = useState("");
  const [list, setList] = useState([]);
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState(false);
  const [hello, setHello] = useState("");

  const [latitude, setLatitide] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      setLatitide(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=22777961bc53dab1537f12c7d8fe1515`
        )
        .then((val) => {
          setName(val.data.name);
        });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (name) {
      axios
        .get(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${name}?unitGroup=us&key=ZDPY4AF8CLDKWR4GK2AKFUWQG&contentType=json`
        )
        .then((val) => {
          setCity(val.data.address);
          setList(val.data.currentConditions);
          setTemp(true);
        });
    }
  }, [name]);

  const Handler = (e) => {
    if (e.key === "Enter") {
      axios
        .get(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${manual}?unitGroup=us&key=ZDPY4AF8CLDKWR4GK2AKFUWQG&contentType=json`
        )
        .then((response) => {
          setCity(response.data.address);
          setList(response.data.currentConditions);
        });
      setTimeout(() => {
        setTemp(true);
      }, 2000);
    }
  };
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currentDate = new Date();
  const currentDayOfWeek = daysOfWeek[currentDate.getDay()];
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const formattedDate = `${day}, ${month} ${year}`;

  return (
    <div className="app-wrap">
      <div
        class="alert alert-warning alert-dismissible fade show"
        role="alert"
        style={{ textAlign: "center", borderRadius: "0px" }}
      >
        If your auto location is not correct...please type your location to{" "}
        <strong>checkyourdailyweather!</strong>
        <button
          type="button"
          class="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <header>
        <input
          type="text"
          autoComplete="off"
          className="search-box"
          placeholder="Search for a city..."
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          onKeyDown={Handler}
        />
      </header>

      {temp && (
        <main>
          <section className="location">
            <div className="city">{city}</div>
            <div className="date">
              {currentDayOfWeek} {formattedDate}
            </div>
          </section>
          <div className="current">
            <div className="temp">
              {Math.ceil((list.temp - 32) * (5 / 9))}
              <span>°c</span>
            </div>
            <div className="weather">{list.conditions}</div>
            <div className="hi-low">
              Feels like: {Math.ceil((list.feelslike - 32) * (5 / 9))}°c /
              Humidity: {Math.ceil(list.humidity)}%
            </div>
            <br />
          </div>
        </main>
      )}
    </div>
  );
}
