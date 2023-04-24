import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Button, Col, Row, Container } from 'react-bootstrap';
import { AutoForm, TextField } from 'uniforms-bootstrap5';
import { Search } from 'react-bootstrap-icons';
import { Navigate } from 'react-router-dom';
// Let's try it again with uniforms instead
const bridge = new SimpleSchema2Bridge(new SimpleSchema({ term: { type: String, optional: true, defaultValue: '' } }));

const SearchBar = () => {
  const [formTerm, setFormTerm] = useState({ term: '' });
  const [redirect, setRedirect] = useState(false);
  const handleSearchMenu = (e) => setRedirect(e.term === formTerm.term);

  return redirect ? (<Navigate to={`/search/'${formTerm.term}'`} />) : (
    <Container fluid className="p-1 m-0 g-0">
      <AutoForm
        className="p-0 m-0 g-0 gap-0"
        schema={bridge}
        model={formTerm}
        onSubmit={(e) => handleSearchMenu(e)}
      >
        <Row className="grid g-0 p-0 m-0 align-items-center">
          <Col xs>
            <TextField
              name="term"
              type="search"
              label={null}
              placeholder="Search.."
              className="h-auto w-auto mb-auto"
              inputClassName="rounded-0 rounded-start"
              value={formTerm.term}
              onChange={(val) => setFormTerm({ term: val })}
            />
          </Col>
          <Col xs={1} className="w-auto">
            <Button
              className="rounded-0 rounded-end"
              href={`/search/'${formTerm.term}'`}
            >
              <Search />
            </Button>
          </Col>
        </Row>
      </AutoForm>
    </Container>
  );
};

export default SearchBar;
