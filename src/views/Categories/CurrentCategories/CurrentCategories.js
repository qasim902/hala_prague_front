import React, { Component } from "react";
import dataService from "../../../services/dataService.js";
import categoryService from "../../../services/categoryService.js";
import Sortable from "sortablejs";

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
  Alert,
  FormText
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import "./CurrentCategories.scss";

class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popUpLock: false,
      disabled: true,
      categories: [],
      DataDetails: null,
      DataDetailsClone: null,
      sections: [],
      loaderLock: false,
      mainLoaderLock: false,
      alertLock: false,
      showErrMesgPopUp: false,
      errMessage: null,
      editIconStyOnClick: { color: "" },
      DisplayOnMapcheck: null,
      sortable: null,
      sorting: false
    };
    this.updateCategory = this.updateCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  componentWillMount() {
    let sections = dataService.load("sections");
    this.setState({ sections: sections });
    this.loadCategories();
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

  async updateCategory(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    let editedCategory = this.state.DataDetailsClone;

    try {
      //start spinner
      this.showAndHide(true, "spinner");
      await categoryService.updateCategory(editedCategory, data);
      this.loadCategories();
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
        errMessage: "Failed To Update Category"
      });
      //handle this motha foka
      console.log("error while updaing category", err);
    }
  }

  loadCategories() {
    let categories = dataService.load("categories");
    this.setState({ categories: categories });
  }

  async deleteCategory(event) {
    let categoryId = event.currentTarget.value;
    try {
      //start spinner
      this.showAndHide(true, "MainSpinner");
      await categoryService.deleteCategory(categoryId);
      // stop spinner
      this.showAndHide(false, "MainSpinner");
      //show success alert
      this.showAndHide(true, "deleteAlert");
      this.loadCategories();
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
        errMessage: "Failed To Delete Category"
      });
      console.log("Error while deleting category: ", err);
    }
  }

  handleDataChange(event, name) {
    let newVal = event.target.value;
    let DisplayOnMapVal = event.target.checked;
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

  editIcon = () => {
    this.setState({
      disabled: false,
      editIconStyOnClick: { color: "#00d0b4" }
    });
  };
  togglePopUpFun = e => {
    const { categories } = this.state,
      DetailsData = categories.find(
        ({ objectId }) => objectId === e.target.value
      );

    let DataDetailsClone = { ...DetailsData };

    this.setState({
      popUpLock: !this.state.popUpLock,
      disabled: true,
      DataDetails: DetailsData,
      DataDetailsClone: DataDetailsClone,
      editIconStyOnClick: { color: "" },
      DisplayOnMapcheck: DataDetailsClone.DisplayOnMap
    });
  };

  toggleDanger = () => {
    this.setState({
      showErrMesgPopUp: !this.state.showErrMesgPopUp
    });
  };

  async updateSortOrder() {
    let categories = this.state.categories;
    const sortable = this.sortable.toArray();
    let newCategories = [];
    sortable.forEach((id, index) => {
      let category = categories.find(category => category.objectId === id);
      category.sortOrder = index + 1;
      newCategories.push({
        objectId: category.objectId,
        sortOrder: category.sortOrder
      });
    });

    try {
      //start spinner
      this.showAndHide(true, "MainSpinner");
      await categoryService.updateCategorySortOrder(newCategories);
      this.loadCategories();
      // stop spinner
      this.showAndHide(false, "MainSpinner");
      //show success alert
      this.showAndHide(true, "editAlert");
      //hide success alert
      setTimeout(() => {
        this.showAndHide(false, "editAlert");
      }, 5000);
    } catch (err) {
      //stop the loading spinner
      this.showAndHide(false, "MainSpinner");
      // show error popup message
      this.showAndHide(true, "errorPopUp");
      // save error message in state
      this.setState({
        errMessage: "Failed To Update Sort Order"
      });
      console.log("Error while updating sort order: ", err);
    }
  }

  // disabled upload map icon if switch false
  ChangeSwitchFun = event => {
    let DisplayOnMapVal = event.target.checked;
    this.setState({
      DisplayOnMapcheck: DisplayOnMapVal
    });
  };

  // sortable
  componentDidMount() {
    this.sortable = Sortable.create(document.getElementById("sortable"), {
      animation: 150,
      handle: ".sort-able",
      onEnd: this.onEnd
    });
  }

  render() {
    const {
      disabled,
      categories,
      DataDetails,
      sections,
      DataDetailsClone,
      loaderLock,
      alertLock,
      alertMesLock,
      mainLoaderLock,
      editIconStyOnClick,
      DisplayOnMapcheck,
      errMessage
    } = this.state;

    return (
      <div className="animated fadeIn">
        {alertLock && (
          <div className="alertSty">
            <Alert color="success">
              {alertMesLock
                ? " Your Category Has Been Edited Successfully"
                : " Your Category Has Been Deleted Successfully"}
            </Alert>
          </div>
        )}
        <Row>
          <Col xs="12" lg="12">
            {/* spinner */}
            {mainLoaderLock && (
              <div className="loaderContainerOne">
                <div className="loaderContainerTwoMain">
                  <div className="loader"></div>
                </div>
              </div>
            )}
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
            <Card>
              <CardHeader>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <i className="fa fa-align-justify"></i> Current Categories
                  </div>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.updateSortOrder()}
                  >
                    Update Orders
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Table responsive className="tableContainer">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Section</th>
                      <th>Name</th>
                      <th>Search Keyword</th>
                      <th>DisplayOnMap</th>
                      <th>Details</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody id="sortable">
                    {categories
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map(item => (
                        <tr
                          key={item.objectId}
                          data-id={item.objectId}
                        >
                          <td>
                            <span className="sort-able" style={{ cursor: "move" }}>
                              <i className="fa fa-bars"></i>
                            </span>
                          </td>
                          <td>{item.section.name}</td>
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
                              color="danger"
                              value={item.objectId}
                              onClick={this.deleteCategory}
                              className="mr-1"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    {/* more details popup */}
                    {DataDetails && (
                      <Modal
                        isOpen={this.state.popUpLock}
                        toggle={this.togglePopUpFun}
                        className={"modal-lg " + this.props.className}
                      >
                        <ModalHeader toggle={this.togglePopUpFun}>
                          Category Details
                        </ModalHeader>
                        <ModalBody>
                          {/* spinner */}
                          {loaderLock && (
                            <div className="loaderContainerOne">
                              <div className="loaderContainerTwoCategory">
                                <div className="loader"></div>
                              </div>
                            </div>
                          )}
                          <Col
                            className="edit_Icon_container_sty iconSty"
                            xs="12"
                          >
                            <div className="tooltip">
                              <i
                                onClick={this.editIcon}
                                style={editIconStyOnClick}
                                className="cui-pencil icons font-2xl d-block mt-4 edit_Icon_sty"
                              ></i>
                              <span className="tooltiptext">Edit</span>
                            </div>
                          </Col>

                          <Col xs="12">
                            <Form
                              className="form-horizontal"
                              onSubmit={this.updateCategory}
                            >
                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="select">Sections</Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    disabled={disabled ? "disabled" : ""}
                                    type="select"
                                    name="section"
                                    id="select"
                                    value={DataDetailsClone.section.objectId}
                                    onChange={event => {
                                      this.handleDataChange(event, [
                                        "section",
                                        "objectId"
                                      ]);
                                    }}
                                  >
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
                                    id="text-input"
                                    name="name"
                                    placeholder="Enter Category Name"
                                    disabled={disabled ? "disabled" : ""}
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
                                  <Label htmlFor="select">
                                    Page Display Type
                                  </Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    disabled={disabled ? "disabled" : ""}
                                    type="select"
                                    name="PageDisplayType"
                                    id="select"
                                    value={DataDetailsClone.PageDisplayType}
                                    onChange={event => {
                                      this.handleDataChange(
                                        event,
                                        "PageDisplayType"
                                      );
                                    }}
                                  >
                                    <option>
                                      Please select Page Display Type
                                    </option>
                                    <option value="subcategories">
                                      subcategories
                                    </option>
                                    {/* <option value="transfersCards">
                                      transfers Cards
                                    </option> */}
                                    <option value="cards list">
                                      cards list
                                    </option>
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
                                    id="text-input"
                                    name="labelEn"
                                    placeholder="Enter Label EN"
                                    disabled={disabled ? "disabled" : ""}
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
                                    id="text-input"
                                    name="labelAr"
                                    placeholder="Enter Label AR"
                                    disabled={disabled ? "disabled" : ""}
                                    value={DataDetailsClone.label.ar}
                                    required
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
                                  <Label htmlFor="file-input">Map Icon</Label>
                                </Col>
                                <Col xs="12" md="6">
                                  <Input
                                    type="file"
                                    id="file-input"
                                    name="mapIcon"
                                    disabled={
                                      disabled || !DisplayOnMapcheck
                                        ? "disabled"
                                        : ""
                                    }
                                  />
                                  <FormText color="muted">
                                    image size : aspect ratio 19:9 or 343*160
                                  </FormText>
                                </Col>
                                <Col md="3">
                                  <img
                                    src={
                                      DataDetailsClone.mapIcon
                                        ? DataDetailsClone.mapIcon.url
                                        : null
                                    }
                                    className="map-icon"
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
                                      DataDetailsClone.DisplayOnMap
                                        ? true
                                        : false
                                    }
                                    onChange={event => {
                                      this.handleDataChange(
                                        event,
                                        "DisplayOnMap"
                                      );
                                      this.ChangeSwitchFun(event);
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
                                  <Label htmlFor="select">children Type</Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    disabled="disabled"
                                    type="select"
                                    name="select"
                                    id="select"
                                    value={DataDetailsClone.childrenType}
                                    onChange={event => {
                                      this.handleDataChange(
                                        event,
                                        "childrenType"
                                      );
                                    }}
                                  >
                                    <option>Please select children Type</option>
                                    <option value="subCategories">
                                      subCategories
                                    </option>
                                    <option value="sectionItems">
                                      sectionItems
                                    </option>
                                  </Input>
                                </Col>
                              </FormGroup>

                              <ModalFooter>
                                {!disabled && (
                                  <Button color="primary" type="submit">
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
