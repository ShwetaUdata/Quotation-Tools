import { useState, useEffect } from "react";
import "./CSS/Quotation.css";

function Quotation() {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await fetch(
          "https://nl9muyiiug.execute-api.ap-south-2.amazonaws.com/quotation/quotation"
        );
        const data = await res.json();

        // Make sure it's always an array
        setQuotes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching quotes:", err);
      }
    };
    fetchQuotes();
  }, []);

  return (
    <div>
      <h2>Saved Quotations</h2>
      <ul>
        {quotes.map((q) => (
          <li key={q.id}>{q.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Quotation;
