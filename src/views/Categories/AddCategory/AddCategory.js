import React, { Component } from "react";
import categoryService from "../../../services/categoryService.js";
import dataService from "../../../services/dataService.js";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Alert,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormText
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import "./AddCategory.scss";

class Breadcrumbs extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      sections: [],
      loaderLock: false,
      alertLock: false,
      showErrMesgPopUp: false,
      errMessage: null,
      DisplayOnMapcheck: true
    };

    this.createCategory = this.createCategory.bind(this);
  }

  componentWillMount() {
    let sections = dataService.load("sections");
    this.setState({ sections: sections });
  }

  showAndHide = (lock, key) => {
    if (key === "spinner") {
      this.setState({ loaderLock: lock });
    } else if (key === "alert") {
      this.setState({ alertLock: lock });
    } else if (key === "errorPopUp") {
      this.setState({ showErrMesgPopUp: lock });
    }
  };

  async createCategory(event) {
    event.preventDefault();

    const data = new FormData(event.target);

    try {
      //start spinner
      this.showAndHide(true, "spinner");
      await categoryService.createCategory(data);
      // stop spinner
      this.showAndHide(false, "spinner");
      //show success alert
      this.showAndHide(true, "alert");
      //hide success alert
      setTimeout(() => {
        this.showAndHide(false, "alert");
      }, 5000);
    } catch (err) {
      //stop the loading spinner
      this.showAndHide(false, "spinner");
      // show error popup message
      this.showAndHide(true, "errorPopUp");
      // save error message in state
      this.setState({
        errMessage: "Failed To Create Category"
      });
      //popup error msg
      console.log("Error while loggining in as Admin: ", err);
    }
  }

  toggleDanger = () => {
    this.setState({
      showErrMesgPopUp: !this.state.showErrMesgPopUp
    });
  };

  // disabled upload map icon if switch false
  ChangeSwitchFun = (event)=>{
    let DisplayOnMapVal = event.target.checked
    this.setState({
      DisplayOnMapcheck: DisplayOnMapVal
    })
  }

  render() {
    const {
      sections,
      loaderLock,
      alertLock,
      showErrMesgPopUp,
      errMessage,
      DisplayOnMapcheck
    } = this.state;
    return (
      <div className="animated fadeIn">
        {alertLock && (
          <div className="alertSty">
            <Alert color="success">
              Your Category Has Been Added Successfully
            </Alert>
          </div>
        )}
        <Row>
          <Col xs="12">
            {/* spinner */}
            {loaderLock && (
              <div className="loaderContainerOne">
                <div className="loaderContainerTwo">
                  <div className="loader"></div>
                </div>
              </div>
            )}
            {/* error popup message */}
            <Modal
              isOpen={showErrMesgPopUp}
              toggle={this.toggleDanger}
              className={"modal-danger " + this.props.className}
            >
              <ModalHeader toggle={this.toggleDanger}>
                Error Message
              </ModalHeader>
              <ModalBody>{errMessage}</ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.toggleDanger}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
            <Card>
              <CardHeader>
                <strong>Add Category</strong> 
              </CardHeader>
              <CardBody>
                <Form
                  className="form-horizontal"
                  onSubmit={this.createCategory}
                >
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="select">Sections</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="section">
                        {sections.map(section => (
                          <option value={section.objectId}>
                            {section.name}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        name="name"
                        placeholder="Enter Category Name"
                        required
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="select">Page Display Type</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="PageDisplayType" required>
                        <option value="subcategories">subcategories</option>
                        {/* <option value="transfersCards">transfers Cards</option> */}
                        <option value="cards list">cards list</option>
                      </Input>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Label EN</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        name="labelEn"
                        placeholder="Enter Label EN"
                        required
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Label AR</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        name="labelAr"
                        placeholder="Enter Label AR"
                        required
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input">Map Icon</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input 
                      type="file" 
                      name="mapIcon"
                      disabled={!DisplayOnMapcheck ? "disabled" : ""}  
                      />
                      <FormText color="muted">
                        image size : aspect ratio 19:9 or 343*160
                      </FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input">Display On Map</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Label className="switchDataSty" htmlFor="file-input">
                        False
                      </Label>
                      &nbsp; &nbsp;
                      <AppSwitch
                        className={"mx-1"}
                        variant={"3d"}
                        color={"primary"}
                        checked
                        name="DisplayOnMap"
                        onChange={event => {
                          this.ChangeSwitchFun(event);
                        }}
                      />
                      &nbsp; &nbsp;
                      <Label className="switchDataSty" htmlFor="file-input">
                        True
                      </Label>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="select">children Type</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="childrenType">
                        <option value="subCategories">subCategories</option>
                        <option value="sectionItems">sectionItems</option>
                      </Input>
                    </Col>
                  </FormGroup>

                  <CardFooter>
                    <Button type="submit" size="sm" color="primary">
                      <i className="fa fa-dot-circle-o"></i> Create
                    </Button>
                    {/* <Button type="reset" size="sm" color="danger">
                      <i className="fa fa-ban"></i> Clear Fields
                    </Button> */}
                  </CardFooter>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Breadcrumbs;
