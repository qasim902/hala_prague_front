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
  Input,
  Label,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  FormText,
  Badge
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import "./AddSectionItem.scss";
import SunEditor, { buttonList } from "suneditor-react";

import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import dataService from "../../../services/dataService.js";
import itemService from "../../../services/itemService.js";
class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopUp: false,
      categoryVal: null,
      subCategoryVal: null,
      selectedCategoryArr: [],
      selectedSubCategoryArr: [],
      RichDescriptionValEN: null,
      RichDescriptionValAR: null,
      popUpVal: null,
      loaderLock: false,
      errMessage: null,
      showErrMesgPopUp: false,
      ShowErrorHintLatitude: false,
      ShowErrorHintLongitude: false,
      ShowErrorHintForRichDescriptionEN: false,
      ShowErrorHintForRichDescriptionAR: false,
      ShowErrorHintForAddCategoryBtn: false,
      ShowErrorHintForAddSubCategoryBtn: false,
      displayPage: "standard",
      alertLock: false,
      contentEN: null,
      contentAR: null,
    };
    this.createItem = this.createItem.bind(this);
  }

  componentWillMount() {
    this.loadData();
  }

  loadData() {
    let categories = dataService.load("categories").filter(cat => {
      return cat.childrenType === "sectionItems";
    });
    let subCategories = dataService.load("subCategories");
    this.setState({
      categories: categories,
      subCategories: subCategories
    });
  }

  // scroll to page top  when load
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  // hide and show  Category And Subcategory pop up
  togglePopUp = e => {
    this.setState({
      showPopUp: !this.state.showPopUp
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
    const { popUpVal } = this.state;
    let obj = JSON.parse(e.currentTarget.value);
    if (popUpVal === "Category") {
      this.setState({
        categoryVal: obj
      });
    } else if (popUpVal === "SubCategory") {
      this.setState({
        subCategoryVal: obj
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

    if (!(categoryVal || subCategoryVal)) return;

    if (popUpVal === "Category") {
      let checkCategoryArr = this.objIncludes(selectedCategoryArr, categoryVal);
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
      let checkSubCategoryArr = this.objIncludes(
        selectedSubCategoryArr,
        subCategoryVal
      );
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
      showPopUp: !this.state.showPopUp
    });
  };

  objIncludes(list, obj) {
    for (let item of list) if (item.objectId === obj.objectId) return true;
    return false;
  }

  deleteCategoryFun = e => {
    const { selectedCategoryArr, selectedSubCategoryArr } = this.state;

    //  delete cataegory
    let objId = e.currentTarget.value;
    if (this.objIncludes(selectedCategoryArr, { objectId: objId })) {
      this.setState({
        selectedCategoryArr: selectedCategoryArr.filter(obj => {
          return obj.objectId !== objId;
        })
      });
    } else {
      //  delete subCataegory
      this.setState({
        selectedSubCategoryArr: selectedSubCategoryArr.filter(obj => {
          return obj.objectId !== objId;
        })
      });
    }
  };

  // text area editor fun for EN
  RichDescriptionEGChangeFun = content => {

    this.setState({
      RichDescriptionValEN: `<html lang='en'>
      <head>
          <link href='https://fonts.googleapis.com/css?family=Inder&display=swap&subset=latin-ext' rel='stylesheet'>

      </head>
      <body style="font-family: 'Inder' !important;">
            `+content+`
      </body>
      </html>`,
      contentEN:content
    });
  };
  // text area editor fun for AR
  RichDescriptionARChangeFun = content => {

    this.setState({
      RichDescriptionValAR: `<html lang='en'>
      <head>
          <link href='https://fonts.googleapis.com/css?family=Inder&display=swap&subset=latin-ext' rel='stylesheet'>

      </head>
      <body style='direction: rtl;font-family: 'Inder' !important;'>
            `+content+`
      </body>
      </html>`,
      contentAR: content
    });
  };

  async createItem(event) {
    event.preventDefault();
    const {
      contentEN,
      contentAR ,
      selectedCategoryArr,
      selectedSubCategoryArr,
      displayPage
    } = this.state;
    const data = new FormData(event.target);

    // this condition for validations
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
      contentAR !== null &&
      ((Array.isArray(selectedCategoryArr) &&
        selectedCategoryArr.length != 0) ||
        (Array.isArray(selectedSubCategoryArr) &&
          selectedSubCategoryArr.length != 0))
    ) {
      this.setState({
        ShowErrorHintLatitude: false,
        ShowErrorHintLongitude: false,
        ShowErrorHintForRichDescriptionEN: false,
        ShowErrorHintForRichDescriptionAR: false,
        ShowErrorHintForAddCategoryBtn: false,
        ShowErrorHintForAddSubCategoryBtn: false
      });

      let {
        RichDescriptionValEN,
        RichDescriptionValAR,
        selectedCategoryArr,
        selectedSubCategoryArr
      } = this.state;

      let RichDescription = {
        en: RichDescriptionValEN,
        ar: RichDescriptionValAR
      };
      try {
        //start spinner
        this.showAndHide(true, "spinner");
        await itemService.createSectionItem({
          formData: data,
          RichDescription: RichDescription,
          categories: selectedCategoryArr,
          subCategories: selectedSubCategoryArr,
          PageDispalyType: displayPage
        });
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
          errMessage: "Failed To Create SectionItem"
        });
        //popup error msg
        console.log("Error while loggining in as Admin: ", err);
      }
    } else {
      // this conditions for validations

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

      if (
        contentEN === "<p><br></p>" ||
        contentEN === null
      ) {
        this.setState({
          ShowErrorHintForRichDescriptionEN: true
        });
      } else {
        this.setState({
          ShowErrorHintForRichDescriptionEN: false
        });
      }

      if (
        contentAR === "<p><br></p>" ||
        contentAR === null
      ) {
        this.setState({
          ShowErrorHintForRichDescriptionAR: true
        });
      } else {
        this.setState({
          ShowErrorHintForRichDescriptionAR: false
        });
      }

      if (
        Array.isArray(selectedCategoryArr) &&
        selectedCategoryArr.length == 0 &&
        Array.isArray(selectedSubCategoryArr) &&
        selectedSubCategoryArr.length == 0
      ) {
        this.setState({
          ShowErrorHintForAddCategoryBtn: true,
          ShowErrorHintForAddSubCategoryBtn: true
        });
      } else {
        this.setState({
          ShowErrorHintForAddCategoryBtn: false,
          ShowErrorHintForAddSubCategoryBtn: false
        });
      }
    }
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

  toggleDanger = () => {
    this.setState({
      showErrMesgPopUp: !this.state.showErrMesgPopUp
    });
  };

  

  radioBtnValFun = e => {
    this.setState({
      displayPage: e.target.value
    });
  };

  toggleDanger = () => {
    this.setState({
      showErrMesgPopUp: !this.state.showErrMesgPopUp
    });
  };

  render() {
    const {
      showPopUp,
      selectedCategoryArr,
      selectedSubCategoryArr,
      popUpVal,
      categories,
      subCategories,
      loaderLock,
      errMessage,
      showErrMesgPopUp,
      alertLock,
      ShowErrorHintLatitude,
      ShowErrorHintLongitude,
      ShowErrorHintForRichDescriptionEN,
      ShowErrorHintForRichDescriptionAR,
      ShowErrorHintForAddCategoryBtn,
      ShowErrorHintForAddSubCategoryBtn,
      displayPage
    } = this.state; 
    return (
      <div className="animated fadeIn">
        {alertLock && (
          <div className="alertSty">
            <Alert color="success">
              Your SectionItem Has Been Added Successfully
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
            {/* category and sub category popup */}
            <Modal
              isOpen={showPopUp}
              toggle={this.togglePopUp}
              className={"modal-primary " + this.props.className}
            >
            <ModalHeader toggle={this.togglePopUp}>
              {popUpVal === "Category" ?
                ("Add category")
                :(popUpVal === "SubCategory" ?(
                  "Add SubCategory"
                ):null
              )}
             </ModalHeader>
              <ModalBody>
                {popUpVal === "Category" ? (
                  <Input
                    type="select"
                    name="select"
                    id="select"
                    onChange={e => this.popUpDropDownVal(e)}
                  >
                    <option value="null">Select a Category</option>
                    {categories.map(category => (
                      <option
                        value={JSON.stringify({
                          objectId: category.objectId,
                          name: category.name
                        })}
                      >
                        {category.name}
                      </option>
                    ))}
                  </Input>
                ) : popUpVal === "SubCategory" ? (
                  <Input
                    type="select"
                    name="select"
                    id="select"
                    onChange={e => this.popUpDropDownVal(e)}
                  >
                    <option value="null">Select a Sub-Category</option>
                    {subCategories.map(subCategory => (
                      <option
                        value={JSON.stringify({
                          objectId: subCategory.objectId,
                          name: subCategory.name
                        })}
                      >
                        {subCategory.name}
                      </option>
                    ))}
                  </Input>
                ) : null}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.showResult}>
                  Add
                </Button>{" "}
                <Button color="secondary" onClick={this.togglePopUp}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
            <Card>
              <CardHeader>
                <strong>Add Section Item</strong> 
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.createItem} className="form-horizontal">
                  <Col md="12" className="redioBtnContainer">
                    <FormGroup check inline>
                      <Input
                        defaultChecked
                        className="form-check-input"
                        type="radio"
                        name="radiosBtn"
                        value="standard"
                        onChange={e => this.radioBtnValFun(e)}
                      />
                      <Label
                        className="form-check-label"
                        check
                        htmlFor="inline-radio1"
                      >
                        standard
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input
                        className="form-check-input"
                        type="radio"
                        // id="inline-radio2"
                        name="radiosBtn"
                        value="bookingPage"
                        onChange={e => this.radioBtnValFun(e)}
                      />
                      <Label
                        className="form-check-label"
                        check
                        htmlFor="inline-radio2"
                      >
                        bookingPage
                      </Label>
                    </FormGroup>
                  </Col>
                  {displayPage !== "bookingPage" && (
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">TAreviewScore</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input
                          type="number"
                          name="TAreviewScore"
                          placeholder="Enter TAreviewScore"
                          step="any"
                        />
                      </Col>
                    </FormGroup>
                  )}

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Categories</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Button
                        value="Category"
                        color="primary"
                        onClick={e => this.togglePopUp(e)}
                        className="mr-1"
                      >
                        <i className="fa fa-plus "></i> &nbsp; Add Category
                      </Button>
                      &nbsp; &nbsp;
                      {selectedCategoryArr.map(categorySelect => (
                        <Button
                          type="button"
                          value={categorySelect.objectId}
                          onClick={e => this.deleteCategoryFun(e)}
                          style={{ backgroundColor: "#fff" }}
                          className="mr-1"
                        >
                          {categorySelect.name}
                          &nbsp; &nbsp;
                          <i className="fa fa-close fa-lg mt-4  closeIconSty"></i>
                        </Button>
                      ))}
                      {ShowErrorHintForAddCategoryBtn && (
                        <FormText color="danger">
                          Must add At Least One Category Or One SubCategory
                        </FormText>
                      )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Sub-Categories</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Button
                        value="SubCategory"
                        type="button"
                        color="primary"
                        onClick={e => this.togglePopUp(e)}
                        className="mr-1"
                      >
                        <i className="fa fa-plus "></i> &nbsp; Add SubCategory
                      </Button>
                      &nbsp; &nbsp;
                      {selectedSubCategoryArr.map(SubCategorySelect => (
                        <Button
                          type="button"
                          value={SubCategorySelect.objectId}
                          onClick={e => this.deleteCategoryFun(e)}
                          style={{ backgroundColor: "#fff" }}
                          className="mr-1"
                        >
                          {SubCategorySelect.name}
                          &nbsp; &nbsp;
                          <i className="fa fa-close fa-lg mt-4  closeIconSty"></i>
                        </Button>
                      ))}
                      {ShowErrorHintForAddSubCategoryBtn && (
                        <FormText color="danger">
                          Must add At Least One Category Or One SubCategory
                        </FormText>
                      )}
                    </Col>
                  </FormGroup>

                  {displayPage !== "bookingPage" && (
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">Location</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input
                          type="number"
                          name="lat"
                          placeholder="Enter Latitude"
                          step="any"
                        />
                        {ShowErrorHintLatitude && (
                          <FormText color="danger">
                            Latitude Number Must Be Between 90 and -90
                          </FormText>
                        )}
                      </Col>
                      &nbsp; &nbsp;
                      <Col xs="12" md="3">
                        <Input
                          type="number"
                          name="long"
                          placeholder="Enter Longitude"
                          step="any"
                        />
                        {ShowErrorHintLongitude && (
                          <FormText color="danger">
                            Longitude Number Must Be Between 90 and -90{" "}
                          </FormText>
                        )}
                      </Col>
                    </FormGroup>
                  )}

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Info EN</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        name="infoEn"
                        placeholder="Enter Info EN"
                        required
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
                        name="infoAr"
                        placeholder="Enter Info AR"
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
                  {displayPage !== "bookingPage" && (
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="text-input">Price</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input
                          type="number"
                          name="price"
                          placeholder="Enter price"
                        />
                      </Col>
                    </FormGroup>
                  )}

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input">Upload Image</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" name="image" required />
                      <FormText color="muted">
                        image size : aspect ratio 19:9 or 343*160
                      </FormText>
                    </Col>
                  </FormGroup>

                  {displayPage !== "bookingPage" && (
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Phone</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        name="phone"
                        placeholder="Enter Phone"
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
                        name="website"
                        placeholder="Enter Website"
                        required
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">RichDescription EN</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <SunEditor
                        lang="en"
                        onChange={this.RichDescriptionEGChangeFun}
                        name="RichDescriptionEn"
                        setOptions={{
                          height: 200,
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
                      <Label htmlFor="text-input">RichDescription AR</Label>
                    </Col>
                    <Col xs="12" md="9" className="textAreaEditorContainer typingDirectionSty">
                      <SunEditor
                        lang="ar"
                        onChange={this.RichDescriptionARChangeFun}
                        name="RichDescriptionAr"
                        setOptions={{
                          height: 200,
                          buttonList: buttonList.complex
                        }}
                      />
                      {ShowErrorHintForRichDescriptionAR && (
                        <FormText color="danger">Required</FormText>
                      )}
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
