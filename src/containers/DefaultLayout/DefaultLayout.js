import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import * as router from "react-router-dom";
import { Container, Alert } from "reactstrap";
import networkService from "../../services/api.js";
import dataService from "../../services/dataService.js";

import "./DefaultLayout.scss"

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav
} from "@coreui/react";
// sidebar nav config
import navigation from "../../_nav";
// routes config
import routes from "../../routes";

const DefaultAside = React.lazy(() => import("./DefaultAside"));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaderLock: false,
      alertLock: false,
    };
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  signOut(e) {
    e.preventDefault();
    localStorage.clear();
    this.props.history.push("/login");
  }
// used to update dashboard data
  async reload(e) {
    e.preventDefault();
    try {
        //start spinner
        this.showAndHide(true, "spinner");
      let dashboardData = await networkService.send("dashboard", null);
      dashboardData = dashboardData.data.result;
      dataService.saveDashboardData(dashboardData);
      window.location.reload();
         // stop spinner
         this.showAndHide(false, "spinner");
    } catch (err) {
      //stop the loading spinner
      this.showAndHide(false, "spinner");
      console.error("Error while Reload Data: ", err);
    }
  }
// used to update app data
  async reloadAppDataFun(e) {
    e.preventDefault();
    try {
        //start spinner
        this.showAndHide(true, "spinner");
         await networkService.sendSilentPush();
         // stop spinner
         this.showAndHide(false, "spinner");
          //show success alert
        this.showAndHide(true, "Alert");
        //hide success alert
        setTimeout(() => {
          this.showAndHide(false, "Alert");
        }, 5000);
    } catch (err) {
      //stop the loading spinner
      this.showAndHide(false, "spinner");
      console.error("Error while Reload App Data: ", err);
    }
  }

  showAndHide = (lock, key) => {
    if (key === "spinner") {
      this.setState({ loaderLock: lock });
    }  else if (key === "Alert") {
      this.setState({ alertLock: lock });
    }
    
  };

  render() {
    const { loaderLock, alertLock } = this.state
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader
              onLogout={e => this.signOut(e)}
              reload={e => this.reload(e)}
              reloadAppData={e => this.reloadAppDataFun(e)}
            />
              {alertLock && (
                <div className="alertSty">
                  <Alert color="success">
                    Your App Data Updated Successfully
                  </Alert>
                </div>
              )}
            {loaderLock && (
              <div className="loaderContainerOneMainReload loaderOneSty">
                <div className="loaderContainerTwoMainReload loaderTwoSty">
                  <div className="loaderMainReload"></div>
                </div>
              </div>
            )}
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav
                navConfig={navigation}
                {...this.props}
                router={router}
              />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => <route.component {...props} />}
                      />
                    ) : null;
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        {/* <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter> */}
      </div>
    );
  }
}

export default DefaultLayout;
