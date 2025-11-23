import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import "./CSS/Report.css";

const urls = [
  { label: "Hardware Quotation", url: "https://3b2oaeur0k.execute-api.ap-south-2.amazonaws.com/hardware/projects" },
  { label: "Software Quotation", url: "https://545yko8pl7.execute-api.ap-south-2.amazonaws.com/software/projects" },
  { label: "Mechanical Quotation", url: "https://85ckbkoeq9.execute-api.ap-south-2.amazonaws.com/mechanical/projects" },
  { label: "Prototype Quotation", url: "https://ajb2h2t97d.execute-api.ap-south-2.amazonaws.com/prototype/projects" },
];

function Generated() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const responses = await Promise.all(urls.map((obj) => fetch(obj.url)));
      const jsonData = await Promise.all(responses.map((res) => res.json()));

      const labeledData = urls.map((obj, index) => ({
        label: obj.label,
        data: jsonData[index],
      }));

      setData(labeledData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ PDF Export with same table format
const generatePDF = (sections) => {
  const doc = new jsPDF();

  // ✅ Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Generated Quotes", 105, 15, { align: "center" });

  sections.forEach((section, index) => {
    if (index > 0) doc.addPage();

    // ✅ Section Heading (Hardware / Software / etc.)
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185);
    doc.text(`${section.label}`, 14, 30);

    let currentY = 40;

    // ✅ Same grouping as UI
    const addonsBySection = {};
    section.data?.projects?.forEach((proj) => {
      proj.sections.forEach((sec) => {
        if (Array.isArray(sec.customAddons) && sec.customAddons.length > 0) {
          if (!addonsBySection[sec.title]) addonsBySection[sec.title] = [];
          sec.customAddons.forEach((addon) => {
            addonsBySection[sec.title].push({
              ...addon,
              createdAt: proj.createdAt,
            });
          });
        }
      });
    });

    // ✅ Render grouped tables
    Object.keys(addonsBySection).forEach((secName) => {
      const sectionAddons = addonsBySection[secName];
      let rows = [];
      let totalCost = 0;

      sectionAddons.forEach((addon, i) => {
        rows.push([
          i + 1,
          addon.name || "–",
          addon.complexity || "–",
          addon.hours || 0,
          addon.rate || 0,
          addon.cost || 0,
          addon.createdAt ? new Date(addon.createdAt).toLocaleString() : "–",
        ]);
        totalCost += addon.cost || 0;
      });

      // ✅ Subsection Heading (like "Custom Add-ons for PCB Schematic Design")
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(`Custom Add-ons for ${secName}`, 14, currentY);

      // ✅ Table
      autoTable(doc, {
        head: [["Sr. No.", "Addon Name", "Complexity", "Hours", "Rate", "Cost", "Created At"]],
        body: rows,
        startY: currentY + 6,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
        styles: { font: "helvetica", fontSize: 11 },
        margin: { left: 14, right: 14 },
      });

      currentY = doc.lastAutoTable.finalY + 6;

      // ✅ Total Cost
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Cost: ${totalCost}`, 190, currentY, { align: "right" });

      currentY += 15;
    });
  });

  // ✅ Save PDF
  doc.save("GeneratedQuotes.pdf");
};


  // ✅ UI (unchanged)
  const renderCustomAddonsTables = (projects) => {
    const addonsBySection = {};

    projects.forEach((proj) => {
      proj.sections.forEach((sec) => {
        if (Array.isArray(sec.customAddons) && sec.customAddons.length > 0) {
          if (!addonsBySection[sec.title]) addonsBySection[sec.title] = [];
          sec.customAddons.forEach((addon) => {
            addonsBySection[sec.title].push({
              project: proj.title,
              ...addon,
              createdAt: proj.createdAt,
            });
          });
        }
      });
    });

    return Object.keys(addonsBySection).map((sectionName, sidx) => {
      const sectionAddons = addonsBySection[sectionName];
      const totalCost = sectionAddons.reduce((sum, a) => sum + (a.cost || 0), 0);

      return (
        <div key={sidx} className="addon-block">
          <h5>Custom Add-ons for {sectionName}</h5>
          <table className="report-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Addon Name</th>
                <th>Complexity</th>
                <th>Hours</th>
                <th>Rate</th>
                <th>Cost</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {sectionAddons.map((addon, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{addon.name || "–"}</td>
                  <td>{addon.complexity || "–"}</td>
                  <td>{addon.hours || 0}</td>
                  <td>{addon.rate || 0}</td>
                  <td>{addon.cost || 0}</td>
                  <td>{addon.createdAt ? new Date(addon.createdAt).toLocaleString() : "–"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>
                  Total Cost:
                </td>
                <td colSpan="2" style={{ fontWeight: "bold" }}>
                  {totalCost}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      );
    });
  };

  return (
    <div className="report-container">
      <h2>Generated Quotes</h2>

      {loading && <p>Loading data...</p>}

      {data.map((section, idx) => (
        <div key={idx} className="report-section">
          <h3>{section.label}</h3>
          {section.data && section.data.projects?.length > 0
            ? renderCustomAddonsTables(section.data.projects)
            : <p>No data</p>}
        </div>
      ))}

      <div className="report-buttons">
      <button onClick={() => generatePDF(data)} disabled={loading}>
  {loading ? "Preparing PDF..." : "Download PDF"}
</button>

      </div>
    </div>
  );
}

export default Generated;
