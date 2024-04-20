import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const API_URL = ""; // A Retool API URL-je, nem értettem, hogy kell megcsinálni ezért anélkül tettem

const App: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [votes, setVotes] = useState<any[]>([]);

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await axios.post(API_URL, {
        query: `
          query {
            votes {
              option
              count
            }
          }
        `,
      });
      setVotes(response.data.data.votes);
    } catch (error) {
      console.error("Hiba Fetch közben:", error);
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleVote = async () => {
    try {
      await axios.post(API_URL, {
        query: `
          mutation {
            vote(option: "${selectedOption}") {
              option
              count
            }
          }
        `,
      });
      fetchVotes();
      setSelectedOption("");
    } catch (error) {
      console.error("Hiba szavazás közben:", error);
    }
  };

  const data = {
    labels: votes.map((vote) => vote.option),
    datasets: [
      {
        label: "Szavazatok",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: votes.map((vote) => vote.count),
      },
    ],
  };

  return (
    <div>
      <h1>Szavazz a következő könyvre</h1>
      <div>
        <label>
          <input
            type="radio"
            value="Könyv 1"
            checked={selectedOption === "Könyv1"}
            onChange={handleOptionChange}
          />
          Könyv 1
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="Könyv 2"
            checked={selectedOption === "Könyv2"}
            onChange={handleOptionChange}
          />
          Könyv 2
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="Könyv 3"
            checked={selectedOption === "Könyv3"}
            onChange={handleOptionChange}
          />
          Könyv 3
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="Könyv 4"
            checked={selectedOption === "Könyv4"}
            onChange={handleOptionChange}
          />
          Könyv 4
        </label>
        <br />
        <button onClick={handleVote} disabled={!selectedOption}>
          Szavazás
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Szavazás összegzése</h2>
        <Bar
          data={data}
          options={{
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />
      </div>
    </div>
  );
};

export default App;
