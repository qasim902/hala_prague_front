import React, { Component } from "react";
import dataService from "../../../services/dataService.js";
import subCategoryService from "../../../services/subCategoryService.js";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormText,
  Alert
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import "./CurrentSubCategories.scss";

class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popUpLock: false,
      disabled: true,
      categories: [],
      subCategories: [],
      DataDetails: null,
      test: null,
      DataDetailsClone: null,
      loaderLock: false,
      mainLoaderLock: false,
      alertLock: false,
      showErrMesgPopUp: false,
      errMessage: null,
      editIconStyOnClick: {color: ''}
    };
    this.updateSubCategory = this.updateSubCategory.bind(this);
    this.deleteSubCategory = this.deleteSubCategory.bind(this);
  }

  componentWillMount() {
    let categories = dataService.load("categories");
    this.setState({ categories: categories });
    this.loadSubCategories();
  }

  loadSubCategories() {
    let subCategories = dataService.load("subCategories");
    subCategoryService.getCategories(subCategories);
    this.setState({ subCategories: subCategories });
  }

  async deleteSubCategory(event) {
    let subCategoryId = event.currentTarget.value;
    let subCategories = this.state.subCategories;
    let subCategory = subCategories.find(subCat => {
      return subCat.objectId === subCategoryId;
    });
    try {
      //start spinner
      this.showAndHide(true, "MainSpinner");
      await subCategoryService.deleteSubCategory(subCategory);
      // stop spinner
      this.showAndHide(false, "MainSpinner");
      //show success alert
      this.showAndHide(true, "deleteAlert");
      this.loadSubCategories();
      //hide success alert
      setTimeout(() => {
        this.showAndHide(false, "deleteAlert");
      }, 5000);
    } catch (err) {
      //stop the loading spinner
      this.showAndHide(false, "MainSpinner");
      // show error popup message
      this.showAndHide(true, "errorPopUp");
      // save error message in state
      this.setState({
        errMessage: "Failed To Delete SubCategory"
      });
      console.log("Error while deleting sub category: ", err);
    }
  }

  // toggleLarge() {
  //   this.setState({
  //     popUpLock: !this.state.popUpLock,
  //   });
  // }
  editIcon = () => {
    this.setState({
       disabled: false,
       editIconStyOnClick: {color: '#00d0b4'}
       });
  };

  togglePopUpFun = e => {
    const { subCategories } = this.state,
      DetailsData = subCategories.find(
        ({ objectId }) => objectId === e.target.value
      );
    let DataDetailsClone = { ...DetailsData };

    this.setState({
      popUpLock: !this.state.popUpLock,
      disabled: true,
      DataDetails: DetailsData,
      DataDetailsClone: DataDetailsClone,
      editIconStyOnClick: {color: ''}
    });
    
  };

  handleDataChange(event, name) {
    let newVal = event.target.value;
    let DisplayOnMapVal = event.target.checked
    let nameClone = name;
    if (Array.isArray(name)) name = "nested";

    this.setState(prevState => {
      let DataDetailsClone = Object.assign({}, prevState.DataDetailsClone);

      switch (name) {
        case "nested": {
          DataDetailsClone[nameClone[0]][nameClone[1]] = newVal;
          break;
        }
        case "DisplayOnMap": {
          // newVal = newVal === "" ? true : false;
          newVal = DisplayOnMapVal ? true : false;
          DataDetailsClone[name] = newVal;          
          break;
        }
        default: {
          DataDetailsClone[name] = newVal;
        }
      }
      return { DataDetailsClone };
    });
  }

  showAndHide = (lock, key) => {
    if (key === "spinner") {
      this.setState({ loaderLock: lock });
    } else if (key === "MainSpinner") {
      this.setState({ mainLoaderLock: lock });
    } else if (key === "editAlert") {
      this.setState({
        alertLock: lock,
        alertMesLock: true
      });
    }
    if (key === "deleteAlert") {
      this.setState({
        alertLock: lock,
        alertMesLock: false
      });
    } else if (key === "errorPopUp") {
      this.setState({ showErrMesgPopUp: lock });
    } else if (key === "moreDetailsPopup") {
      this.setState({ popUpLock: lock });
    }
  };

  async updateSubCategory(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    let editedSubCategory = this.state.DataDetailsClone; 
    try {
      //start spinner
      this.showAndHide(true, "spinner");
      await subCategoryService.updateSubCategory(editedSubCategory, data);
      this.loadSubCategories();
      // stop spinner
      this.showAndHide(false, "spinner");
      //show success alert
      this.showAndHide(true, "editAlert");
      //hide more Details Popup
      this.showAndHide(false, "moreDetailsPopup");
      //hide success alert
      setTimeout(() => {
        this.showAndHide(false, "editAlert");
      }, 5000);
    } catch (err) {
      //stop the loading spinner
      this.showAndHide(false, "spinner");
      // show error popup message
      this.showAndHide(true, "errorPopUp");
      // save error message in state
      this.setState({
        errMessage: "Failed To Update SubCategory"
      });
      console.log("Error while updating sub category: ", err);
    }
  }

  toggleDanger = () => {
    this.setState({
      showErrMesgPopUp: !this.state.showErrMesgPopUp
    });
  };

  render() {
    const {
      disabled,
      subCategories,
      DataDetails,
      test,
      DataDetailsClone,
      categories,
      loaderLock,
      alertLock,
      alertMesLock,
      mainLoaderLock,
      editIconStyOnClick,
      errMessage
    } = this.state;
    return (
      <div className="animated fadeIn">
        {alertLock && (
          <div className="alertSty">
            <Alert color="success">
              {alertMesLock
                ? " Your SubCategory Has Been Edited Successfully"
                : " Your SubCategory Has Been Deleted Successfully"}
            </Alert>
          </div>
        )}
        {/* spinner */}
        {mainLoaderLock && (
          <div className="loaderContainerOne">
            <div className="loaderContainerTwoMain">
              <div className="loader"></div>
            </div>
          </div>
        )}
        <Row>
          <Col xs="12" lg="12">
            {/* error message popup */}
            <Modal
              isOpen={this.state.showErrMesgPopUp}
              toggle={this.toggleDanger}
              className={"modal-danger " + this.props.className}
            >
              <ModalHeader toggle={this.toggleDanger}>
                Error Message
              </ModalHeader>
              <ModalBody>
                {/* Edit failure */}
                {errMessage}
                </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.toggleDanger}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
            <div></div>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Current Sub Categories
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Name</th>
                      <th>Search Keyword</th>
                      <th>DisplayOnMap</th>
                      <th>Details</th>
                      <th>View Items</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subCategories.map(item => (
                      <tr key={item.objectId}>
                        {/* <td>{item.section.name}</td> */}
                        <td>{item.category.name}</td>
                        <td>{item.name}</td>
                        <td>
                          {item.searchKeyword
                            ? item.searchKeyword
                            : "---------------"}
                        </td>
                        <td>{item.DisplayOnMap.toString()}</td>
                        <td>
                          <Button
                            color="primary"
                            value={item.objectId}
                            onClick={this.togglePopUpFun}
                            className="mr-1"
                          >
                            More Details
                          </Button>
                        </td>
                        <td>
                          <Button
                            disabled={true}
                            color="success"
                            value={item.objectId}
                            className="mr-1"
                          >
                            Items
                          </Button>
                        </td>
                        <td>
                          <Button
                            color="danger"
                            value={item.objectId}
                            onClick={this.deleteSubCategory}
                            className="mr-1"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {DataDetails && (
                      <Modal
                        isOpen={this.state.popUpLock}
                        toggle={this.togglePopUpFun}
                        className={"modal-lg " + this.props.className}
                      >
                        <ModalHeader toggle={this.togglePopUpFun}>
                          SubCategories Details
                        </ModalHeader>
                        <ModalBody>
                          {/* spinner */}
                          {loaderLock && (
                            <div className="loaderContainerOne">
                              <div className="loaderContainerTwoSubCategory">
                                <div className="loader"></div>
                              </div>
                            </div>
                          )}
                          <Col className="edit_Icon_container_sty" xs="12">
                            <div className="tooltip">
                            <i
                              onClick={this.editIcon}
                              style={editIconStyOnClick}
                              className="cui-pencil icons font-2xl d-block mt-4 edit_Icon_sty"
                            ></i>
                              <span className="tooltiptext">Edit</span>
                            </div>
                          </Col>
                          <Col className="image_constainer" xs="12">
                            <img
                              src={DataDetailsClone.img.url}
                              alt="sub category img"
                            />
                          </Col>
                          <Col xs="12">
                            <Form
                              className="form-horizontal"
                              onSubmit={this.updateSubCategory}
                            >
                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="select">Category</Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    disabled={true}
                                    type="select"
                                    name="select"
                                    // value={DataDetails.section.name}
                                    value={DataDetailsClone.category.objectId}
                                    onChange={event => {
                                      this.handleDataChange(event, [
                                        "section",
                                        "objectId"
                                      ]);
                                    }}
                                  >
                                    {categories.map(categories =>
                                      categories.childrenType ===
                                      "subCategories" ? (
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
                                    name="text-input"
                                    placeholder="Enter Category Name"
                                    disabled={disabled ? "disabled" : ""}
                                    // value={DataDetails.name}
                                    value={DataDetailsClone.name}
                                    required
                                    onChange={event => {
                                      this.handleDataChange(event, "name");
                                    }}
                                  />
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="text-input">
                                    Search Keyword
                                  </Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    type="text"
                                    name="text-input"
                                    placeholder="Enter Search Keyword"
                                    disabled={disabled ? "disabled" : ""}
                                    // value={DataDetails.searchKeyword}
                                    value={DataDetailsClone.searchKeyword}
                                    required
                                    onChange={event => {
                                      this.handleDataChange(
                                        event,
                                        "searchKeyword"
                                      );
                                    }}
                                  />
                                </Col>
                              </FormGroup>

                              {/* <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="text-input">
                                    Details Page Type
                                  </Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    type="text"
                                    name="text-input"
                                    placeholder="Enter Details Page Type"
                                    disabled={disabled ? "disabled" : ""}
                                    // value={DataDetails.DetailsPageType}
                                    value={DataDetailsClone.DetailsPageType}
                                    required
                                    onChange={event => {
                                      this.handleDataChange(
                                        event,
                                        "DetailsPageType"
                                      );
                                    }}
                                  />
                                </Col>
                              </FormGroup> */}
                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="text-input">Label EN</Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    type="text"
                                    name="text-input"
                                    placeholder="Enter Label EN"
                                    disabled={disabled ? "disabled" : ""}
                                    // value={DataDetails.label.en}
                                    value={DataDetailsClone.label.en}
                                    required
                                    onChange={event => {
                                      this.handleDataChange(event, [
                                        "label",
                                        "en"
                                      ]);
                                    }}
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
                                    name="text-input"
                                    placeholder="Enter Label AR"
                                    disabled={disabled ? "disabled" : ""}
                                    required
                                    value={DataDetailsClone.label.ar}
                                    onChange={event => {
                                      this.handleDataChange(event, [
                                        "label",
                                        "ar"
                                      ]);
                                    }}
                                  />
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="text-input">
                                    subTitle EN
                                  </Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    type="text"
                                    name="text-input"
                                    placeholder="Enter Label EN"
                                    disabled={disabled ? "disabled" : ""}
                                    required
                                    value={DataDetailsClone.subTitle.en}
                                    onChange={event => {
                                      this.handleDataChange(event, [
                                        "subTitle",
                                        "en"
                                      ]);
                                    }}
                                  />
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="text-input">
                                    subTitle AR
                                  </Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    type="text"
                                    name="text-input"
                                    placeholder="Enter Label AR"
                                    disabled={disabled ? "disabled" : ""}
                                    required
                                    value={DataDetailsClone.subTitle.ar}
                                    onChange={event => {
                                      this.handleDataChange(event, [
                                        "subTitle",
                                        "ar"
                                      ]);
                                    }}
                                  />
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="file-input">
                                    Display On Map
                                  </Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Label
                                    className="switchDataSty"
                                    htmlFor="file-input"
                                  >
                                    False
                                  </Label>
                                  &nbsp; &nbsp;
                                  <AppSwitch
                                    disabled={disabled ? true : false}
                                    className={"mx-1"}
                                    variant={"3d"}
                                    color={"primary"}
                                    checked={
                                      DataDetails.DisplayOnMap ? true : false
                                    }
                                    onChange={event => {
                                      this.handleDataChange(
                                        event,
                                        "DisplayOnMap"
                                      );
                                    }}
                                  />
                                  &nbsp; &nbsp;
                                  <Label
                                    className="switchDataSty"
                                    htmlFor="file-input"
                                  >
                                    True
                                  </Label>
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="file-input">
                                    Upload Image
                                  </Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    type="file"
                                    name="img"
                                    disabled={disabled ? "disabled" : ""}
                                  />
                                  <FormText color="muted">
                                    image size : aspect ratio 19:9 or 343*160
                                  </FormText>
                                </Col>
                              </FormGroup>

                              <ModalFooter>
                                {!disabled && (
                                  <Button
                                    type="submit"
                                    color="primary"
                                    // onClick={this.togglePopUpFun}
                                  >
                                    Save
                                  </Button>
                                )}
                                <Button
                                  color="secondary"
                                  onClick={this.togglePopUpFun}
                                >
                                  Cancel
                                </Button>
                              </ModalFooter>
                            </Form>
                          </Col>
                        </ModalBody>
                      </Modal>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Breadcrumbs;
