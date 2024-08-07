import React, { Component } from "react";
import dataService from "../../../services/dataService.js";
import itemService from "../../../services/itemService.js";
import plannedTripsService from "../../../services/plannedTripsService";

import {
  Badge,
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
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import "./CurrentPlanTrip.scss";
import { conditionalExpression, jsxClosingElement } from "@babel/types";

import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popUpLock: false,
      sectionItems: [],
      DataDetails: null,
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
      showPopUp: false,
      selectedSectionItemsArr: [],
      disabled: false,
      validationMess: false,
      currentDayNum: null,
      dayNumber: null,
      EditBtnLock: false,
      selectedEditdayVal: null,
      planTripArr: null,
      disabledDay: false,
      // deleteLock: 0,
      ShowErrorHintForRichDescriptionEN: false,
      ShowErrorHintForRichDescriptionAR: false,
      ShowErrorHintForAddDayBtn: false
    };
    this.deleteTrip = this.deleteTrip.bind(this);
  }

  componentWillMount() {
    this.loadPlannedTrips();
  }

  loadPlannedTrips() {
    let sectionItems = dataService.load("sectionItems");
    let planTrips = plannedTripsService.loadPlannedTrips();

    itemService.loadParents(sectionItems);
    const planTripsCopy = JSON.parse(JSON.stringify(planTrips));
    this.setState({
      sectionItems: sectionItems,
      planTripArr: planTripsCopy,
      selectedSectionItemsArr: planTripsCopy,
      orgPlanTrips: planTripsCopy
    });
  }
  // scroll to page top  when load
  componentDidMount() {
    window.scrollTo(0, 0);
  }
