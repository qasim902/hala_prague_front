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
import "./AddPlanTrip.scss";
import SunEditor, { buttonList } from "suneditor-react";

import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import dataService from "../../../services/dataService.js";
import plannedTripsService from "../../../services/plannedTripsService.js";
class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopUp: false,
      sectionItems: [],
      selectedSectionItemsArr: [],
      showSelectedSectionItemsArr: [],
      RichDescriptionValEN: null,
      RichDescriptionValAR: null,
      dayNumber: null,
      disabled: false,
      validationMess: false,
      EditBtnLock: false,
      selectedEditdayVal: null,
      currentDayNum: null,
      // popUpVal: null,
      loaderLock: false,
      // errMessage: null,
      showErrMesgPopUp: false,
      ShowErrorHintForRichDescriptionEN: false,
      ShowErrorHintForRichDescriptionAR: false,
      ShowErrorHintForAddDayBtn: false,
      alertLock: false,
      contentEN: null,
      contentAR: null,
    };
    this.createItem = this.createItem.bind(this);
  }

  componentWillMount() {
    this.loadSectionItems();
  }

  loadSectionItems() {
    let sectionItems = dataService.load("sectionItems");
    this.setState({ sectionItems: sectionItems });
  }

  // scroll to page top  when load
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  // // hide and show add Day pop up
  togglePopUp = e => {
    const { EditBtnLock } = this.state;
    this.setState({
      showPopUp: !this.state.showPopUp,
      selectedSectionItemsArr: [],
      dayNumber: null
    });
    // check if Edit popup open or not
    if (EditBtnLock) {
      this.setState({
        EditBtnLock: false
      });
    }
  };
  // // save the Day plan trip value drop down menu in state
  popUpDropDownVal = e => {
    const { selectedSectionItemsArr } = this.state;

    let obj = JSON.parse(e.currentTarget.value);
    let checkSectionItemsArr = this.objIncludes(selectedSectionItemsArr, obj);
    if (!checkSectionItemsArr) {
      if (obj !== "null") {
        var selectedSectionItem = selectedSectionItemsArr.concat(obj);
      }
      this.setState({
        selectedSectionItemsArr: selectedSectionItem
      });
    }
    // reset section Items dropDown Menu
    e.target.value = "null";
  };
  // // print the result of Day plan trip popup
  showResult = () => {
    const {
      selectedSectionItemsArr,
      showSelectedSectionItemsArr,
      dayNumber
    } = this.state;
    let selectedSectionItemsArrCopy = [...showSelectedSectionItemsArr];

    selectedSectionItemsArrCopy.push({
      day: dayNumber,
      locations: selectedSectionItemsArr
    });

    this.setState(
      {
        showPopUp: !this.state.showPopUp,
        showSelectedSectionItemsArr: selectedSectionItemsArrCopy
      },
      () => {
        this.setState({
          selectedSectionItemsArr: []
        });
      }
    );
  };

  objIncludes(list, obj) {
    for (let item of list) if (item.objectId === obj.objectId) return true;
    return false;
  }

  deleteSectionItemFun = (e, locker) => {
    const { selectedSectionItemsArr, showSelectedSectionItemsArr } = this.state;
    // used to delete section item from the popup
    let objId = e.currentTarget.value;
    console.log("objId =", objId);

    if (this.objIncludes(selectedSectionItemsArr, { objectId: objId })) {
      this.setState({
        selectedSectionItemsArr: selectedSectionItemsArr.filter(obj => {
          return obj.objectId !== objId;
        })
      });
    }

    //////////////
    // used to delete section item from the form
    if (locker === "listedSectionItems") {
      console.log("tesss = ", JSON.parse(e.currentTarget.parentNode.value));

      // let selectedItem = JSON.parse(e.currentTarget.value) ;
      let selectedItem = JSON.parse(e.currentTarget.parentNode.value);
      let showSelectedSectionItemsArrCopy = [...showSelectedSectionItemsArr];

      const ItemVal = showSelectedSectionItemsArrCopy
        .map(obj => {
          return obj.day;
        })
        .indexOf(selectedItem.day);

      if (ItemVal > -1) {
        showSelectedSectionItemsArrCopy.splice(ItemVal, 1);
      }

      this.setState({
        showSelectedSectionItemsArr: showSelectedSectionItemsArrCopy
      });
    }
  };

  // // text area editor fun for EN
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
      contentEN:content
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
      <body style="font-family: 'Inder' !important;">
            ` +
        content +
        `
      </body>
      </html>`,
      contentAR: content
    });
  };
// create new plan trip
  async createItem(event) {
    event.preventDefault();
    const {
      contentEN,
      contentAR ,
      RichDescriptionValEN,
      RichDescriptionValAR,
      showSelectedSectionItemsArr
    } = this.state;
    const data = new FormData(event.target);

     // this condition for validations
    if(
      contentEN !== "<p><br></p>" &&
      contentEN !== null &&
      contentAR !== "<p><br></p>" &&
      contentAR !== null &&
      (Array.isArray(showSelectedSectionItemsArr) &&
      showSelectedSectionItemsArr.length != 0)
    )
    {
      this.setState({
        ShowErrorHintForRichDescriptionEN: false,
        ShowErrorHintForRichDescriptionAR: false,
        ShowErrorHintForAddDayBtn: false
      });
    try {
      //start spinner
      this.showAndHide(true, "spinner");
      await plannedTripsService.create(
        RichDescriptionValAR,
        RichDescriptionValEN,
        showSelectedSectionItemsArr,
        data
      );
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
        errMessage: "Failed To Create Plan trip"
      });
      //popup error msg
      console.log("Error while loggining in as Admin: ", err);
    }
  }
  else
  {
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
      Array.isArray(showSelectedSectionItemsArr) &&
      showSelectedSectionItemsArr.length == 0 
    ) {
      this.setState({
        ShowErrorHintForAddDayBtn: true
      });
    } else {
      this.setState({
        ShowErrorHintForAddDayBtn: false
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

  dayPlanTripNumberFun = e => {
    const { showSelectedSectionItemsArr, EditBtnLock } = this.state;
    const dayVal = showSelectedSectionItemsArr
      .map(obj => {
        return obj.day;
      })
      .indexOf(e.target.value);

    if (dayVal > -1) {
      this.setState({
        disabled: true,
        validationMess: true
      });
    } else {
      this.setState({
        disabled: false,
        validationMess: false
      });
    }
    this.setState({
      dayNumber: e.target.value
    });

    if (EditBtnLock) {
      this.setState({
        currentDayNum: e.target.value
      });
    }
  };

  editDayFun = e => {
    let EditdayVal = JSON.parse(e.target.value),
      Editdayarr = [];

    EditdayVal.locations.map(val => {
      Editdayarr.push(val);
    });


    this.setState({
      showPopUp: !this.state.showPopUp,
      selectedSectionItemsArr: Editdayarr,
      EditBtnLock: !this.state.EditBtnLock,
      selectedEditdayVal: EditdayVal,
      currentDayNum: EditdayVal.day
    });
  };

  editPopUpFun = () => {
    const {
      selectedEditdayVal,
      showSelectedSectionItemsArr,
      selectedSectionItemsArr,
      currentDayNum
    } = this.state;
    let showSelectedSectionItemsArrCopy = [...showSelectedSectionItemsArr];
    const dayVal = showSelectedSectionItemsArrCopy
      .map(obj => {
        return obj.day;
      })
      .indexOf(selectedEditdayVal.day);

    if (dayVal > -1) {

      showSelectedSectionItemsArrCopy[
        dayVal
      ].locations = selectedSectionItemsArr;
      showSelectedSectionItemsArrCopy[dayVal].day = currentDayNum;


      this.setState({
        showPopUp: !this.state.showPopUp,
        EditBtnLock: !this.state.EditBtnLock,
        showSelectedSectionItemsArr: showSelectedSectionItemsArrCopy,
        selectedSectionItemsArr: []
      });
    }
  };

  toggleDanger = () => {
    this.setState({
      showErrMesgPopUp: !this.state.showErrMesgPopUp
    });
  };

  render() {
    const {
      showPopUp,
      sectionItems,
      selectedSectionItemsArr,
      showSelectedSectionItemsArr,
      validationMess,
      disabled,
      EditBtnLock,
      dayNumber,
      currentDayNum,
      loaderLock,
      errMessage,
      showErrMesgPopUp,
      alertLock,
      ShowErrorHintForRichDescriptionEN,
      ShowErrorHintForRichDescriptionAR,
      ShowErrorHintForAddDayBtn
    } = this.state;
   


    return (
      <div className="animated fadeIn">
        {alertLock && (
          <div className="alertSty">
            <Alert color="success">
              Your Plan Trip Has Been Added Successfully
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
            {/* days popup */}
            <Modal
              isOpen={showPopUp}
              toggle={this.togglePopUp}
              className={"modal-primary " + this.props.className}
            >
              <ModalHeader toggle={this.togglePopUp}>
                Day Plan Trip{" "}
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col xs="3" md="3">
                    <Label htmlFor="text-input">Day</Label>
                  </Col>
                  <Col xs="9">
                    {EditBtnLock ? <p>{currentDayNum}</p> : null}
                    {!EditBtnLock ? (
                      <Input
                        type="number"
                        name="day"
                        // value={EditBtnLock?(currentDayNum):null}
                        placeholder="Enter Day Number"
                        onChange={e => this.dayPlanTripNumberFun(e)}
                        // required
                      />
                    ) : null}
                    {validationMess && (
                      <FormText color="danger">Day already exist</FormText>
                    )}
                    <br />
                  </Col>
                </Row>
                <Row>
                  <Col xs="3" md="3">
                    <Label htmlFor="text-input">trips</Label>
                  </Col>
                  <Col xs="9">
                    {selectedSectionItemsArr.map(sectionItemSelect => (
                      <Button
                        type="button"
                        value={sectionItemSelect.objectId}
                        onClick={e => this.deleteSectionItemFun(e)}
                        style={{ backgroundColor: "#fff" }}
                        className="mr-1 btnResultSty"
                      >
                        {sectionItemSelect.name}
                        &nbsp; &nbsp;
                        <i className="fa fa-close fa-lg mt-4  closeIconSty"></i>
                      </Button>
                    ))}
                  </Col>
                </Row>
                <Row>
                  <Col xs="3" md="3">
                    <Label htmlFor="text-input">Section Items</Label>
                  </Col>
                  <Col xs="9">
                    <br />
                    <Input
                      type="select"
                      name="select"
                      id="select"
                      onChange={e => this.popUpDropDownVal(e)}
                    >
                      <option value="null">Select a Section Item</option>
                      {sectionItems.map(Item => (
                        <option
                          value={JSON.stringify({
                            objectId: Item.objectId,
                            name: Item.label.en
                          })}
                          // value={{
                          //   objectId: Item.objectId,
                          //   name: Item.label.en
                          // }}
                          // value= {Item.label.en}
                        >
                          {Item.label.en}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                {!EditBtnLock && (
                  <Button
                    disabled={
                      disabled || dayNumber === null || dayNumber === ""
                        ? "disabled"
                        : ""
                    }
                    color="primary"
                    onClick={this.showResult}
                  >
                    Add
                  </Button>
                )}
                {EditBtnLock && (
                  <Button
                    disabled={disabled ? "disabled" : ""}
                    color="primary"
                    onClick={this.editPopUpFun}
                  >
                    Edit
                  </Button>
                )}
                <Button color="secondary" onClick={this.togglePopUp}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
            <Card>
              <CardHeader>
                <strong>Add Plan Trip</strong>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.createItem} className="form-horizontal">
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
                      <Label htmlFor="file-input">Upload Image</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" name="image" required />
                      <FormText color="muted">
                        image size : aspect ratio 19:9 or 343*160
                      </FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Days</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Button
                        value="Days"
                        color="primary"
                        onClick={e => this.togglePopUp(e)}
                        className="mr-1"
                      >
                        <i className="fa fa-plus "></i> &nbsp; Add
                      </Button>
                      &nbsp; &nbsp;
                      {showSelectedSectionItemsArr.map(sectionItemSelect => (
                        <Button
                          type="button"
                          // value={sectionItemSelect}
                          value={JSON.stringify(sectionItemSelect)}
                          // onClick={e => this.deleteSectionItemFun(e,"listedSectionItems")}
                          onClick={e => {
                            this.editDayFun(e);
                          }}
                          style={{ backgroundColor: "#fff" }}
                          className="mr-1 "
                        >
                          {/* // {sectionItemSelect} */}
                          Day {sectionItemSelect.day}
                          &nbsp; &nbsp;
                          <i
                            onClick={e =>
                              this.deleteSectionItemFun(e, "listedSectionItems")
                            }
                            className="fa fa-close fa-lg mt-4  closeIconSty"
                          ></i>
                        </Button>
                      ))}
                        {ShowErrorHintForAddDayBtn && (
                        <FormText color="danger">
                          Must add At Least One Day
                        </FormText>
                      )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Price</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="number"
                        name="price"
                        placeholder="Enter price"
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
