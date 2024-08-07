import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Alert,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import dataService from "../../../services/dataService.js";
import subCategoryService from "../../../services/subCategoryService.js";
import "./AddSubCategory.scss";

class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      loaderLock: false,
      alertLock: false,
      showErrMesgPopUp: false,
      errMessage: null
    };
    this.createSubCategory = this.createSubCategory.bind(this);
  }
  componentWillMount() {
    let categories = dataService.load("categories");
    this.setState({ categories: categories });
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

  async createSubCategory(event) {
    event.preventDefault();

    const data = new FormData(event.target);

    try {
       //start spinner
       this.showAndHide(true, "spinner");
      await subCategoryService.createSubCategory(data);
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
         errMessage: "Failed To Create SubCategory"
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

  render() {
    const { 
      categories,
      loaderLock,
      alertLock,
      showErrMesgPopUp,
      errMessage
     } = this.state;

    return (
      <div className="animated fadeIn">
         {alertLock && (
          <div className="alertSty">
            <Alert color="success">
              Your SubCategory Has Been Added Successfully
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
                {/* <Button color="danger" onClick={this.toggleDanger}>Do Something</Button>{' '} */}
                <Button color="secondary" onClick={this.toggleDanger}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
            <Card>
              <CardHeader>
                <strong>Add Sub Category</strong> 
              </CardHeader>
              <CardBody>
                <Form
                  className="form-horizontal"
                  onSubmit={this.createSubCategory}
                >
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="select">Category</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        //  disabled={disabled ? "disabled" : ""}
                        type="select"
                        name="category"
                        id="select"
                      >
                        {categories.map(categories =>
                          categories.childrenType === "subCategories" ? (
                            <option value={categories.objectId}>
                              {categories.name}
                            </option>
                          ) : null
                        )}
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
                        placeholder="Enter SubCategory Name"
                        required
                      />
                      {/* <FormText color="muted">This is a help text</FormText> */}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Search Keyword</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        name="searchKeyword"
                        placeholder="Enter Search Keyword"
                        required
                      />
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

                  {/* <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Details Page Type</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        name="DetailsPageType"
                        placeholder="Enter Details Page Type"
                        required
                      />
                    </Col>
                  </FormGroup> */}

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input">Display On Map</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Label htmlFor="file-input">False</Label> &nbsp; &nbsp;
                      <AppSwitch
                        className={"mx-1"}
                        variant={"3d"}
                        color={"primary"}
                        checked
                        name="DisplayOnMap"
                      />
                      &nbsp; &nbsp;
                      <Label htmlFor="file-input">True</Label>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input">Upload Image</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" name="img"  required/>
                      <FormText color="muted">
                        image size : aspect ratio 19:9 or 343*160
                      </FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">SubTitle EN</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        name="subtitleEn"
                        placeholder="Enter SubTitle EN"
                        required
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">SubTitle AR</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        name="subtitleAr"
                        placeholder="Enter SubTitle AR"
                        required
                      />
                    </Col>
                  </FormGroup>

                  <CardFooter>
                    <Button type="submit" size="sm" color="primary">
                      <i className="fa fa-dot-circle-o"></i> Submit
                    </Button>
                    {/* <Button type="reset" size="sm" color="danger">
                      <i className="fa fa-ban"></i> Reset
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
