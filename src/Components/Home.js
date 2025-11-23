"use client"

import { useState, useCallback } from "react"
import "./CSS/Home.css"
import Hardware from "./Hardware"
import Software from "./Software"
import Mechanical from "./Mechanical"
import Prototype from "./Prototype"

function Home() {
  const [a, setA] = useState(20)
  const [b, setB] = useState(30)
  const [showHardware, setShowHardware] = useState(false)
  const [showSoftware, setShowSoftware] = useState(false)
  const [showIndustrial, setShowIndustrial] = useState(false)
  const [showPrototype, setShowPrototype] = useState(false)
  const [one, setone] = useState(false)
  const [two, settwo] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [saveResultMessage, setSaveResultMessage] = useState("")
  const [quoteName, setQuoteName] = useState("")

  // State to track costs from each section
  const [hardwareData, setHardwareData] = useState(null)
  const [softwareData, setSoftwareData] = useState(null)
  const [mechanicalData, setMechanicalData] = useState(null)
  const [prototypeData, setPrototypeData] = useState(null)

  const [hardwareCost, setHardwareCost] = useState(0)
  const [softwareCost, setSoftwareCost] = useState(0)
  const [mechanicalCost, setMechanicalCost] = useState(0)
  const [prototypeCost, setPrototypeCost] = useState(0)

  // Calculate totals
  const subTotal = hardwareCost + softwareCost + mechanicalCost + prototypeCost
  const projectMgtCost = (subTotal * a) / 100
  const contingencyCost = (subTotal * b) / 100
  const grandTotal = subTotal + projectMgtCost + contingencyCost

  const handleAChange = (dir) => {
    setA((prev) => (dir === "up" ? prev + 1 : Math.max(prev - 1, 0)))
  }

  const handleBChange = (dir) => {
    setB((prev) => (dir === "up" ? prev + 1 : Math.max(prev - 1, 0)))
  }

  const urls = [
    "https://3b2oaeur0k.execute-api.ap-south-2.amazonaws.com/hardware/projects",
    "https://545yko8pl7.execute-api.ap-south-2.amazonaws.com/software/projects",
    "https://85ckbkoeq9.execute-api.ap-south-2.amazonaws.com/mechanical/projects",
    "https://ajb2h2t97d.execute-api.ap-south-2.amazonaws.com/prototype/projects",
  ]

  const quoteURL = "https://nl9muyiiug.execute-api.ap-south-2.amazonaws.com/quotation/quotation";

  const handleSave = async () => {

     if (!quoteName.trim()) {
    setSaveResultMessage("Quotation name is required.");
    setShowPopup(true);
    return;
  }

    const dataSections = [
      { data: hardwareData, cost: hardwareCost, url: urls[0], sectionName: "Hardware" },
      { data: softwareData, cost: softwareCost, url: urls[1], sectionName: "Software" },
      { data: mechanicalData, cost: mechanicalCost, url: urls[2], sectionName: "Mechanical" },
      { data: prototypeData, cost: prototypeCost, url: urls[3], sectionName: "Prototype" },
    ]

    const sectionsToSend = dataSections.filter(({ data }) => {
      if (!data) return false
      if (Array.isArray(data)) return data.length > 0
      return Object.keys(data).length > 0
    })

    if (sectionsToSend.length === 0) {
      setSaveResultMessage("No data to submit.")
      setShowPopup(true)
      return
    }

    try {
      for (const section of sectionsToSend) {
        const sections = Array.isArray(section.data) ? section.data : Object.values(section.data)

        const payload = {
  sections,
  totalCost: section.cost,
  quoteName, // Add this line
};


        const res = await fetch(section.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        const text = await res.text()
if (!res.ok) {
 setSaveResultMessage(`Server error at ${section.sectionName} endpoint: ${text}`);
  setShowPopup(true);
  return;
}

      }

      setSaveResultMessage("Saved quote successfully to all submitted sections.")
      setShowPopup(true)
    } catch (error) {
      setSaveResultMessage("Failed to save quote. See console for details.")
      setShowPopup(true)
      console.error("Save quote error:", error)
    }
  }

  // Callbacks for costs and data
  const handleHardwareCostChange = useCallback((cost) => setHardwareCost(cost), [])
  const handleSoftwareCostChange = useCallback((cost) => setSoftwareCost(cost), [])
  const handleMechanicalCostChange = useCallback((cost) => setMechanicalCost(cost), [])
  const handlePrototypeCostChange = useCallback((cost) => setPrototypeCost(cost), [])

  const handleHardwareDataChange = useCallback((data) => setHardwareData(data), [])
  const handleSoftwareDataChange = useCallback((data) => setSoftwareData(data), [])
  const handleMechanicalDataChange = useCallback((data) => setMechanicalData(data), [])
  const handlePrototypeDataChange = useCallback((data) => setPrototypeData(data), [])

  return (
    <div className="body">
      <div className="container">
        <h3 className="h2">Project Quoting Tool</h3>
        <div className="content">
          <div className="div subtotal-div">
            <p className="label">Sub-Total</p>
            <h1 className="amount">${subTotal.toFixed(2)}</h1>
          </div>

          <div className="div project-mgt-div">
            <p className="label">
              Project Mgt.
              <button className="button" onMouseEnter={() => setone(true)} onMouseLeave={() => setone(false)}>
                {a}
                {one && (
                  <>
                    <span onClick={() => handleAChange("up")} className="arrow-up">
                      ▲
                    </span>
                    <span onClick={() => handleAChange("down")} className="arrow-down">
                      ▼
                    </span>
                  </>
                )}
              </button>
              <span className="percent">%</span>
            </p>
            <h1 className="amount">${projectMgtCost.toFixed(2)}</h1>
          </div>

          <div className="div contingency-div">
            <p className="label">
              Contingency
              <button className="button" onMouseEnter={() => settwo(true)} onMouseLeave={() => settwo(false)}>
                {b}
                {two && (
                  <>
                    <span onClick={() => handleBChange("up")} className="arrow-up">
                      ▲
                    </span>
                    <span onClick={() => handleBChange("down")} className="arrow-down">
                      ▼
                    </span>
                  </>
                )}
              </button>
              <span className="percent">%</span>
            </p>
            <h1 className="amount">${contingencyCost.toFixed(2)}</h1>
          </div>

          <div className="div grand-total-div">
            <p className="label grand-total-label">Grand Total</p>
            <h1 className="amount grand-total-amount">${grandTotal.toFixed(2)}</h1>
          </div>
        </div>
      </div>

      <div className="hardware">
        <div className="hardware-wrapper" onClick={() => setShowHardware(!showHardware)}>
          <h2>
            Hardware Development
            <span className={`section-arrow ${showHardware ? "open" : ""}`}>⌄</span>
          </h2>
        </div>
        {showHardware && <Hardware onCostChange={handleHardwareCostChange} onDataChange={handleHardwareDataChange} />}

        <div className="hardware-wrapper" onClick={() => setShowSoftware(!showSoftware)}>
          <h2>
            Firmware & Software Development
            <span className={`section-arrow ${showSoftware ? "open" : ""}`}>⌄</span>
          </h2>
        </div>
        {showSoftware && <Software onCostChange={handleSoftwareCostChange} onDataChange={handleSoftwareDataChange} />}

        <div className="hardware-wrapper" onClick={() => setShowIndustrial(!showIndustrial)}>
          <h2>
            Mechanical & Industrial Design
            <span className={`section-arrow ${showIndustrial ? "open" : ""}`}>⌄</span>
          </h2>
        </div>
        {showIndustrial && (
          <Mechanical onCostChange={handleMechanicalCostChange} onDataChange={handleMechanicalDataChange} />
        )}

        <div className="hardware-wrapper" onClick={() => setShowPrototype(!showPrototype)}>
          <h2>
            Prototype & Manufacturing Management
            <span className={`section-arrow ${showPrototype ? "open" : ""}`}>⌄</span>
          </h2>
        </div>
        {showPrototype && (
          <Prototype onCostChange={handlePrototypeCostChange} onDataChange={handlePrototypeDataChange} />
        )}
      </div>

      <div className="hardware">
        <button className="pdf-button" onClick={() => setShowPopup(true)}>
          Submit
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            {saveResultMessage ? (
              <>
                <p>{saveResultMessage}</p>
                <button
                  onClick={() => {
                    setShowPopup(false)
                    setSaveResultMessage("")
                    window.location.href = "/Generated"
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <p>Enter a name for this quotation:</p>
                <input
                  type="text"
                  value={quoteName}
                  onChange={(e) => setQuoteName(e.target.value)}
                  placeholder="Quotation Name"
                  style={{ padding: "5px", marginTop: "10px" }}
                />
                <div style={{ marginTop: "10px" }}>
                  <button
  onClick={async () => {
    try {
      // send the quotation name first
      const res = await fetch(quoteURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: quoteName, createdAt: new Date().toISOString() }),
      });

      if (!res.ok) {
        const text = await res.text();
        setSaveResultMessage(`Server error: ${text}`);
        setShowPopup(true);
        return;
      }

      // then send all section data
      handleSave(quoteName);
    } catch (err) {
      setSaveResultMessage("Failed to save quote name.");
      setShowPopup(true);
      console.error(err);
    }
  }}
  disabled={!quoteName.trim()}
>
  Yes
</button>


                  <button onClick={() => setShowPopup(false)}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home


