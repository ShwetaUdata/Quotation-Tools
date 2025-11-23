"use client"

import { useState, useEffect } from "react"
import "./CSS/Hardware.css"

const complexityMapping = {
  verylow: { hours: 5, rate: 50 },
  low: { hours: 10, rate: 60 },
  medium: { hours: 20, rate: 75 },
  high: { hours: 40, rate: 90 },
  veryhigh: { hours: 80, rate: 110 },
}

const AddonRow = ({ label, defaultHours, defaultRate, disabled, onCostChange }) => {
  const [checked, setChecked] = useState(false)
  const [hours, setHours] = useState(defaultHours)
  const [rate, setRate] = useState(defaultRate)
  const [complexity, setComplexity] = useState("");
  const cost = checked && !disabled ? hours * rate : 0

  useEffect(() => {
    onCostChange(cost)
  }, [cost, onCostChange])

  const handleComplexityChange = (selectedComplexity) => {
    setComplexity(selectedComplexity)
    if (selectedComplexity && complexityMapping[selectedComplexity]) {
      setHours(complexityMapping[selectedComplexity].hours)
      setRate(complexityMapping[selectedComplexity].rate)
    }
  }

  return (
    <div className="addon-row">
      <input
        type="checkbox"
        checked={checked && !disabled}
        onChange={() => !disabled && setChecked(!checked)}
        disabled={disabled}
      />
      <label>{label}</label>
      <select
        value={complexity}
        onChange={(e) => handleComplexityChange(e.target.value)}
        disabled={disabled || !checked}
        style={{ padding: "4px" }}
      >
        <option value="">Complexity</option>
        <option value="verylow">Very Low</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="veryhigh">Very High</option>
      </select>
      <input
        type="number"
        value={hours}
        onChange={(e) => setHours(Number(e.target.value))}
        disabled={disabled || !checked}
      />
      <input
        type="number"
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
        disabled={disabled || !checked}
      />
      <span className="cost-cell">${cost.toFixed(2)}</span>
    </div>
  )
}

