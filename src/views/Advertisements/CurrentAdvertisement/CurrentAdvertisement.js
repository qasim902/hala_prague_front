import React, { useState, useEffect } from "react";
import dataService from "../../../services/dataService.js";

import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  Table,
  TabPane
} from "reactstrap";
import AddAd from "./AddAd.js";
import "./CurrentAdvertisement.scss";
import adService from "../../../services/adService.js";
import { AdTypes } from "./const.js";
import AdTable from "./AdTable.js";

const CurrentAdvertisement = () => {
  const [banners, setBanners] = useState([]);
  const [loaderLock, setLoaderLock] = useState(false);
  const [mainLoaderLock, setMainLoaderLock] = useState(false);
  const [alertLock, setAlertLock] = useState(false);
  const [showErrMesgPopUp, setShowErrMesgPopUp] = useState(false);
  const [errMessage, setErrMessage] = useState(null);
  const [alertMesLock, setAlertMesLock] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  const leaderBoard = banners.filter(banner => banner.type === "Leader Board");
  const mpu = banners.filter(banner => banner.type === "MPU");
  const interstitial = banners.filter(banner => banner.type === "Interstitial");

  const loadCategories = async () => {
    const banners = await adService.getAd();
    setBanners(banners);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const deleteAd = async event => {
    const objectId = event.target.value;
    setMainLoaderLock(true);
    try {
      await adService.deleteAd(objectId);
      setMainLoaderLock(false);
      setAlertLock(true);
      setAlertMesLock(false);
      loadCategories();
    } catch (error) {
      setMainLoaderLock(false);
      setErrMessage(error.message);
      setShowErrMesgPopUp(true);
    }
  };

  const toggleDanger = () => {
    setShowErrMesgPopUp(!showErrMesgPopUp);
  };

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const toggleModal = () => {
    if (activeTab === 1 && leaderBoard.length >= 10) {
      setErrMessage("You can not add more than 10 Leader Board Ads");
      setShowErrMesgPopUp(true);
      return;
    }
    if (activeTab === 2 && mpu.length >= 10) {
      setErrMessage("You can not add more than 10 MPU Ads");
      setShowErrMesgPopUp(true);
      return;
    }
    if (activeTab === 3 && interstitial.length >= 10) {
      setErrMessage("You can not add more than 10 Interstitial Ads");
      setShowErrMesgPopUp(true);
      return;
    }

    setAddOpen(!addOpen);
  };

  return (
    <div className="animated fadeIn">
      {alertLock && (
        <div className="alertSty">
          <Alert color="success">
            {alertMesLock
              ? " Your Banner Has Been Edited Successfully"
              : " Your Banner Has Been Deleted Successfully"}
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
            isOpen={showErrMesgPopUp}
            toggle={toggleDanger}
            className={"modal-danger "}
          >
            <ModalHeader toggle={toggleDanger}>Error Message</ModalHeader>
            <ModalBody>
              {/* Edit failure */}
              {errMessage}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleDanger}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          <Card>
            <CardHeader
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <i className="fa fa-align-justify"></i> Current Ads
              </div>
              <Button size="sm" onClick={toggleModal} color="primary">
                Add Banner
              </Button>
            </CardHeader>
            <CardBody>
              <div>
                <Nav tabs>
                  {AdTypes.map((type, index) => (
                    <NavItem key={index + 1}>
                      <NavLink
                        className={activeTab === index + 1 ? "active" : ""}
                        onClick={() => {
                          toggleTab(index + 1);
                        }}
                      >
                        {type}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </div>
              <TabContent activeTab={activeTab.toString()}>
                <TabPane tabId="1">
                  <AdTable data={leaderBoard} deleteAd={deleteAd} />
                </TabPane>
                <TabPane tabId="2">
                  <AdTable data={mpu} deleteAd={deleteAd} />
                </TabPane>
                <TabPane tabId="3">
                  <AdTable data={interstitial} deleteAd={deleteAd} />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <AddAd
        open={addOpen}
        onClose={toggleModal}
        type={AdTypes[activeTab - 1]}
        onSuccess={loadCategories}
      />
    </div>
  );
};

export default CurrentAdvertisement;
