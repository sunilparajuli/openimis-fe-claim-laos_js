import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import BatchesLauncher from "./BatchesLauncher";
import BatchesSearcher from "./BatchesSearcher";
import BatchesPreviewer from "./BatchesPreviewer";
import { Grid } from "@material-ui/core";

const styles = theme => ({

});

class BatchesPage extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <BatchesLauncher />
                <BatchesSearcher />
                <BatchesPreviewer />
            </Fragment>
        )
    }
}

export default withTheme(withStyles(styles)(BatchesPage));