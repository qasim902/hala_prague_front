import React, { Component } from "react";
import dataService from "../../../services/dataService.js";
import adminService from "../../../services/adminService.js";
import "./Login.scss";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      email: "",
      password: "",
      loaderLock: false,
      showErrMesgPopUp: false,
      errMessage: null
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.toggleDanger = this.toggleDanger.bind(this);
  }

  showAndHide = (lock, key) => {
    if (key === "spinner") {
      this.setState({ loaderLock: lock });
    } else if (key === "errorPopUp") {
      this.setState({ showErrMesgPopUp: lock });
    }
  };

  async handleLogin(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    let { email, password } = dataService.parseForm(
      ["email", "password"],
      data
    );

    try {
      //start spinner
      this.showAndHide(true, "spinner");

      let res = await adminService.login(email, password);
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
        this.props.history.push("/verify-otp");
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
                    <Form onSubmit={this.handleLogin}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="email"
                          placeholder="Email"
                          autoComplete="email"
                          name="email"
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          name="password"
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="12" className="text-center">
                          <Button color="primary" className="px-4">
                            Login
                          </Button>
                        </Col>
                      </Row>
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

export default Login;
