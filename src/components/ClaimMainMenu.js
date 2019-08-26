import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { Keyboard, ScreenShare, Subscriptions, Assignment } from "@material-ui/icons";
import { formatMessage, MainMenuContribution } from "@openimis/fe-core";

class ClaimMainMenu extends Component {
  render() {
    return (
      <MainMenuContribution
        {...this.props}
        header={formatMessage(this.props.intl, "claim", "mainMenu")}
        icon={<ScreenShare />}
        entries={[
          {
            text: formatMessage(this.props.intl, "claim", "menu.healthFacilityClaims"),
            icon: <Keyboard />,
            route: "/claim/healthFacilities"
          },
          {
            text: formatMessage(this.props.intl, "claim", "menu.review"),
            icon: <Assignment />,
            route: "/claim/reviews"
          },
          {
            text: formatMessage(this.props.intl, "claim", "menu.batch"),
            icon: <Subscriptions />,
            route: "/claim/batches"
          }
        ]}
      />
    );
  }
}
export default injectIntl(ClaimMainMenu);