const Section = ({title,addons,onSectionCostChange,onSectionDataChange,defaultChecked}) => {
  const [checked, setChecked] = useState(false)
  const [complexity, setComplexity] = useState("")
  const [hours, setHours] = useState(0)
  const [rate, setRate] = useState(0)
  const [customAddons, setCustomAddons] = useState([])
  const [addonCosts, setAddonCosts] = useState({})
  const baseCost = checked ? hours * rate : 0
  const totalAddonCost = Object.values(addonCosts).reduce((sum, cost) => sum + cost, 0)
  const totalSectionCost = baseCost + totalAddonCost

  useEffect(() => {
    onSectionCostChange(totalSectionCost)

    if (checked) {
      onSectionDataChange({
        title,
        complexity,
        hours,
        rate,
        addons: addons.map((addon, i) => ({
          label: addon.label,
          checked: !!addonCosts[i],
          hours: addon.defaultHours,
          rate: addon.defaultRate,
        })),
        customAddons: customAddons
          .filter(a => a.checked)
          .map(a => ({
            id: a.id,
            name: a.name,
            hours: a.hours,
            rate: a.rate,
            complexity: a.complexity,
            cost: a.hours * a.rate, // 👈 include cost
  })),

      });
    } else {
      onSectionDataChange(null);
    }
  }, [totalSectionCost, checked, complexity, hours, rate, addonCosts, customAddons]);
  
  const handleAddonCostChange = (index, cost) => {
    setAddonCosts((prev) => ({ ...prev, [index]: cost }))
  }
  const addCustomAddon = () => {
  if (!checked) return;
  setCustomAddons([
    ...customAddons,
    {
      id: Date.now(),
      name: "",
      hours: 10,
      rate: 75,
      checked: false,
      complexity: "",
      editing: true,
    },
  ]);
};

  const updateCustomAddon = (id, field, value) => {
    setCustomAddons((addons) => {
      return addons.map((addon) => {
        if (addon.id === id) {
          if (field === "complexity" && value && complexityMapping[value.toLowerCase().replace(" ", "")]) {
            const mapping = complexityMapping[value.toLowerCase().replace(" ", "")]
            return {
              ...addon,
              [field]: value,
              hours: mapping.hours,
              rate: mapping.rate,
            }
          }
          return { ...addon, [field]: value }
        }
        return addon
      })
    })
  }

  const toggleEditCustomAddon = (id) => {
    setCustomAddons((addons) =>
      addons.map((addon) => (addon.id === id ? { ...addon, editing: !addon.editing } : addon)),
    )
  }

  const deleteCustomAddon = (id) => {
    setCustomAddons((addons) => addons.filter((addon) => addon.id !== id))
  }

  const handleComplexityChange = (selectedComplexity) => {
    setComplexity(selectedComplexity)
    if (selectedComplexity && complexityMapping[selectedComplexity]) {
      setHours(complexityMapping[selectedComplexity].hours)
      setRate(complexityMapping[selectedComplexity].rate)
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
        <span className="section-title">{title}</span>

      <select
          value={complexity}
          onChange={(e) => handleComplexityChange(e.target.value)}
          disabled={!checked}
        >
          <option value="">Select Complexity...</option>
          <option value="verylow">Very Low</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="veryhigh">Very High</option>
        </select>
        <div className="input-group">
          <label className="input-label">Hours</label>
           <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            disabled={!checked}
            className="input-one"
          />
        </div>
        <div className="input-group">
          <label className="input-rate">Rate</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            disabled={!checked}
            className="input-two"
          />
        </div>
        <div className="input-group">
          <label className="input-cost">Cost</label>
          <span className="cost-display">${baseCost.toFixed(2)}</span>
        </div>
      </div>

      <div className="addon-list">
        {addons.map((addon, index) => (
          <AddonRow
            key={index}
            label={addon.label}
            defaultHours={addon.defaultHours}
            defaultRate={addon.defaultRate}
            disabled={!checked}
            onCostChange={(cost) => handleAddonCostChange(index, cost)}
          />
        ))}

        {checked &&
          customAddons.map((addon) => {
            const cost = addon.checked ? addon.hours * addon.rate : 0;
            return (
              <div key={addon.id} className="addon-row">
                <input
                  type="checkbox"
                  checked={addon.checked}
                  onChange={() => updateCustomAddon(addon.id, "checked", !addon.checked)}
                />

                    <input
                      type="text"
                      value={addon.name}
                      onChange={(e) => updateCustomAddon(addon.id, "name", e.target.value)}
                      placeholder="Custom Add-on Name"
                      disabled={!addon.checked || !addon.editing}
                      style={{ padding: "5px" }}
                    />
                    <select
                      value={addon.complexity}
                      onChange={(e) => updateCustomAddon(addon.id, "complexity", e.target.value)}
                      disabled={!addon.checked || !addon.editing}
                      style={{ padding: "5px" }}
                    >
                      <option value="">Complexity</option>
                      <option value="Very Low">Very Low</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Very High">Very High</option>
                    </select>
                    <input
                      type="number"
                      value={addon.hours}
                      onChange={(e) =>
                        updateCustomAddon(addon.id, "hours", Number(e.target.value))
                      }
                      disabled={!addon.checked || !addon.editing}
                    />
                    <input
                      type="number"
                      value={addon.rate}
                      onChange={(e) =>
                        updateCustomAddon(addon.id, "rate", Number(e.target.value))
                      }
                      disabled={!addon.checked || !addon.editing}
                    />

                <span className="cost-cell">${cost.toFixed(2)}</span>

                {addon.checked && (
                  <div style={{ display: "flex", gap: "5px", marginLeft: "10px" }}>
                    <button
                      onClick={() => toggleEditCustomAddon(addon.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: addon.editing ? "#28a745" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      {addon.editing ? "Save" : "Edit"}
                    </button>
                    <button
                      onClick={() => deleteCustomAddon(addon.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#ff4444",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )
          })}

        {checked && (
          <div className="custom-addon" onClick={addCustomAddon}>
            + Add Custom Add-on
          </div>
        )}
      </div>
    </div>
  )
}

const Prototype = ({ onCostChange , onDataChange}) => {
  const [sectionCosts, setSectionCosts] = useState({})
  const [sectionsData, setSectionsData] = useState({});
  const totalCost = Object.values(sectionCosts).reduce((sum, cost) => sum + cost, 0)

  useEffect(() => {
  onCostChange(totalCost);
  onDataChange(Object.values(sectionsData)); // ✅ FIXED
}, [totalCost, sectionsData, onCostChange, onDataChange]);

  const handleSectionCostChange = (sectionIndex, cost) => {
    setSectionCosts((prev) => ({ ...prev, [sectionIndex]: cost }))
  }

  const handleSectionDataChange = (sectionIndex, data) => {
    setSectionsData((prev) => {
      const copy = { ...prev };
      if (data) copy[sectionIndex] = data;
      else delete copy[sectionIndex];
      return copy;
    });
  };

  const addons1 = []
  const addons2 = []
  const addons3 = []

  return (
    <div className="hardware-wrapper">
      <Section
        title="In-House 3D Printing"
        addons={addons1}   
        onSectionCostChange={(cost) => handleSectionCostChange(0, cost)}
        onSectionDataChange={(data) => handleSectionDataChange(0, data)}
      />
      <Section
        title="PCB Fab & Assembly Mgt."
        addons={addons2}
        onSectionCostChange={(cost) => handleSectionCostChange(1, cost)}
        onSectionDataChange={(data) => handleSectionDataChange(1, data)}
      />
      <Section
        title="Tooling & Molding Mgt."
        addons={addons3}
        onSectionCostChange={(cost) => handleSectionCostChange(2, cost)}
        onSectionDataChange={(data) => handleSectionDataChange(2, data)}
      />
    </div>
  )
}

export default Prototype;
