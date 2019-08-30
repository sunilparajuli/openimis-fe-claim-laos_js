import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { Keyboard, ScreenShare, Assignment } from "@material-ui/icons";
import { formatMessage, MainMenuContribution } from "@openimis/fe-core";

const CLAIM_MAIN_MENU_CONTRIBUTION_KEY = "claim.MainMenu";

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
          ...this.props.modulesManager.getContribs(CLAIM_MAIN_MENU_CONTRIBUTION_KEY)
        ]}
      />
    );
  }
}
export default injectIntl(ClaimMainMenu);
