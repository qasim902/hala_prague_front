import React, { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import adService from "../../../services/adService";

const AddAd = ({ open, onClose, type, onSuccess }) => {
  const [banner, setBanner] = useState(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState(null);

  const onChange = e => {
    setBanner(e.target.files[0]);
  };

  const onSubmit = async event => {
    event.preventDefault();
    setError(null);

    if (!banner || !url) {
      setError("All fields are required");
      return;
    }

    // validate url
    if (!url.match(/^(http|https):\/\//)) {
      setError("Invalid URL");
      return;
    }

    // size validation
    if (banner.size > 2000000) {
      setError("Image size should be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("img", banner);
    formData.append("url", url);
    formData.append("type", type);

    await adService.createAd(formData);
    // Add your code here
    onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={open}>
      <Form onSubmit={onSubmit}>
        <ModalHeader>Add Banner*</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Banner Link</Label>
            <Input
              name="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Enter URL"
            />
          </FormGroup>
          <FormGroup>
            <Label>Banner Image*</Label>
            <Input
              type="file"
              name="banner"
              accept="image/*"
              onChange={onChange}
            />
            <FormText color="muted">
              Max size: 2MB, Supported formats: jpg, jpeg, png
            </FormText>
          </FormGroup>

          {error && <Alert color="danger">{error}</Alert>}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Submit
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddAd;
