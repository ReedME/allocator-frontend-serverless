import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { Form, Button, Spinner } from 'react-bootstrap';
import config from "../config";
import "./Notes.css";

export default function Notes(props) {
    const file = useRef(null);
    const [note, setNote] = useState(null);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote() {
      return API.get("notes", `/notes/${props.match.params.id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
        const tempattachments = attachment.map(async a => {
          console.log(a)
          return await Storage.vault.get(a);
           
        })
        console.log(tempattachments)
        note.attachmentURL = await Promise.all(tempattachments)
        console.log(note)
        }
    
        setContent(content);
        setNote(note);
      } catch (e) {
        alert(e);
      }
    }

    onLoad();
  }, [props.match.params.id]);

  function handleFileChange(event) {
    
    
    const tempfiles = Object.values(event.target.files)
    tempfiles.forEach((f,i) => {
    if (f && f.size > config.MAX_ATTACHMENT_SIZE) {
        alert(
          `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
            1000000} MB.`
        );
    event.target.value=null;    
  } else {
    file.current = event.target.files;
  }
})}

async function handleSubmit(event) {
    let attachment;
  
    event.preventDefault();
    setIsLoading(true);
}

  function validateForm() {
    return content.length > 0;
  }
  
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  async function handleDelete(event) {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
  
    if (!confirmed) {
      return;
    }
  
    setIsDeleting(true);
  }
  
  var attachmentSection;
  if(note && note.attachmentURL){
      console.log(note)
      attachmentSection = note.attachmentURL.map(function(aurl,i){
        console.log(aurl);
    return <div key={i+"divider"}>
    <Form.Group key={i}>
       <Form.Label key={i + "label"}>Attachment #{i+1}</Form.Label>
       <br />
        <a
           target="_blank"
           rel="noopener noreferrer"
           href={aurl}
         >
           {formatFilename(note.attachment[i])}
         </a>
       
     </Form.Group>
     </div>
   })
  } else {
      attachmentSection = null;
  }

  return (
    <div className="Notes">
    {note && (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            value={content}
            componentclass="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </Form.Group>
        {attachmentSection}
        <Form.Group controlId="file">
          {!note.attachment && <Form.Label>Attachment</Form.Label>}
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <Button 
          variant="primary" 
          block 
          bssize="large" 
          disabled={!validateForm()} 
          type="submit"
        >
      {isLoading ? <><Spinner animation="border" size="sm"></Spinner> Loading...</> :
    <>Save</>
      }
        </Button>
        
        <Button 
          variant="danger" 
          block 
          bssize="large" 
          disabled={!validateForm()}
          onClick={handleDelete} 
          
        >
      {isDeleting ? <><Spinner animation="border" size="sm"></Spinner> Loading...</> :
    <>Delete</>
      }
        </Button>
        
      </Form>
    )}
  </div>
  );
}