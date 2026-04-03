import { useEffect, useState } from "react";

function App() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState("list");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    date: "",
    location: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  /* ================= REGISTER ================= */
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) {
      alert("All fields are required");
      return;
    }

    if (!form.email.includes("@")) {
      alert("Enter a valid email");
      return;
    }

    if (form.phone.length < 10) {
      alert("Enter valid phone number");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          eventId: selectedEvent._id,
          ...form
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      setForm({ name: "", email: "", phone: "" });
      setPage("success");

    } catch (error) {
      alert("Something went wrong");
    }
  };

  /* ================= ADMIN ADD EVENT ================= */
  const handleAddEvent = async () => {
    if (
      !newEvent.name ||
      !newEvent.description ||
      !newEvent.date ||
      !newEvent.location
    ) {
      alert("All fields required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newEvent)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error adding event");
        return;
      }

      setNewEvent({
        name: "",
        description: "",
        date: "",
        location: ""
      });

      setEvents((prev) => [...prev, data]);
      setPage("list");

    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div style={containerStyle}>

      {/* ================= EVENT LIST ================= */}
      {page === "list" && (
        <>
          <h1 style={titleStyle}>Event List</h1>

          <button
            style={addBtn}
            onClick={() => setPage("admin")}
          >
            + Add Event
          </button>

          {events.map((event) => (
            <div key={event._id} style={cardStyle}>
              <h2>{event.name}</h2>

              <p style={descStyle}>
                {event.description.length > 60
                  ? event.description.slice(0, 60) + "..."
                  : event.description}
              </p>

              {/* ✅ DATE FIXED */}
              <p>
                <b>Date:</b>{" "}
                {new Date(event.date)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-")}
              </p>

              <p><b>Location:</b> {event.location}</p>

              <button
                style={primaryBtn}
                onClick={() => {
                  setSelectedEvent(event);
                  setPage("details");
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </>
      )}

      {/* ================= DETAILS ================= */}
      {page === "details" && selectedEvent && (
        <div style={centerContainer}>
          <div style={detailsCard}>
            <h2>{selectedEvent.name}</h2>
            <p style={descStyle}>{selectedEvent.description}</p>

            {/* ✅ DATE FIXED */}
            <p>
              <b>Date:</b>{" "}
              {new Date(selectedEvent.date)
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-")}
            </p>

            <p><b>Location:</b> {selectedEvent.location}</p>

            <div style={{ marginTop: "20px" }}>
              <button style={successBtn} onClick={() => setPage("register")}>
                Register Now
              </button>

              <button style={secondaryInlineBtn} onClick={() => setPage("list")}>
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= REGISTER ================= */}
      {page === "register" && (
        <div style={centerContainer}>
          <div style={formCard}>
            <h2 style={{ marginBottom: "20px" }}>Register</h2>

            <input
              style={inputStyle}
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              style={inputStyle}
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              style={inputStyle}
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <button style={primaryBtn} onClick={handleSubmit}>
              Submit
            </button>

            <button style={secondaryBtn} onClick={() => setPage("details")}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* ================= ADMIN PAGE ================= */}
      {page === "admin" && (
        <div style={centerContainer}>
          <div style={formCard}>
            <h2>Add Event</h2>

            <input
              style={inputStyle}
              placeholder="Event Name"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            />

            <input
              style={inputStyle}
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />

            <input
              style={inputStyle}
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />

            <input
              style={inputStyle}
              placeholder="Location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            />

            <button style={primaryBtn} onClick={handleAddEvent}>
              Add Event
            </button>

            <button style={secondaryBtn} onClick={() => setPage("list")}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* ================= SUCCESS ================= */}
      {page === "success" && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <h2>🎉 Registration Successful!</h2>

          <p style={{ marginTop: "10px", color: "#555" }}>
            📧 A confirmation email has been sent to your email address.
          </p>

          <button style={primaryBtn} onClick={() => setPage("list")}>
            Go Back to Events
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const containerStyle = {
  padding: "20px",
  backgroundColor: "#f3f4f6",
  minHeight: "100vh"
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "30px",
  color: "#1f2937"
};

const addBtn = {
  display: "block",
  margin: "20px auto 30px",
  padding: "12px 24px",
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px"
};

const cardStyle = {
  border: "1px solid #e5e7eb",
  margin: "15px auto",
  padding: "20px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "600px",
  backgroundColor: "white",
  boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
};

const descStyle = {
  color: "#555",
  marginBottom: "10px"
};

const centerContainer = {
  display: "flex",
  justifyContent: "center",
  marginTop: "40px"
};

const detailsCard = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "500px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
};

const formCard = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "400px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
};

const inputStyle = {
  width: "100%",
  padding: "12px 15px",   // equal top-bottom spacing
  height: "45px",         // FIXES alignment issue
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  fontSize: "16px"
};

const primaryBtn = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  marginBottom: "10px"
};

const secondaryBtn = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#6b7280",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "5px"
};

const secondaryInlineBtn = {
  padding: "12px 20px",
  backgroundColor: "#6b7280",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const successBtn = {
  padding: "12px 20px",
  backgroundColor: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginRight: "10px"
};

export default App;