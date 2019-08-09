import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import _ from "lodash";
import { Dialog, DialogTitle, Divider, Button, DialogActions, DialogContent, Tabs, Tab, Grid, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import {
    formatMessage, chipText, chipSelect,
    DatePicker, FormattedMessage, InputSelect, InputText
} from "@openimis/fe-core";
import ClaimAdminSelect from "./ClaimAdminSelect";
import ClaimStatusSelect from "./ClaimStatusSelect";

const styles = theme => ({
    dialogTitle: theme.dialog.title,
    dialogContent: theme.dialog.content,
    form: {
        padding: theme.spacing(1)
    },
    formItem: {
        padding: theme.spacing(1)
    },
});

const StyledTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        color: theme.palette.primary.main,
        '&:hover': {
            color: theme.palette.primary.main,
            fontWeight: theme.typography.fontWeightMedium,
            opacity: 1,
        },
        '&$selected': {
            color: theme.palette.primary.main,
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: theme.palette.primary.main,
        },
    },
    selected: {},
}))(props => <Tab disableRipple {...props} />);

const StyledTabs = withStyles({
    root: {
        borderBottom: '1px solid #e8e8e8',
    },
    indicator: {
        backgroundColor: '#1890ff',
    },
})(Tabs);


class TabLocation extends Component {
    render() {
        return "TAB LOCATION";
    }
}

class TabDetails extends Component {
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
        const { intl, classes, filters, change } = this.props;
        return (
            <Grid container className={classes.form}>
                <Grid item xs={4} className={classes.item}>
                    <ClaimAdminSelect
                        onClaimAdminSelected={(v, s) => change(
                            'claimAdmin', v,
                            chipText(intl, "claim", "ClaimFilterDialog.details.claimAdmin", s)
                        )}
                    />
                </Grid>
                <Grid item xs={4} className={classes.formItem}>
                    <ClaimStatusSelect
                        name="claimStatus"
                        value={(filters['claimStatus'] && filters['claimStatus']['value']) || null}
                        onChange={v => change(
                            'claimStatus', v,
                            chipSelect(intl, "claim", "claimStatus", v),
                            `status: ${v}`
                        )}
                    />
                </Grid>
                <Grid item xs={4} className={classes.formItem}>
                    <InputText
                        module="claim" label="ClaimFilterDialog.details.claimNo"
                        name="claimNo"
                        value={(filters['claimNo'] && filters['claimNo']['value']) || null}
                        onChange={v => change(
                            'claimNo', v,
                            chipText(intl, "claim", "ClaimFilterDialog.details.claimNo", v)
                        )}
                    />
                </Grid>
            </Grid>
        )
    }
}

class TabDates extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid container className={classes.form}>
                <Grid item xs={4} className={classes.item}>
                    <DatePicker
                        module="claim"
                        label="ClaimFilterDialog.visitDateFrom.label"
                        onChange={d => change(
                            'visitDateFrom',
                            !!d && d.toISOString().subString(0, 10))} />
                </Grid>
            </Grid>
        );
    }
}

class ClaimFilterDialog extends Component {
    state = {
        filters: {},
        filterTab: 1,
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!_.isEqual(prevState.filters, this.props.filters)) {
            this.setState({
                filters: this.props.filters,
            });
        }
    }

    handleTabChange = (e, t) => {
        this.setState({
            filterTab: t
        })
    }

    handleFilterChange = (id, value, chip, filter) => {
        let fltrs = this.state.filters;
        fltrs[id] = { value, chip, filter };
        this.setState({
            filters: fltrs
        })
    }

    render() {
        const { intl, classes, onClose, open, apply } = this.props;
        return (
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth="lg"
            >
                <DialogTitle className={classes.dialogTitle} id="form-dialog-title">
                    <FormattedMessage module="claim" id="searchCriteria.dialog.title" />
                </DialogTitle>
                <Divider />
                <DialogContent className={classes.dialogContent}>
                    <StyledTabs
                        className={classes.tabs}
                        value={this.state.filterTab}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={this.handleTabChange}
                        variant="fullWidth"
                    >
                        <StyledTab label={formatMessage(intl, "claim", "ClaimFilterDialog.tab.location")} />
                        <StyledTab label={formatMessage(intl, "claim", "ClaimFilterDialog.tab.details")} />
                        <StyledTab label={formatMessage(intl, "claim", "ClaimFilterDialog.tab.dates")} />
                    </StyledTabs>
                    <form className={classes.container} noValidate autoComplete="off">
                        {this.state.filterTab === 0 && <TabLocation {...this.props} filters={this.state.filters} change={this.handleFilterChange} />}
                        {this.state.filterTab === 1 && <TabDetails {...this.props} filters={this.state.filters} change={this.handleFilterChange} />}
                        {this.state.filterTab === 2 && <TabDates {...this.props} filters={this.state.filters} change={this.handleFilterChange} />}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        <FormattedMessage module="claim" id="close" />
                    </Button>
                    <Button onClick={e => apply(this.state.filters)} color="primary">
                        <FormattedMessage module="claim" id="apply" />
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default injectIntl(withTheme(withStyles(styles)(ClaimFilterDialog)));