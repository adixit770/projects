import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AnalyticsDashboard() {
  const history = useNavigate();
  const user = localStorage.getItem("user");
  const [dataId, setDataId] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [uniqueVisitors, setUniqueVisitors] = useState(null);
  const [totalVisits, setTotalVisits] = useState(null);

  useEffect(() => {
    // Fetch analytics data on mount
    fetchAnalyticsData();
    const intervalId = setInterval(fetchAnalyticsData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8088/userApi/analytics",
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      if (response.status != 200) {
        history("/");
      }
      setUserCount(response.data.userCount);
      setUniqueVisitors(response.data.uniqueVisitors);
      setTotalVisits(response.data.totalVisits);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      history("/");
    }
  };

  useEffect(() => {
    async function abc() {
      try {
        const response = await axios.get(
          "http://localhost:8088/userApi/generate-data-id",
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        );
        console.log(response);
        setDataId(response.data.userId);
      } catch (error) {
        console.error("Error generating data ID:", error);
      }
    }
    abc();
  }, []);

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      <div>
        <h2>Embed Code Generation</h2>
        {/* <button onClick={generateDataId}>Generate Data ID</button> */}
        {user && (
          <div>
            <h3>Embed Code:</h3>
            <pre>{`<script src="http://localhost:8088/userApi/generate-data-id" defer></script>\n<div id="eg-widget-analytics" data-id="${user}"></div>`}</pre>
          </div>
        )}
      </div>
      <div>
        <h2>Analytics Data</h2>
        <p>Real-time User Count: {userCount}</p>
        <p>Unique Visitors: {uniqueVisitors}</p>
        <p>Total Visits: {totalVisits}</p>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
