import React, { Component } from "react";
import OtpInput from "react-otp-input";
import adminService from "../../../services/adminService.js";
import dataService from "../../../services/dataService.js";
import "./VerifyOtp.scss";

import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap";

class VerifyOtp extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      otp: "",
      email: "",
      loaderLock: false,
      showErrMesgPopUp: false,
      errMessage: null
    };

    this.handleVerifyOtp = this.handleVerifyOtp.bind(this);
    this.toggleDanger = this.toggleDanger.bind(this);
  }

  showAndHide = (lock, key) => {
    if (key === "spinner") {
      this.setState({ loaderLock: lock });
    } else if (key === "errorPopUp") {
      this.setState({ showErrMesgPopUp: lock });
    }
  };

  // component did mount
  async componentDidMount() {
    let email = JSON.parse(localStorage.getItem("email"));
    if (email) {
      this.setState({ email });
    }
  }

  // remove on unmount
  componentWillUnmount() {
    localStorage.removeItem("verificationCode");
  }

  async handleVerifyOtp(event) {
    event.preventDefault();

    let { otp } = this.state;

    try {
      //start spinner
      this.showAndHide(true, "spinner");

      let res = await adminService.verifyOtp(otp);
      if (res) {
        //stop spinner
        this.showAndHide(false, "spinner");
        //show error message popup
        this.showAndHide(true, "errorPopUp");
        this.setState({
          errMessage: res.msg
        });
      } else {
        //stop the loading spinner
        this.showAndHide(false, "spinner");
        //redirect over current categories
        this.props.history.push("/category/CurrentCategories");
      }
    } catch (err) {
      //stop the loading spinner
      this.showAndHide(false, "spinner");
      //show error message popup
      this.showAndHide(true, "errorPopUp");
      this.setState({
        errMessage: "Error while logging in"
      });
      //popup error msg
      console.error("Error while loggining in as Admin: ", err);
    }
  }

  toggleDanger() {
    this.setState({
      showErrMesgPopUp: !this.state.showErrMesgPopUp
    });
  }

  render() {
    const { loaderLock, errMessage, showErrMesgPopUp } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          {/* spinner */}
          {loaderLock && (
            <div className="loaderContainerOne">
              <div className="loaderContainerTwo">
                <div className="loader"></div>
              </div>
            </div>
          )}
          <Row className="justify-content-center">
            <Col md="8">
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
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleVerifyOtp}>
                      <h1>OTP Verification</h1>
                      <p className="text-muted">
                        We have sent you an OTP on <b>{this.state.email}</b>. <br />
                        Please enter the OTP to login.
                      </p>
                      <div className="otp-input-field">
                        <OtpInput
                          value={this.state.otp}
                          onChange={otp => this.setState({ otp })}
                          numInputs={6}
                          renderSeparator={<span></span>}
                          renderInput={props => <input {...props} />}
                        />
                      </div>
                      <Button color="primary" className="px-4">
                        Verify
                      </Button>
                    </Form>
                  </CardBody>
                </Card>
                <Card
                  className="text-white bg-primary py-5 d-md-down-none "
                  style={{ width: "44%" }}
                >
                  <CardBody
                    style={{ display: "flex", "align-items": "center" }}
                    className="text-center"
                  >
                    <div>
                      <h2>Warning!</h2>
                      <p>
                        This is website can only be accessed by System Admins
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default VerifyOtp;
