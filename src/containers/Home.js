import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { API } from "aws-amplify";
import "./Home.css";

export default function Home(props) {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
        async function onLoad() {
          if (!props.isAuthenticated) {
            return;
          }
      
          try {
            const notes = await loadNotes();
            setNotes(notes);
          } catch (e) {
            alert(e);
          }
      
          setIsLoading(false);
        }
      
        onLoad();
      }, [props.isAuthenticated]);
      
      function loadNotes() {
        return API.get("notes", "/notes");
      }

      function renderNotesList(notes) {
        return [{}].concat(notes).map((note, i) =>
          i !== 0 ? (<ListGroup key={note.noteId + i} variant='flush'>
              <ListGroup.Item action key={note.noteId} href={`/notes/${note.noteId}`} >
                <h5><b>{note.content.trim().split("\n")[0]}</b></h5>
                <p>{"Created: " + new Date(note.createdAt).toLocaleString()}</p>
              </ListGroup.Item>
              </ListGroup>
            
          ) : (
            <ListGroup key={note.noteId + i} variant="flush">
              <ListGroup.Item action key="new" href="/notes/new">
                <h4>
                  <b>{"\uFF0B"}</b> Create a new note
                </h4>
              </ListGroup.Item>
              </ListGroup>
          )
        );
      }
function renderLander() {  
  return (
    <div className="Home">
      <div className="lander">
        <h1>Allocator</h1>
        <p>An operations management platform</p>
      </div>
    </div>
  );
}

function renderNotes() {
    return (
      <div className="notes">
        <h1>Your Notes</h1>
        <ListGroup>
          {!isLoading && renderNotesList(notes)}
        </ListGroup>
      </div>
    );
  }
  return (
    <div className="Home">
      {props.isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}