import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import BatchesLauncher from "../components/BatchesLauncher";
import BatchesSearcher from "../components/BatchesSearcher";
import BatchesPreviewer from "../components/BatchesPreviewer";

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