// enable edit icon in the more details popup
  editIcon = () => {
    this.setState({
      disabled: false,
      editIconStyOnClick: { color: "#00d0b4" }
    });
  };

  // more details pop up
  togglePopUpFun = (e, key) => {
    const { planTripArr, orgPlanTrips } = this.state;
    if (key === "cancelBtn") {
      this.setState({
        planTripArr: orgPlanTrips,
        selectedSectionItemsArr: orgPlanTrips,
        popUpLock: !this.state.popUpLock,
        disabled: true,
        editIconStyOnClick: { color: "" },
        ShowErrorHintForRichDescriptionAR: false,
        ShowErrorHintForRichDescriptionEN: false
      });
    } else {
      const DetailsData = planTripArr.find(
        ({ objectId }) => objectId === e.target.value
      );

      this.setState({
        popUpLock: !this.state.popUpLock,
        disabled: true,
        DataDetails: DetailsData,
        editIconStyOnClick: { color: "" }
      });
    }
  };

  // // save the selected section items from the dropdown in the state and list it in the day plan trip popup
  popUpDropDownVal = e => {
    const {
      selectedSectionItemsArr,
      DataDetails,
      sectionItemVal,
      sectionItems,
      EditBtnLock,
      currentDayNum
    } = this.state;
    const selectedSectionItemsArrCopy = JSON.parse(
      JSON.stringify(selectedSectionItemsArr)
    );
    let obj = JSON.parse(e.currentTarget.value);

    const result = sectionItems.find(
      ({ objectId }) => objectId === obj.objectId
    );

    // check if the edit popup is open or add popup is open
    if (EditBtnLock) {
      // check if the selected section item from the dropdown menu selected befor or not
      selectedSectionItemsArrCopy.forEach(plan => {
        if (DataDetails.objectId === plan.objectId) {
          plan.days.forEach(Day => {
            if (Day.day === currentDayNum) {
              let sectionIndex = Day.locations.findIndex(
                obj => obj.objectId === result.objectId
              );
              if (sectionIndex == -1) {
                Day.locations.push(result);
              }
            }
          });
        }
      });

      var selectedSectionItem = selectedSectionItemsArrCopy;
    } else {
      // check if the selected section item from the dropdown menu selected befor or not
      let sectionIndex = selectedSectionItemsArrCopy.findIndex(
        obj => obj.objectId === result.objectId
      );
      if (sectionIndex == -1) {
        var selectedSectionItem = selectedSectionItemsArrCopy.concat(result);
      } else {
        var selectedSectionItem = selectedSectionItemsArrCopy;
      }
    }

    this.setState({
      selectedSectionItemsArr: selectedSectionItem
    });

    // reset section Items dropDown Menu
    e.target.value = "null";
  };

  // // print the result of Day plan trip popup in more details popup
  showResult = () => {
    const {
      selectedSectionItemsArr,
      DataDetails,
      dayNumber,
      planTripArr
    } = this.state;
    const planTripArrCopy = JSON.parse(JSON.stringify(planTripArr));

    planTripArrCopy.forEach((plan, index) => {
      if (DataDetails.objectId === plan.objectId) {
        planTripArrCopy[index].days.push({
          day: dayNumber,
          locations: selectedSectionItemsArr
        });
      }
    });

    this.setState({
      showPopUp: !this.state.showPopUp,
      planTripArr: planTripArrCopy,
      selectedSectionItemsArr: planTripArrCopy
    });
  };

  deleteSectionItemFun = (e, locker) => {
    const {
      selectedSectionItemsArr,
      planTripArr,
      DataDetails,
      currentDayNum,
      // deleteLock,
      EditBtnLock
    } = this.state;

    // used to delete section item from the popup
    let objId = e.currentTarget.value;

    let plansCopy;
    // delete the section items from edit day plan trip popup
    if (EditBtnLock) {
      // if (deleteLock == 0) {
      //   plansCopy = JSON.parse(JSON.stringify(planTripArr));
      // } else {
      plansCopy = JSON.parse(JSON.stringify(selectedSectionItemsArr));
      // }

      plansCopy.forEach(plan => {
        if (DataDetails.objectId === plan.objectId) {
          console.log("DataDetails.objectId =", DataDetails.objectId);
          console.log("plan.objectId =", plan.objectId);
          plan.days.forEach(Day => {
            if (Day.day === currentDayNum) {
              // Day.forEach((secItem)=> {

              Object.keys(Day).forEach(function(key) {
                if (key == "locations") {
                  let removeIndex = Day[key]
                    .map(function(item) {
                      return item.objectId;
                    })
                    .indexOf(objId);

                  // remove object
                  Day[key].splice(removeIndex, 1);
                }
              });
            }
          });
          // }
        }
      });

      this.setState({
        selectedSectionItemsArr: plansCopy,
        // deleteLock: deleteLock + 1
      });
    } else {
      // delete the section items from add day plan trip popup 
      var delObj = selectedSectionItemsArr
        .map(obj => {
          return obj.objectId;
        })
        .indexOf(objId);

      if (delObj > -1) {
        selectedSectionItemsArr.splice(delObj, 1);
      }
      this.setState({
        selectedSectionItemsArr: selectedSectionItemsArr
      });
    }
    // used to delete Days from the form
    if (locker === "listedSectionItems") {
      let selectedItem = JSON.parse(e.currentTarget.parentNode.value);
      const planTripArrCopy = JSON.parse(JSON.stringify(planTripArr));
      planTripArrCopy.forEach(plan => {
        if (DataDetails.objectId === plan.objectId) {
          plan.days = plan.days.filter(Day => Day.day != selectedItem.day);
        }
      });

      this.setState({
        planTripArr: planTripArrCopy
      });
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
      <body style="font-family: 'Inder' !important;">
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

  updateTrip = async event => {
    event.preventDefault();
    const {
      RichDescriptionValEN,
      RichDescriptionValAR,
      planTripArr,
      DataDetails,
      contentEN,
      contentAR
    } = this.state;
    const data = new FormData(event.target);
    let updatedPlan = this.getPlan(DataDetails.objectId);
    let arrCheck;

    // used in validation for Add day button
    planTripArr.forEach(plan => {
      if (DataDetails.objectId === plan.objectId) {
        arrCheck = Array.isArray(plan.days) && plan.days.length != 0;
      }
    });
    // this condition for validations
    if (
      contentEN !== "<p><br></p>" &&
      contentEN !== null &&
      contentAR !== "<p><br></p>" &&
      contentAR !== null &&
      arrCheck
    ) {
      this.setState({
        ShowErrorHintForRichDescriptionEN: false,
        ShowErrorHintForRichDescriptionAR: false,
        ShowErrorHintForAddDayBtn: false
      });

      DataDetails.days = updatedPlan.days;
      DataDetails.description.en = RichDescriptionValEN;
      DataDetails.description.ar = RichDescriptionValAR;
      try {
        //start spinner
        this.showAndHide(true, "spinner");
        await plannedTripsService.updateTrip(data, DataDetails);
        this.loadPlannedTrips();
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
          errMessage: "Failed To Update Plan Trip"
        });
        //popup error msg
        console.log("Error while loggining in as Admin: ", err);
      }
    } else {
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

      if (!arrCheck) {
        this.setState({
          ShowErrorHintForAddDayBtn: true
        });
      } else {
        this.setState({
          ShowErrorHintForAddDayBtn: false
        });
      }
    }
  };

  getPlan(id) {
    const { planTripArr } = this.state;
    for (let plan of planTripArr) if (plan.objectId === id) return plan;
  }

  async deleteTrip(event) {
    let tripId = event.target.value;
    console.log("tripId: ", tripId);
    try {
      //start spinner
      this.showAndHide(true, "MainSpinner");
      await plannedTripsService.deleteTrip(tripId);
      // stop spinner
      this.showAndHide(false, "MainSpinner");
      //show success alert
      this.showAndHide(true, "deleteAlert");
      this.loadPlannedTrips();
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
  // used the save fields values in the state
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

  // // hide and show add and edit Day plan trip pop up 
  togglePopUpDay = AddPopupLock => {
    const { EditBtnLock, planTripArr } = this.state;

    if (AddPopupLock === "openAddPopup") {
      this.setState({
        selectedSectionItemsArr: []
      });
    } else {
      this.setState({
        selectedSectionItemsArr: planTripArr
      });
    }

    this.setState({
      showPopUp: !this.state.showPopUp,
      dayNumber: null,
      // deleteLock: 0
    });

    if (EditBtnLock) {
      this.setState({
        EditBtnLock: false
      });
    }
  };

  objIncludes(list, obj) {
    for (let item of list) if (item.objectId === obj.objectId) return true;
    return false;
  }
// used to save the day number in the state and check if it existed before or not
  dayPlanTripNumberFun = e => {
    const {
      EditBtnLock,
      planTripArr,
      DataDetails
    } = this.state;

    const planTripArrCopy = JSON.parse(JSON.stringify(planTripArr));
    planTripArrCopy.forEach(plan => {
      if (DataDetails.objectId === plan.objectId) {
        let dayVal = plan.days.findIndex(x => x.day === Number(e.target.value));
        if (dayVal > -1) {
          this.setState({
            disabledDay: true,
            validationMess: true
          });
        } else {
          this.setState({
            disabledDay: false,
            validationMess: false
          });
        }
      }
    });

    this.setState({
      dayNumber: e.target.value
    });
    if (EditBtnLock) {
      this.setState({
        currentDayNum: e.target.value
      });
    }
  };
// used to open Day plan trip popup and list the specific data
  editDayFun = e => {
    console.log("tessst2");
    let EditdayVal = JSON.parse(e.target.value),
      Editdayarr = [];

    EditdayVal.locations.map(val => {
      Editdayarr.push(val);
    });

    this.setState({
      showPopUp: !this.state.showPopUp,
      EditBtnLock: !this.state.EditBtnLock,
      selectedEditdayVal: EditdayVal,
      currentDayNum: EditdayVal.day
    });
  };
// used when click on edit button in day plan trip popup to save the edits in state
  editPopUpFun = () => {
    const {
      selectedSectionItemsArr,
    } = this.state;

    this.setState({
      planTripArr: selectedSectionItemsArr,
      showPopUp: !this.state.showPopUp,
      EditBtnLock: !this.state.EditBtnLock
    });
  };

  toggleDanger = () => {
    this.setState({
      showErrMesgPopUp: !this.state.showErrMesgPopUp
    });
  };

  render() {
    const {
      sectionItems,
      DataDetails,
      editIconStyOnClick,
      alertLock,
      alertMesLock,
      mainLoaderLock,
      loaderLock,
      errMessage,
      ShowErrorHintForRichDescriptionEN,
      ShowErrorHintForRichDescriptionAR,
      ///////
      showPopUp,
      selectedSectionItemsArr,
      validationMess,
      disabled,
      EditBtnLock,
      currentDayNum,
      dayNumber,
      planTripArr,
      disabledDay,
      ShowErrorHintForAddDayBtn
    } = this.state;
    // used to  enabled close (x) icones when the more details popup is disabled
    let disabledIcon = { pointerEvents: "none" },
      enabledIcon = { pointerEvents: "visible" };
    return (
      <div className="animated fadeIn">
        {alertLock && (
          <div className="alertSty">
            <Alert color="success">
              {alertMesLock
                ? " Your Plan Trip Has Been Edited Successfully"
                : " Your Plan Trip Has Been Deleted Successfully"}
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
                <i className="fa fa-align-justify"></i> Current Section Items
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
                      <th>Name</th>
                      {/* <th>Website</th> */}
                      <th>Days</th>
                      <th>Price</th>
                      <th>Details</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planTripArr.map(item => (
                      <tr key={item.objectId}>
                        <td>{item.label.en}</td>
                        <td>{item.days.length}</td>
                        <td>{item.price}</td>
                        <td>
                          <Button
                            color="primary"
                            value={item.objectId}
                            onClick={e => this.togglePopUpFun(e)}
                            className="mr-1"
                          >
                            More Details
                          </Button>
                        </td>
                        <td>
                          <Button
                            color="danger"
                            value={item.objectId}
                            onClick={this.deleteTrip}
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
                        toggle={e =>this.togglePopUpFun(e, "cancelBtn")}
                        className={"modal-lg " + this.props.className}
                      >
                        <ModalHeader
                          toggle={e => this.togglePopUpFun(e, "cancelBtn")}
                        >
                          Plan Trip Details
                        </ModalHeader>
                        <ModalBody>
                          {/* days popup */}
                          <Modal
                            isOpen={showPopUp}
                            toggle={this.togglePopUpDay}
                            className={"modal-primary " + this.props.className}
                          >
                            <ModalHeader toggle={this.togglePopUpDay}>
                              Day Plan Trip
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
                                      placeholder="Enter Day Number"
                                      onChange={e =>
                                        this.dayPlanTripNumberFun(e)
                                      }
                                    />
                                  ) : null}
                                  {validationMess && (
                                    <FormText color="danger">
                                      Day already exist
                                    </FormText>
                                  )}
                                  <br />
                                </Col>
                              </Row>
                              <Row>
                                <Col xs="3" md="3">
                                  <Label htmlFor="text-input">trips</Label>
                                </Col>
                                <Col xs="9">
                                  {EditBtnLock
                                    ? selectedSectionItemsArr.map(plan =>
                                        DataDetails.objectId === plan.objectId
                                          ? plan.days.map(day =>
                                              currentDayNum === day.day
                                                ? day.locations.map(
                                                    sectionItem => (
                                                      <Button
                                                        type="button"
                                                        value={
                                                          sectionItem.objectId
                                                        }
                                                        onClick={e =>
                                                          this.deleteSectionItemFun(
                                                            e
                                                          )
                                                        }
                                                        style={{
                                                          backgroundColor:
                                                            "#fff"
                                                        }}
                                                        className="mr-1 btnResultSty"
                                                      >
                                                        {sectionItem.label.en}
                                                        &nbsp; &nbsp;
                                                        <i className="fa fa-close fa-lg mt-4  closeIconSty"></i>
                                                      </Button>
                                                    )
                                                  )
                                                : null
                                            )
                                          : null
                                      )
                                    : selectedSectionItemsArr.map(Item => (
                                        <Button
                                          type="button"
                                          value={Item.objectId}
                                          onClick={e =>
                                            this.deleteSectionItemFun(e)
                                          }
                                          style={{ backgroundColor: "#fff" }}
                                          className="mr-1 btnResultSty"
                                        >
                                          {Item.label.en}
                                          &nbsp; &nbsp;
                                          <i className="fa fa-close fa-lg mt-4  closeIconSty"></i>
                                        </Button>
                                      ))}
                                </Col>
                              </Row>
                              <Row>
                                <Col xs="3" md="3">
                                  <Label htmlFor="text-input">
                                    Section Items
                                  </Label>
                                </Col>
                                <Col xs="9">
                                  <br />
                                  <Input
                                    type="select"
                                    name="select"
                                    id="select"
                                    onChange={e => this.popUpDropDownVal(e)}
                                  >
                                    <option value="null">
                                      Select a Section Item
                                    </option>
                                    {sectionItems.map(Item => (
                                      <option
                                        value={JSON.stringify({
                                          objectId: Item.objectId,
                                          name: Item.label.en
                                        })}
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
                                    disabledDay ||
                                    dayNumber === null ||
                                    dayNumber === ""
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
                                  color="primary"
                                  onClick={this.editPopUpFun}
                                >
                                  Edit
                                </Button>
                              )}
                              <Button
                                color="secondary"
                                onClick={this.togglePopUpDay}
                              >
                                Cancel
                              </Button>
                            </ModalFooter>
                          </Modal>

                          {/* //////////// */}
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
                            <img
                              src={DataDetails.img.url}
                              alt="plan Trip img"
                            />
                          </Col>
                          <Col xs="12">
                            <Form
                              className="form-horizontal"
                              onSubmit={this.updateTrip}
                            >
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

                              <FormGroup row>
                                <Col md="3">
                                  <Label htmlFor="file-input">
                                    Upload Image
                                  </Label>
                                </Col>
                                <Col xs="12" md="9">
                                  <Input
                                    type="file"
                                    id="file-input"
                                    name="image"
                                    disabled={disabled ? "disabled" : ""}
                                  />
                                  <FormText color="muted">
                                    image size : aspect ratio 25:14 or 375*250
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
                                    disabled={disabled ? "disabled" : ""}
                                    color="primary"
                                    onClick={AddPopupLock =>
                                      this.togglePopUpDay("openAddPopup")
                                    }
                                    className="mr-1"
                                  >
                                    <i className="fa fa-plus "></i> &nbsp; Add
                                  </Button>
                                  &nbsp; &nbsp;
                                  {planTripArr.map(plan =>
                                    DataDetails.objectId === plan.objectId
                                      ? plan.days.map(Day => (
                                          <Button
                                            disabled={
                                              disabled ? "disabled" : ""
                                            }
                                            type="button"
                                            // value={sectionItemSelect}
                                            value={JSON.stringify(Day)}
                                            // onClick={e => this.deleteSectionItemFun(e,"listedSectionItems")}
                                            onClick={e => {
                                              this.editDayFun(e);
                                            }}
                                            style={{ backgroundColor: "#fff" }}
                                            className="mr-1 "
                                          >
                                            Day {Day.day}
                                            &nbsp; &nbsp;
                                            <i
                                              style={
                                                disabled
                                                  ? disabledIcon
                                                  : enabledIcon
                                              }
                                              onClick={e =>
                                                this.deleteSectionItemFun(
                                                  e,
                                                  "listedSectionItems"
                                                )
                                              }
                                              className="fa fa-close fa-lg mt-4  closeIconSty"
                                            ></i>
                                          </Button>
                                        ))
                                      : null
                                  )}
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
                                    id="text-input"
                                    name="price"
                                    placeholder="Enter Price AR"
                                    disabled={disabled ? "disabled" : ""}
                                    value={DataDetails.price}
                                    onChange={event => {
                                      this.handleDataChange(event, "price");
                                    }}
                                  />
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
                                    setContents={DataDetails.description.en}
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
                                    setContents={DataDetails.description.ar}
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
                                  >
                                    Save
                                  </Button>
                                )}
                                <Button
                                  color="secondary"
                                  onClick={e =>
                                    this.togglePopUpFun(e, "cancelBtn")
                                  }
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
