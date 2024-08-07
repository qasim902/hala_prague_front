import React, { Component } from "react";
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  FormText
} from "reactstrap";
import "./CurrentStaticPages.scss";
import SunEditor, { buttonList } from "suneditor-react";

import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

import staticPageService from "../../../services/staticPageService.js";

class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staticPagesShow: null,
      visaInfoData: null,
      transportMetroData: null,
      transportBusData: null,
      transportTaxiData: null,
      DataDetailsClone: null,
      RichDescriptionValEN: null,
      RichDescriptionValAR: null,
      alertLock: false,
      loaderLock: false,
      showErrMesgPopUp: false,
      errMessage: null,
      ShowErrorHintForRichDescriptionEN: false,
      ShowErrorHintForRichDescriptionAR: false,
      contentEN: null,
      contentAR: null
    };
  }

  async componentDidMount() {
    // scroll to page top  when load
    window.scrollTo(0, 0);

    let staticPageData = await staticPageService.getStaticPages();
    console.log("stateic =", staticPageData);

    this.setState({
      transportBusData: staticPageData.data.results[2],
      transportTaxiData: staticPageData.data.results[3],
      transportMetroData: staticPageData.data.results[4],
      visaInfoData: staticPageData.data.results[5]
    });
  }

  // async updateStaticPage(event) {
  updateStaticPage = async event => {
    event.preventDefault();
    const data = new FormData(event.target);
    let editedCategory = this.state.DataDetailsClone;

    const {
      RichDescriptionValEN,
      RichDescriptionValAR,
      contentEN,
      contentAR
    } = this.state;
    // this conditions for validations
    if (
      contentEN !== "<p><br></p>" &&
      contentEN !== "<p><br></p><h1><p></p></h1><p></p>" &&
      contentEN !== null &&
      contentAR !== "<p><br></p>" &&
      contentAR !== '<p style="text-align: right; "><br></p>' &&
      contentAR !== null
    ) {
      this.setState({
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
        await staticPageService.updateStaticPage(
          editedCategory,
          data,
          RichDescription
        );
        // stop spinner
        this.showAndHide(false, "spinner");
        //show success alert
        this.showAndHide(true, "editAlert");
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
    } else {
      // this conditions for validations
      if (
        contentEN === "<p><br></p>" ||
        contentEN === "<p><br></p><h1><p></p></h1><p></p>" ||
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
        contentAR === '<p style="text-align: right; "><br></p>' ||
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
    }
  };

  handleDataChange(event, name) {
    let newVal = event.target.value;
    let DisplayOnMapVal = event.target.checked;
    let nameClone = name;
    const { staticPagesShow } = this.state;
    if (Array.isArray(name)) name = "nested";

    this.setState(prevState => {
      let DataDetailsClone = Object.assign({}, prevState.DataDetailsClone),
        visaInfoData = Object.assign({}, prevState.visaInfoData),
        transportMetroData = Object.assign({}, prevState.transportMetroData),
        transportBusData = Object.assign({}, prevState.transportBusData),
        transportTaxiData = Object.assign({}, prevState.transportTaxiData);

      DataDetailsClone[name] = newVal;

      if (staticPagesShow === "visaInfo") {
        visaInfoData[name] = newVal;
      } else if (staticPagesShow === "transportMetro") {
        transportMetroData[name] = newVal;
      } else if (staticPagesShow === "transportBus") {
        transportBusData[name] = newVal;
      } else if (staticPagesShow === "transportTaxi") {
        transportTaxiData[name] = newVal;
      }
      return {
        DataDetailsClone,
        visaInfoData,
        transportMetroData,
        transportBusData,
        transportTaxiData
      };
    });
  }

  showAndHide = (lock, key) => {
    if (key === "spinner") {
      this.setState({ loaderLock: lock });
    } else if (key === "editAlert") {
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

  staticPageFun = e => {
    this.setState(
      {
        staticPagesShow: e.target.value
      },
      () => {
        const {
          staticPagesShow,
          visaInfoData,
          transportMetroData,
          transportBusData,
          transportTaxiData
        } = this.state;
        let staticPageVal, RichDescriptionAR, RichDescriptionEN;

        // scroll to page top  when load
        window.scrollTo(0, 0);

        if (staticPagesShow === "visaInfo" && visaInfoData !== null) {
          staticPageVal = visaInfoData;

          RichDescriptionAR = visaInfoData.description.ar;
          RichDescriptionEN = visaInfoData.description.en;
        } else if (
          staticPagesShow === "transportMetro" &&
          transportMetroData !== null
        ) {
          staticPageVal = transportMetroData;

          RichDescriptionAR = transportMetroData.description.ar;
          RichDescriptionEN = transportMetroData.description.en;
        }
        ///
        else if (
          staticPagesShow === "transportBus" &&
          transportBusData !== null
        ) {
          staticPageVal = transportBusData;

          RichDescriptionAR = transportBusData.description.ar;
          RichDescriptionEN = transportBusData.description.en;
        } else if (
          staticPagesShow === "transportTaxi" &&
          transportTaxiData !== null
        ) {
          staticPageVal = transportTaxiData;

          RichDescriptionAR = transportTaxiData.description.ar;
          RichDescriptionEN = transportTaxiData.description.en;
        }

        this.setState({
          DataDetailsClone: staticPageVal,
          RichDescriptionValAR: RichDescriptionAR,
          RichDescriptionValEN: RichDescriptionEN
        });
      }
    );
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

  render() {
    const {
      staticPagesShow,
      visaInfoData,
      transportMetroData,
      transportBusData,
      transportTaxiData,
      alertLock,
      loaderLock,
      showErrMesgPopUp,
      ShowErrorHintForRichDescriptionEN,
      ShowErrorHintForRichDescriptionAR,
      contentEN,
      contentAR
    } = this.state;

    return (
      <div className="animated fadeIn">
        {alertLock && (
          <div className="alertSty">
            <Alert color="success">
              Your Static Page Has Been Edited Successfully
            </Alert>
          </div>
        )}
        <Row>
          <Col xs="12">
            {/* Main spinner */}
            {loaderLock && (
              <div className="loaderContainerOne">
                <div className="loaderContainerTwoMain">
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
              <ModalBody>Edit failure</ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.toggleDanger}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Static Page
              </CardHeader>
              <CardBody>
                <Form
                  className="form-horizontal"
                  onSubmit={this.updateStaticPage}
                >
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="select"> Static Page</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="select"
                        name="section"
                        onChange={e => {
                          this.staticPageFun(e);
                        }}
                      >
                        <option>Choose Static Page </option>
                        <option value="visaInfo">visaInfo</option>
                        <option value="transportMetro">transportMetro </option>
                        <option value="transportBus">transportBus</option>
                        <option value="transportTaxi">transportTaxi </option>
                      </Input>
                    </Col>
                  </FormGroup>
                  {staticPagesShow === "visaInfo" && visaInfoData !== null ? (
                    <div>
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
                            setContents={visaInfoData.description.en}
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
                            lang="en"
                            onChange={this.RichDescriptionARChangeFun}
                            name="RichDescriptionEn"
                            setOptions={{
                              height: 200,
                              buttonList: buttonList.complex
                            }}
                            setContents={visaInfoData.description.ar}
                          />
                          {ShowErrorHintForRichDescriptionAR && (
                            <FormText color="danger">Required</FormText>
                          )}
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col md="3">
                          <Label htmlFor="file-input">Upload Image</Label>
                        </Col>
                        <Col xs="12" md="3">
                          <Input
                            type="file"
                            name="img"
                            required={
                              visaInfoData.img !== null &&
                              visaInfoData.img !== undefined
                                ? false
                                : true
                            }
                          />
                          <FormText color="muted">
                            image size : aspect ratio 25:14 or 375*250
                          </FormText>
                        </Col>
                        <Col xs="12" md="3">
                          <img
                            src={visaInfoData.img.url}
                            alt="visa Info Image"
                            className="imageStyl"
                          />
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Col md="3">
                          <Label htmlFor="text-input">website Link</Label>
                        </Col>
                        <Col xs="12" md="9">
                          <Input
                            type="text"
                            name="websiteLink"
                            placeholder="Enter website Link"
                            required
                            value={visaInfoData.websiteLink}
                            onChange={event => {
                              this.handleDataChange(event, "websiteLink");
                            }}
                          />
                        </Col>
                      </FormGroup>
                    </div>
                  ) : null}
                  {staticPagesShow === "transportMetro" &&
                    transportMetroData !== null && (
                      <div>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="file-input">Upload Image</Label>
                          </Col>
                          <Col xs="12" md="3">
                            <Input
                              type="file"
                              name="img"
                              required={
                                transportMetroData.img !== null &&
                                transportMetroData.img !== undefined
                                  ? false
                                  : true
                              }
                            />
                            <FormText color="muted">
                              image size : aspect ratio 25:14 or 375*250
                            </FormText>
                          </Col>
                          <Col xs="12" md="3">
                            <img
                              src={transportMetroData.img.url}
                              alt="visa Info Image"
                              className="imageStyl"
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
                              lang="en"
                              onChange={this.RichDescriptionEGChangeFun}
                              name="RichDescriptionEn"
                              setOptions={{
                                height: 200,
                                buttonList: buttonList.complex
                              }}
                              setContents={transportMetroData.description.en}
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
                              lang="en"
                              onChange={this.RichDescriptionARChangeFun}
                              name="RichDescriptionEn"
                              setOptions={{
                                height: 200,
                                buttonList: buttonList.complex
                              }}
                              setContents={transportMetroData.description.ar}
                            />
                            {ShowErrorHintForRichDescriptionAR && (
                              <FormText color="danger">Required</FormText>
                            )}
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Phone</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input
                              type="text"
                              name="phone"
                              placeholder="Enter Phone Number"
                              value={transportMetroData.phone}
                              required
                              onChange={event => {
                                this.handleDataChange(event, "phone");
                              }}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Get There</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input
                              type="text"
                              name="websiteLink"
                              placeholder="Enter Website Link"
                              value={transportMetroData.websiteLink}
                              required
                              onChange={event => {
                                this.handleDataChange(event, "websiteLink");
                              }}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Website</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input
                              type="text"
                              name="link2"
                              placeholder="Enter Website Link"
                              value={transportMetroData.link2}
                              required
                              onChange={event => {
                                this.handleDataChange(event, "link2");
                              }}
                            />
                          </Col>
                        </FormGroup>
                      </div>
                    )}
                  {/* ////////// */}
                  {staticPagesShow === "transportBus" &&
                    transportBusData !== null && (
                      <div>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="file-input">Upload Image</Label>
                          </Col>
                          <Col xs="12" md="3">
                            <Input
                              type="file"
                              name="img"
                              required={
                                transportBusData.img !== null &&
                                transportBusData.img !== undefined
                                  ? false
                                  : true
                              }
                            />
                            <FormText color="muted">
                              image size : aspect ratio 25:14 or 375*250
                            </FormText>
                          </Col>
                          <Col xs="12" md="3">
                            <img
                              src={transportBusData.img.url}
                              alt="transport Bus Image"
                              className="imageStyl"
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
                              lang="en"
                              onChange={this.RichDescriptionEGChangeFun}
                              name="RichDescriptionEn"
                              setOptions={{
                                height: 200,
                                buttonList: buttonList.complex
                              }}
                              setContents={transportBusData.description.en}
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
                              lang="en"
                              onChange={this.RichDescriptionARChangeFun}
                              name="RichDescriptionEn"
                              setOptions={{
                                height: 200,
                                buttonList: buttonList.complex
                              }}
                              setContents={transportBusData.description.ar}
                            />
                            {ShowErrorHintForRichDescriptionAR && (
                              <FormText color="danger">Required</FormText>
                            )}
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Phone</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input
                              type="text"
                              name="phone"
                              placeholder="Enter Phone Number"
                              value={transportBusData.phone}
                              required
                              onChange={event => {
                                this.handleDataChange(event, "phone");
                              }}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Get There</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input
                              type="text"
                              name="websiteLink"
                              placeholder="Enter website Link"
                              value={transportBusData.websiteLink}
                              required
                              onChange={event => {
                                this.handleDataChange(event, "websiteLink");
                              }}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Website</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input
                              type="text"
                              name="link2"
                              placeholder="Enter Website Link"
                              value={transportBusData.link2}
                              required
                              onChange={event => {
                                this.handleDataChange(event, "link2");
                              }}
                            />
                          </Col>
                        </FormGroup>
                      </div>
                    )}
                  {/* /*............. */}
                  {staticPagesShow === "transportTaxi" &&
                    transportTaxiData !== null && (
                      <div>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="file-input">Upload Image</Label>
                          </Col>
                          <Col xs="12" md="3">
                            <Input
                              type="file"
                              name="img"
                              required={
                                transportTaxiData.img !== null &&
                                transportTaxiData.img !== undefined
                                  ? false
                                  : true
                              }
                            />
                            <FormText color="muted">
                              image size : aspect ratio 25:14 or 375*250
                            </FormText>
                          </Col>
                          <Col xs="12" md="3">
                            <img
                              src={transportTaxiData.img.url}
                              alt="transport Taxi Image"
                              className="imageStyl"
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
                              lang="en"
                              onChange={this.RichDescriptionEGChangeFun}
                              name="RichDescriptionEn"
                              setOptions={{
                                height: 200,
                                buttonList: buttonList.complex
                              }}
                              setContents={transportTaxiData.description.en}
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
                              lang="en"
                              onChange={this.RichDescriptionARChangeFun}
                              name="RichDescriptionEn"
                              setOptions={{
                                height: 200,
                                buttonList: buttonList.complex
                              }}
                              setContents={transportTaxiData.description.ar}
                            />
                            {ShowErrorHintForRichDescriptionAR && (
                              <FormText color="danger">Required</FormText>
                            )}
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Phone</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input
                              type="text"
                              name="phone"
                              placeholder="Enter Phone Number"
                              value={transportTaxiData.phone}
                              required
                              onChange={event => {
                                this.handleDataChange(event, "phone");
                              }}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Get There</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input
                              type="text"
                              name="websiteLink"
                              placeholder="Enter website Link"
                              value={transportTaxiData.websiteLink}
                              required
                              onChange={event => {
                                this.handleDataChange(event, "websiteLink");
                              }}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="text-input">Website</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input
                              type="text"
                              name="link2"
                              placeholder="Enter Website Link"
                              value={transportTaxiData.link2}
                              required
                              onChange={event => {
                                this.handleDataChange(event, "link2");
                              }}
                            />
                          </Col>
                        </FormGroup>
                      </div>
                    )}
                  <ModalFooter>
                    <Button color="primary" type="submit">
                      Save
                    </Button>
                    <Button color="secondary" onClick={this.togglePopUpFun}>
                      Cancel
                    </Button>
                  </ModalFooter>
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
