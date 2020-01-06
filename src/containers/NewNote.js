import React, { useRef, useState } from "react";
import { Form, Spinner, Button} from "react-bootstrap";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import "./NewNote.css";

export default function NewNote(props) {
  const file = useRef(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  
  function validateForm() {
    return content.length > 0;
  }

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
    event.preventDefault();
    setIsLoading(true);
  const tempfiles = Object.values(file.current)
  
  const files = tempfiles.map(async f => {
       
  return await s3Upload(f)
   
})

const attachment = await Promise.all(files);


if (attachment.length === tempfiles.length){
try {
    
    await createNote({ content, attachment});
    props.history.push("/");
  } catch (e) {
    alert(e);
    setIsLoading(false);
  }

  }}
  
  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note
    });
  }

  return (
    <div className="NewNote" style={{paddingTop: '15px'}}>
      <Form className="NewNote" onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            value={content}
            style={
                { 
                height: '300px',
                fontSize: '24px'}

            }
            onChange={e => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" multiple />
        </Form.Group>
        <Button 
          variant="primary" 
          block 
          bssize="large" 
          disabled={!validateForm()} 
          type="submit"
        >
      {isLoading ? <><Spinner animation="border" size="sm"></Spinner> Loading...</> :
    <>Create</>
      }
        </Button>
      </Form>
    </div>
  );
}