import React, {useState, useEffect} from "react";

import DonateItems from "../components/DonateItems";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const DonationList = () => {
    const { bloodtype } = useParams();
    const [listState, setListState] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/donates/${bloodtype}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (!Array.isArray(data.donates)) {
                    throw new Error('Expected an array');
                }
                console.log(data.donates);
                setListState(data.donates);
            } catch (error) {
                setError(error.message);
            }
        };
        
        fetchData();
    }, [bloodtype]);

    if (error) {
        return <div>Error: {error}</div>;
    }
  return <DonateItems items={listState} />;
};

export default DonationList;
