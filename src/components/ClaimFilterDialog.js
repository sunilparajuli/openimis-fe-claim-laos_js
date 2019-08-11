import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import { Dialog, DialogTitle, Divider, Button, DialogActions, DialogContent } from "@material-ui/core";
import { FormattedMessage } from "@openimis/fe-core";
import ClaimFilter from "./ClaimFilter";

const styles = theme => ({
    dialogTitle: theme.dialog.title,
    dialogContent: theme.dialog.content,
});


class ClaimFilterDialog extends Component {

    keysFunction = event => {
        if (event.keyCode === 27) {
            this.props.onClose();
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.keysFunction, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keysFunction, false);
    }

    render() {
        const { classes, onClose, open, apply } = this.props;
        return (
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth="lg"
            >
                <DialogTitle className={classes.dialogTitle} id="form-dialog-title">
                    <FormattedMessage module="claim" id="search.dialog.title" />
                </DialogTitle>
                <Divider />
                <DialogContent className={classes.dialogContent}>
                    <ClaimFilter {...this.props} />
                </DialogContent>                
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        <FormattedMessage module="claim" id="close" />
                    </Button>
                    <Button onClick={apply} color="primary">
                        <FormattedMessage module="claim" id="search.apply" />
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withTheme(withStyles(styles)(ClaimFilterDialog));