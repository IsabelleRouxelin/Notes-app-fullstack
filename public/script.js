document.addEventListener("DOMContentLoaded", () => {
    const notesList = document.getElementById("notes-list");
    const noteForm = document.getElementById("note-form");
    const noteInput = document.getElementById("note-input");
  
    // Function to fetch notes from the backend
    const fetchNotes = async () => {
      try {
        const response = await fetch("/notes");
        const notes= await response.json();
        notesList.innerHTML = ""; // Clear the list before rendering
        notes.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item.id + ": " + JSON.stringify(item);
          notesList.appendChild(li);
        });
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
  
    // Handle form submission to add new notes
    noteForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const newNote = { text: noteInput.value };
  
      try {
        const response = await fetch("/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNote),
        });
  
        if (response.ok) {
          noteInput.value = ""; // Clear input field
          fetchData(); // Refresh the list
        }
      } catch (error) {
        console.error("Error adding note:", error);
      }
    });
  
    // Fetch data on page load
    fetchData();
  });
  // fetch and display notes when page loads
  // display note 
  //note text
  //add new note
  //update note
  //save note
  //delete note
  //update  button
  //delete button
  // append 