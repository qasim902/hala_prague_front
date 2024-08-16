import React, { Component } from "react";
import Sortable from "sortablejs";
import dataService from "../../../services/dataService.js";
import itemService from "../../../services/itemService.js";

import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table
} from "reactstrap";
import "./CurrentSectionItems.scss";

import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import SectionCarousels from "../SectionCarousels/Carousels.js";

class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popUpLock: false,
      disabled: true,
      sectionItems: [],
      DataDetails: null,
      showPopUpCategoryAndSubcategory: false,
      selectedCategoryArr: [],
      selectedSubCategoryArr: [],
      popUpVal: null,
      categoryVal: null,
      subCategoryVal: null,
      RichDescriptionValEN: null,
      RichDescriptionValAR: null,
      editIconStyOnClick: { color: "" },
      errMessage: null,
      loaderLock: false,
      showErrMesgPopUp: false,
      alertLock: false,
      mainLoaderLock: false,
      loaderLock: false,
      contentEN: null,
      contentAR: null,
      ShowErrorHintLatitude: false,
      ShowErrorHintLongitude: false,
      images: [],
      totalImages: 1,
      deleteImagesId: []
    };
    this.deleteItem = this.deleteItem.bind(this);
  }

  componentWillMount() {
    this.setState({ totalImages: 1 });
    this.loadSectionItems();
  }

  loadSectionItems() {
    let sectionItems = dataService.load("sectionItems");
    itemService.loadParents(sectionItems);
    this.setState({ sectionItems: sectionItems });
  }
  // scroll to page top  when load
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  editIcon = () => {
    this.setState({
      disabled: false,
      editIconStyOnClick: { color: "#00d0b4" }
    });
  };

  // more details pop up
  togglePopUpFun = e => {
    const { sectionItems } = this.state,
      DetailsData = sectionItems.find(
        ({ objectId }) => objectId === e.target.value
      );

    this.setState({
      popUpLock: !this.state.popUpLock,
      disabled: true,
      DataDetails: DetailsData,
      editIconStyOnClick: { color: "" }
    });
  };
  // hide and show  Category And Subcategory pop up
  togglePopUpCategoryAndSubcategory = e => {
    this.setState({
      showPopUpCategoryAndSubcategory: !this.state
        .showPopUpCategoryAndSubcategory
    });
    // save the  Category And Subcategory buttom value in sate
    if (e.target.value) {
      this.setState({
        popUpVal: e.target.value
      });
    }
  };
  // save the category and sub category value drop down menu in state
  popUpDropDownVal = e => {
    const { categoryVal, popUpVal } = this.state;
    if (popUpVal === "Category") {
      this.setState({
        categoryVal: e.currentTarget.value
      });
    } else if (popUpVal === "SubCategory") {
      this.setState({
        subCategoryVal: e.currentTarget.value
      });
    }
  };
  // print the result of category and sub category popup
  showResult = () => {
    const {
      categoryVal,
      selectedCategoryArr,
      popUpVal,
      selectedSubCategoryArr,
      subCategoryVal
    } = this.state;
    if (popUpVal === "Category") {
      let checkCategoryArr = selectedCategoryArr.includes(categoryVal);
      if (!checkCategoryArr) {
        if (categoryVal !== null) {
          var selectedCategory = selectedCategoryArr.concat(categoryVal);
          this.setState({
            selectedCategoryArr: selectedCategory,
            categoryVal: null
          });
        }
      }
    } else if (popUpVal === "SubCategory") {
      let checkSubCategoryArr = selectedSubCategoryArr.includes(subCategoryVal);
      if (!checkSubCategoryArr) {
        if (subCategoryVal !== null) {
          let selectedSubCategory = selectedSubCategoryArr.concat(
            subCategoryVal
          );
          this.setState({
            selectedSubCategoryArr: selectedSubCategory,
            subCategoryVal: null
          });
        }
      }
    }
    this.setState({
      showPopUpCategoryAndSubcategory: !this.state
        .showPopUpCategoryAndSubcategory
    });
  };

  deleteCategoryFun = e => {
    const {
      categoryVal,
      selectedCategoryArr,
      popUpVal,
      selectedSubCategoryArr
    } = this.state;
    //  delete cataegory
    let filteredCategoryArr = selectedCategoryArr.filter(filterRes => {
      return filterRes === e.currentTarget.value;
    });

    let checkCategoryArr = selectedCategoryArr.includes(filteredCategoryArr[0]);
    if (checkCategoryArr) {
      let selectedCategoryArray = [...selectedCategoryArr]; // make a separate copy of the array
      let CategoryArrayIndex = selectedCategoryArray.indexOf(
        filteredCategoryArr[0]
      );
      if (CategoryArrayIndex !== -1) {
        selectedCategoryArray.splice(CategoryArrayIndex, 1);
        this.setState({ selectedCategoryArr: selectedCategoryArray });
      }
    }

    //  delete sub cataegory
    let filtered = selectedSubCategoryArr.filter(filterResult => {
      return filterResult === e.currentTarget.value;
    });
    let checkSubCategoryArr = selectedSubCategoryArr.includes(filtered[0]);
    if (checkSubCategoryArr) {
      let selectedSubCategoryArray = [...selectedSubCategoryArr]; // make a separate copy of the array
      let index = selectedSubCategoryArray.indexOf(filtered[0]);
      if (index !== -1) {
        selectedSubCategoryArray.splice(index, 1);
        this.setState({ selectedSubCategoryArr: selectedSubCategoryArray });
      }
    }
  };
  // text area editor fun for EN
  RichDescriptionEGChangeFun = content => {
    this.setState({
      RichDescriptionValEN:
        `<html lang='en'>
      <head>
          <link href='https://fonts.googleapis.com/css?family=Inder&display=swap&subset=latin-ext' rel='stylesheet'>

      </head>
      <body style="font-family: 'Inder' !important;">
            ` +
        content +
        `
      </body>
      </html>`,
      contentEN: content
    });
  };
  // text area editor fun for AR
  RichDescriptionARChangeFun = content => {
    this.setState({
      RichDescriptionValAR:
        `<html lang='en'>
      <head>
          <link href='https://fonts.googleapis.com/css?family=Inder&display=swap&subset=latin-ext' rel='stylesheet'>

      </head>
      <body style='direction: rtl;font-family: 'Inder' !important;'>
            ` +
        content +
        `
      </body>
      </html>`,
      contentAR: content
    });
  };

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

  updateSectionItem = async event => {
    event.preventDefault();

    const data = new FormData(event.target);
    let editedCategory = this.state.DataDetails;

    const {
      RichDescriptionValEN,
      RichDescriptionValAR,
      contentEN,
      contentAR
    } = this.state;
    // this conditions for validations
    if (
      data.get("lat") <= 90 &&
      data.get("lat") >= -90 &&
      data.get("long") <= 90 &&
      data.get("long") >= -90 &&
      data.get("lat") !== "" &&
      data.get("long") !== "" &&
      contentEN !== "<p><br></p>" &&
      contentEN !== null &&
      contentAR !== "<p><br></p>" &&
      contentAR !== null
    ) {
      this.setState({
        ShowErrorHintLatitude: false,
        ShowErrorHintLongitude: false,
        ShowErrorHintForRichDescriptionEN: false,
        ShowErrorHintForRichDescriptionAR: false
      });

      let RichDescription = {
        en: RichDescriptionValEN,
        ar: RichDescriptionValAR
      };

      try {
        //start spinner
        this.showAndHide(true, "spinner");

        if (this.state.deleteImagesId.length > 0) {
          await itemService.deleteSectionItemImages({
            sectionId: editedCategory.objectId,
            imagesIds: this.state.deleteImagesId
          });
        }

        await itemService.updateSectionItem(
          editedCategory,
          data,
          RichDescription
        );
        this.loadSectionItems();

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
          errMessage: "Failed To Update Section Item"
        });
        //handle this motha foka
        console.log("error while updaing category", err);
      }
    } else {
      if (
        (data.get("lat") > 90 && data.get("lat") > -90) ||
        (data.get("lat") < 90 && data.get("lat") < -90) ||
        data.get("lat") === ""
      ) {
        this.setState({
          ShowErrorHintLatitude: true
        });
      } else {
        this.setState({
          ShowErrorHintLatitude: false
        });
      }

      if (
        (data.get("long") > 90 && data.get("long") > -90) ||
        (data.get("long") < 90 && data.get("long") < -90) ||
        data.get("long") === ""
      ) {
        this.setState({
          ShowErrorHintLongitude: true
        });
      } else {
        this.setState({
          ShowErrorHintLongitude: false
        });
      }

      // this conditions for validations
      if (contentEN === "<p><br></p>" || contentEN === null) {
        this.setState({
          ShowErrorHintForRichDescriptionEN: true
        });
      } else {
        this.setState({
          ShowErrorHintForRichDescriptionEN: false
        });
      }

      if (contentAR === "<p><br></p>" || contentAR === null) {
        this.setState({
          ShowErrorHintForRichDescriptionAR: true
        });
      } else {
        this.setState({
          ShowErrorHintForRichDescriptionAR: false
        });
      }
    }
  };

  async updateSortOrder() {
    let sectionItems = this.state.sectionItems;
    const sortable = this.sortable.toArray();
    let newSectionItems = [];
    sortable.forEach((id, index) => {
      let category = sectionItems.find(category => category.objectId === id);
      category.sortOrder = index + 1;
      newSectionItems.push({
        objectId: category.objectId,
        sortOrder: category.sortOrder
      });
    });

    try {
      //start spinner
      this.showAndHide(true, "MainSpinner");
      await itemService.updateSectionItemOrder(newSectionItems);
      this.loadSectionItems();
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

  async deleteItem(event) {
    let itemId = event.target.value;
    try {
      //start spinner
      this.showAndHide(true, "MainSpinner");
      await itemService.deleteItem(itemId);
      // stop spinner
      this.showAndHide(false, "MainSpinner");
      //show success alert
      this.showAndHide(true, "deleteAlert");
      this.loadSectionItems();
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
        errMessage: "Failed To Delete Section Item"
      });
      console.log("Error while deleting section item: ", err);
    }
  }

  handleDataChange(event, name) {
    let newVal = event.target.value;
    let nameClone = name;
    if (Array.isArray(name)) name = "nested";

    this.setState(prevState => {
      let DataDetails = Object.assign({}, prevState.DataDetails);

      switch (name) {
        case "nested": {
          DataDetails[nameClone[0]][nameClone[1]] = newVal;
          break;
        }
        default: {
          DataDetails[name] = newVal;
        }
      }
      return { DataDetails };
    });
  }

  toggleDanger = () => {
    this.setState({
      showErrMesgPopUp: !this.state.showErrMesgPopUp
    });
  };

  deleteSectionImage = async imageId => {
    try {
      let sectionId = this.state.DataDetails.objectId;
      //start spinner
      this.showAndHide(true, "MainSpinner");
      await itemService.deleteSectionImage({
        sectionId: sectionId,
        imageId: imageId
      });

      // stop spinner
      this.showAndHide(false, "MainSpinner");
      //show success alert
      this.showAndHide(true, "editAlert");
      this.loadSectionItems();

      this.setState({
        images: this.state.images.filter(image => image.name !== imageId),
        DataDetails: {
          ...this.state.DataDetails,
          images: this.state.DataDetails.images.filter(
            image => image.name !== imageId
          )
        }
      });

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
        errMessage: "Failed To Delete Section Item"
      });
      console.log("Error while deleting section item: ", err);
    }
  };

  // sortable
  componentDidMount() {
    this.sortable = Sortable.create(document.getElementById("sortable"), {
      animation: 150,
      handle: ".sort-able",
      onEnd: this.onEnd
    });
  }

  // reset sates
  componentWillUnmount() {
    this.setState({
      popUpLock: false,
      disabled: true,
      sectionItems: [],
      DataDetails: null,
      showPopUpCategoryAndSubcategory: false,
      selectedCategoryArr: [],
      selectedSubCategoryArr: [],
      popUpVal: null,
      categoryVal: null,
      subCategoryVal: null,
      RichDescriptionValEN: null,
      RichDescriptionValAR: null,
      editIconStyOnClick: { color: "" },
      errMessage: null,
      loaderLock: false,
      showErrMesgPopUp: false,
      alertLock: false,
      mainLoaderLock: false,
      loaderLock: false,
      contentEN: null,
      contentAR: null,
      ShowErrorHintLatitude: false,
      ShowErrorHintLongitude: false,
      images: [],
      totalImages: 1,
      deleteImagesId: []
    });
  }

  render() {
    const {
      disabled,
      sectionItems,
      DataDetails,
      showPopUpCategoryAndSubcategory,
      popUpVal,
      editIconStyOnClick,
      alertLock,
      alertMesLock,
      mainLoaderLock,
      loaderLock,
      errMessage,
      ShowErrorHintForRichDescriptionEN,
      ShowErrorHintForRichDescriptionAR,
      ShowErrorHintLatitude,
      ShowErrorHintLongitude
    } = this.state;

    return (
      <div className="animated fadeIn">
        {alertLock && (
          <div className="alertSty">
            <Alert color="success">
              {alertMesLock
                ? " Your Section Item Has Been Updated Successfully"
                : " Your Section Item Has Been Deleted Successfully"}
            </Alert>
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
            {/* category and sub category popup */}
            <Modal
              isOpen={showPopUpCategoryAndSubcategory}
              toggle={this.togglePopUpCategoryAndSubcategory}
              className={"modal-primary " + this.props.className}
            >
              <ModalHeader toggle={this.togglePopUpCategoryAndSubcategory}>
                Modal title
              </ModalHeader>
              <ModalBody>
                {popUpVal === "Category" ? (
                  <Input
                    type="select"
                    name="select"
                    id="select"
                    onChange={e => this.popUpDropDownVal(e)}
                  >
                    <option>select</option>
                    <option value="test1">test1</option>
                    <option value="test2">test2</option>
                    <option value="test3">test3</option>
                  </Input>
                ) : popUpVal === "SubCategory" ? (
                  <Input
                    type="select"
                    name="select"
                    id="select"
                    onChange={e => this.popUpDropDownVal(e)}
                  >
                    <option>select</option>
                    <option value="test4">test4</option>
                    <option value="test5">test5</option>
                    <option value="test6">test6</option>
                  </Input>
                ) : null}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.showResult}>
                  Do Something
                </Button>{" "}
                <Button
                  color="secondary"
                  onClick={this.togglePopUpCategoryAndSubcategory}
                >
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
                    <i className="fa fa-align-justify"></i> Current Section
                    Items
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
                <Table responsive>
                  {/* Main spinner */}
                  {mainLoaderLock && (
                    <div className="loaderContainerOne">
                      <div className="loaderContainerTwoMain">
                        <div className="loader"></div>
                      </div>
                    </div>
                  )}
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Website</th>
                      <th>Phone</th>
                      <th>Price</th>
                      <th>Details</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody id="sortable">
                    {sectionItems
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map(item => (
                        <tr data-id={item.objectId} key={item.objectId}>
                          <td>
                            <span
                              className="sort-able"
                              style={{ cursor: "move" }}
                            >
                              <i className="fa fa-bars"></i>
                            </span>
                          </td>
                          <td>{item.label.en}</td>
                          <td>{item.website}</td>
                          <td>{item.phone}</td>
                          <td>{item.price}</td>
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
                              onClick={this.deleteItem}
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
                          sectionItems Details
                        </ModalHeader>
                        <ModalBody>
                          {/* spinner */}
                          {loaderLock && (
                            <div className="loaderContainerOne">
                              <div className="loaderContainerTwoSectionItem">
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
                            {DataDetails.images?.length > 0 ? (
                              <SectionCarousels
                                items={DataDetails.images.map(image => ({
                                  src: image.url,
                                  altText: "Slide 1",
                                  caption: ""
                                }))}
                              />
                            ) : (
                              <img
                                src={DataDetails.image.url}
                                alt="category img"
                              />
                            )}
                          </Col>
                          <Col xs="12">
                            <Form
                              className="form-horizontal"
                              onSubmit={this.updateSectionItem}
                            >
                              <Row>
                                <Col md="3">
                                  <p>PageDispalyType</p>
                                </Col>
                                <Col xs="9" md="9">
                                  <p>{DataDetails.PageDispalyType}</p>
                                </Col>
                              </Row>
                              {DataDetails.PageDispalyType !==
                                "bookingPage" && (
                                <FormGroup row>
                                  <Col md="3">
                                    <Label htmlFor="text-input">
                                      TAreviewScore
                                    </Label>
                                  </Col>
                                  <Col xs="12" md="9">
                                    <Input
                                      type="number"
                                      id="TAreviewScore"
                                      name="text-input"
                                      placeholder="Enter Category Name"
                                      disabled={disabled ? "disabled" : ""}
                                      value={DataDetails.TAreviewScore}
                                      step="any"
                                      // required
                                      onChange={event => {
                                        this.handleDataChange(
                                          event,
                                          "TAreviewScore"
                                        );
                                      }}
                                    />
                                  </Col>
                                </FormGroup>
                              )}

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="text-input">Category</Label>
                                </Col>
                                <Col xs="12" md="9">
                                  &nbsp; &nbsp;
                                  {DataDetails.categories
                                    ? DataDetails.categories.map(
                                        categorySelect => (
                                          <Button
                                            type="button"
                                            value={categorySelect.objectId}
                                            //  onClick={(e)=>this.test(e)}
                                            onClick={e =>
                                              this.deleteCategoryFun(e)
                                            }
                                            style={{ backgroundColor: "#fff" }}
                                            // disabled={disabled ? "disabled" : ""}
                                            disabled
                                            className="mr-1"
                                          >
                                            {categorySelect.name}
                                            &nbsp; &nbsp;
                                            <i className="fa fa-close fa-lg mt-4  closeIconSty"></i>
                                          </Button>
                                        )
                                      )
                                    : null}
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="text-input">
                                    SubCategory
                                  </Label>
                                </Col>
                                <Col xs="12" md="9">
                                  {/* <Button
                                    disabled={disabled ? "disabled" : ""}
                                    value="SubCategory"
                                    type="button"
                                    color="primary"
                                    onClick={e =>
                                      this.togglePopUpCategoryAndSubcategory(e)
                                    }
                                    className="mr-1"
                                  >
                                    <i className="fa fa-plus "></i> &nbsp; Add
                                    SubCategory
                                  </Button> */}
                                  &nbsp; &nbsp;
                                  {DataDetails.subCategories
                                    ? DataDetails.subCategories.map(
                                        SubCategorySelect => (
                                          <Button
                                            type="button"
                                            value={SubCategorySelect.objectId}
                                            onClick={e =>
                                              this.deleteCategoryFun(e)
                                            }
                                            style={{ backgroundColor: "#fff" }}
                                            className="mr-1"
                                            // disabled={disabled ? "disabled" : ""}
                                            disabled
                                          >
                                            {SubCategorySelect.name}
                                            &nbsp; &nbsp;
                                            <i className="fa fa-close fa-lg mt-4  closeIconSty"></i>
                                          </Button>
                                        )
                                      )
                                    : null}
                                </Col>
                              </FormGroup>

                              {DataDetails.location &&
                              DataDetails.PageDispalyType !== "bookingPage" ? (
                                <FormGroup row>
                                  <Col md="3">
                                    <Label htmlFor="text-input">Location</Label>
                                  </Col>
                                  <Col xs="12" md="4">
                                    <Input
                                      type="number"
                                      id="text-input"
                                      name="lat"
                                      className="LatitudeFieldSty"
                                      disabled={disabled ? "disabled" : ""}
                                      value={DataDetails.location.latitude}
                                      placeholder="Enter Latitude"
                                      // required
                                      onChange={event => {
                                        this.handleDataChange(event, [
                                          "location",
                                          "latitude"
                                        ]);
                                      }}
                                    />
                                    {ShowErrorHintLatitude && (
                                      <FormText color="danger">
                                        Latitude Number Must Be Between 90 and
                                        -90
                                      </FormText>
                                    )}
                                    &nbsp; &nbsp;
                                  </Col>
                                  <Col xs="12" md="4">
                                    <Input
                                      type="number"
                                      id="text-input"
                                      name="long"
                                      className="LongitudeFieldSty"
                                      value={DataDetails.location.longitude}
                                      disabled={disabled ? "disabled" : ""}
                                      placeholder="Enter Longitude"
                                      // required
                                      onChange={event => {
                                        this.handleDataChange(event, [
                                          "location",
                                          "longitude"
                                        ]);
                                      }}
                                    />
                                    {ShowErrorHintLongitude && (
                                      <FormText color="danger">
                                        Longitude Number Must Be Between 90 and
                                        -90{" "}
                                      </FormText>
                                    )}
                                  </Col>
                                </FormGroup>
                              ) : null}

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="text-input">Info EN</Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    type="text"
                                    id="text-input"
                                    name="infoEn"
                                    placeholder="Enter Search Keyword"
                                    disabled={disabled ? "disabled" : ""}
                                    value={DataDetails.info.en}
                                    required
                                    onChange={event => {
                                      this.handleDataChange(event, [
                                        "info",
                                        "en"
                                      ]);
                                    }}
                                  />
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="text-input">Info AR</Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    type="text"
                                    id="text-input"
                                    name="infoAr"
                                    placeholder="Enter Details Page Type"
                                    disabled={disabled ? "disabled" : ""}
                                    required
                                    value={DataDetails.info.ar}
                                    onChange={event => {
                                      this.handleDataChange(event, [
                                        "info",
                                        "ar"
                                      ]);
                                    }}
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
                                    id="text-input"
                                    name="labelEn"
                                    placeholder="Enter Label EN"
                                    disabled={disabled ? "disabled" : ""}
                                    value={DataDetails.label.en}
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
                                    value={DataDetails.label.ar}
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

                              {DataDetails.PageDispalyType !==
                                "bookingPage" && (
                                <FormGroup row>
                                  <Col md="3">
                                    <Label htmlFor="text-input">Phone</Label>
                                  </Col>
                                  <Col xs="12" md="9">
                                    <Input
                                      type="text"
                                      id="text-input"
                                      name="phone"
                                      placeholder="Enter Phone Number"
                                      disabled={disabled ? "disabled" : ""}
                                      value={DataDetails.phone}
                                      // required
                                      onChange={event => {
                                        this.handleDataChange(event, "phone");
                                      }}
                                    />
                                  </Col>
                                </FormGroup>
                              )}

                              {DataDetails.PageDispalyType !==
                                "bookingPage" && (
                                <FormGroup row>
                                  <Col md="3">
                                    <Label htmlFor="text-input">Price</Label>
                                  </Col>
                                  <Col xs="12" md="9">
                                    <Input
                                      type="number"
                                      id="text-input"
                                      name="price"
                                      placeholder="Enter Price AR"
                                      disabled={disabled ? "disabled" : ""}
                                      value={DataDetails.price}
                                      // required
                                      onChange={event => {
                                        this.handleDataChange(event, "price");
                                      }}
                                    />
                                  </Col>
                                </FormGroup>
                              )}

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="text-input">Website</Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    type="text"
                                    id="text-input"
                                    name="website"
                                    placeholder="Enter Label AR"
                                    disabled={disabled ? "disabled" : ""}
                                    value={DataDetails.website}
                                    required
                                    onChange={event => {
                                      this.handleDataChange(event, "website");
                                    }}
                                  />
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="file-input">
                                    Upload Image
                                  </Label>
                                </Col>
                                <Col xs="10" md="8">
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 16
                                    }}
                                  >
                                    {DataDetails.images?.map((image, index) => (
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 4
                                        }}
                                      >
                                        <div style={{ width: "100%" }}>
                                          <img
                                            src={image.url}
                                            alt="category img"
                                            style={{ width: 100, height: 100 }}
                                          />
                                        </div>
                                        <Button
                                          color="danger"
                                          disabled={disabled ? "disabled" : ""}
                                          onClick={() => {
                                            this.deleteSectionImage(image.name);
                                          }}
                                        >
                                          <i className="fa fa-trash"></i>
                                        </Button>
                                      </div>
                                    ))}

                                    {[...Array(this.state.totalImages)].map(
                                      (image, index) => (
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4
                                          }}
                                        >
                                          <div style={{ width: "100%" }}>
                                            <Input
                                              type="file"
                                              id="file-input"
                                              name={`images[]`}
                                              disabled={
                                                disabled ? "disabled" : ""
                                              }
                                            />
                                            <FormText color="muted">
                                              image size : aspect ratio 25:14 or
                                              375*250
                                            </FormText>
                                          </div>
                                          {index > 0 ? (
                                            <Button
                                              color="danger"
                                              disabled={
                                                disabled ? "disabled" : ""
                                              }
                                              onClick={() =>
                                                this.setState({
                                                  totalImages:
                                                    this.state.totalImages - 1,
                                                  images: this.state.images.filter(
                                                    (image, i) => i !== index
                                                  )
                                                })
                                              }
                                            >
                                              <i className="fa fa-trash"></i>
                                            </Button>
                                          ) : (
                                            <Button
                                              color="primary"
                                              disabled={
                                                disabled ? "disabled" : ""
                                              }
                                              onClick={() =>
                                                this.setState({
                                                  totalImages:
                                                    this.state.totalImages + 1
                                                })
                                              }
                                            >
                                              <i className="fa fa-plus"></i>
                                            </Button>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="text-input">
                                    RichDescription EN
                                  </Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <SunEditor
                                    disable={disabled ? true : false}
                                    lang="en"
                                    onChange={this.RichDescriptionEGChangeFun}
                                    setContents={DataDetails.RichDescription.en}
                                    setOptions={{
                                      height: 200,
                                      width: 500,
                                      buttonList: buttonList.complex
                                    }}
                                  />
                                  {ShowErrorHintForRichDescriptionEN && (
                                    <FormText color="danger">Required</FormText>
                                  )}
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="text-input">
                                    RichDescription AR
                                  </Label>
                                </Col>
                                <Col
                                  xs="12"
                                  md="9"
                                  className="textAreaEditorContainer typingDirectionSty"
                                >
                                  <SunEditor
                                    disable={disabled ? true : false}
                                    lang="ar"
                                    setContents={DataDetails.RichDescription.ar}
                                    onChange={this.RichDescriptionARChangeFun}
                                    setOptions={{
                                      height: 200,
                                      width: 500,
                                      buttonList: buttonList.complex
                                    }}
                                  />
                                  {ShowErrorHintForRichDescriptionAR && (
                                    <FormText color="danger">Required</FormText>
                                  )}
                                </Col>
                              </FormGroup>
                              <ModalFooter>
                                {!disabled && (
                                  <Button
                                    color="primary"
                                    type="submit"
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
