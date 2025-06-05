import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "./Table";

const BrPostApi = () => {
  const [districts, setDistricts] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let data = await axios.post(
      "https://backend.ts-bpass.com/api/v1/citizen_search/search_by_params",
      {},
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    console.log(data.data.data);
    setApplications(data.data.data.applications);

    setDistricts((prev) => {
      const values = [
        ...prev,
        ...data.data.data.applications.map((each) => each.district_name),
      ];
      const unique = [...new Set(values)];
      return unique;
    });

    setLocalities((prev) => {
      const values = [
        ...prev,
        ...data.data.data.applications.map((each) => each.locality),
      ];
      const unique = [...new Set(values)];
      return unique;
    });
  };

  const selectChangeHandler = (e) => {
    const { options } = e.target;
    const values = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setActiveFilters((prev) => {
      const allActives = [...prev, ...values];
      const unique = [...new Set(allActives)];
      return unique;
    });
  };
  console.log("Selected Filters :", activeFilters);

  const filteredApplications = applications.filter((eachApplication) =>
    activeFilters.length === 0
      ? applications
      : activeFilters.includes(eachApplication.district_name) ||
        activeFilters.includes(eachApplication.locality)
  );
  console.log(filteredApplications);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Welcome to Website</h1>
      <div className="d-flex flex-direction-row align-items-center">
        <label className="m-2">District :</label>
        <select
          name="activeDistricts"
          onChange={selectChangeHandler}
          value={activeFilters.activeDistricts}
          className="m-2"
        >
          <option>Please Choose an Option</option>
          {districts.map((eachDistrict) => (
            <option key={eachDistrict} value={eachDistrict.trim()}>
              {eachDistrict}
            </option>
          ))}
        </select>
        <label className="m-2">Localities : </label>
        <select
          name="activeLocalities"
          className="m-2"
          value={activeFilters.activeLocalities}
          onChange={selectChangeHandler}
        >
          <option>Please Choose an Option</option>
          {localities.map((eachLocality) => (
            <option value={eachLocality} key={eachLocality}>
              {eachLocality}
            </option>
          ))}
        </select>
      </div>
      <Table applications={filteredApplications} />
    </div>
  );
};
export default BrPostApi;
