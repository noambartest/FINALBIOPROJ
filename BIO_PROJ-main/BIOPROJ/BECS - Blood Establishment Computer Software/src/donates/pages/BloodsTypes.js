import React, { useState, useEffect } from "react";

import TypesList from "../components/TypesList";

const BloodTypes = ({role}) => {
  console.log('BloodTypes');
  const [bloodDonations, setBloodDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/donates");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("type is" + typeof data); // 'object'
      console.log(Array.isArray(data)); // true if data is an array, false if it's an object
      console.log(data.donates);
      const donationCounts = data.donates.reduce((acc, donation) => {
        const { btype } = donation;
        if (acc[btype]) {
          acc[btype] += 1;
        } else {
          acc[btype] = 1;
        }
        return acc;
      }, {});

      const formattedDonationCounts = Object.entries(donationCounts).map(
        ([btype, count]) => ({
          btype,
          count,
        })
      );

      formattedDonationCounts.forEach(({ btype, count }) => {
        console.log(`btype: ${btype}, count: ${count}`);
      });
      console.log(donationCounts);

      setBloodDonations(formattedDonationCounts);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/donates/export/pdf",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "donates.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("There was an error exporting the PDF!", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("I am here - 2" + bloodDonations);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
     {role === 'admin' && (
      <button onClick={exportPDF}>Export to PDF</button>
    )}
      
      <TypesList items={bloodDonations} role = {role} />
    </div>
  );
};

export default BloodTypes;
