import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import _ from "lodash";
import {
    Grid, Typography, Divider,
    Slider, FormControlLabel, Switch
} from "@material-ui/core";
import { FormattedMessage, DatePicker, PublishedComponent, formatMessage } from "@openimis/fe-core";
import { FEEDBACK_ASSESSMENT } from "../constants";

const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    item: theme.paper.item,
});



class ClaimFeedbackPanel extends Component {

    componentDidMount() {
        this.marks = FEEDBACK_ASSESSMENT.map(value => {
            return {
                value,
                label: formatMessage(this.props.intl, "claim", `Feedback.OverallAssesment.${value}`)
            }
        })
    }

    render() {
        const { classes, edited } = this.props;
        if (!edited.feedback) {
            edited.feedback = {};
        }
        return (
            <Grid container>
                <Grid item xs={12} className={classes.paperHeader}>
                    <Typography variant="h6"><FormattedMessage module="claim" id="Feedback" /></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justify="center">
                        <Grid item xs={3} />
                        <Grid item xs={6} className={classes.item}>
                            <DatePicker
                                module="claim"
                                label="Feedback.Date"
                            />
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={3} />
                        <Grid item xs={6} className={classes.item}>
                            <PublishedComponent
                                id="claim.ClaimOfficerPicker"
                                value={edited.feedback.chfOfficerCode}
                            // onChange={(v, s) => updateAttribute("healthFacility", v)}
                            />
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={3} />
                        <Grid item xs={6} className={classes.item}>
                            <FormControlLabel
                                value="start"
                                control={<Switch color="primary" />}
                                label="Care Rendered"
                                labelPlacement="start"
                            />
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={3} />
                        <Grid item xs={6} className={classes.item}>
                            <FormControlLabel
                                value="start"
                                control={<Switch color="primary" />}
                                label="Payment Asked"
                                labelPlacement="start"
                            />
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={3} />
                        <Grid item xs={6} className={classes.item}>
                            <FormControlLabel
                                value="start"
                                control={<Switch color="primary" value={true} />}
                                label="Drugs Prescribed"
                                labelPlacement="start"
                            />
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={3} />
                        <Grid item xs={6} className={classes.item}>
                            <FormControlLabel
                                value="start"
                                control={<Switch color="primary" />}
                                label="Drugs Received"
                                labelPlacement="start"
                                disabled
                            />
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={12} className={classes.item}>
                            <Divider />
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={6} className={classes.item}>
                            <Typography gutterBottom>
                                Overall Assessment
                                </Typography>
                            <Slider
                                max={5}
                                defaultValue={0}
                                step={1}
                                valueLabelDisplay="auto"
                                marks={this.marks}
                            />
                        </Grid>
                        <Grid item xs={3} />
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default injectIntl(withTheme(withStyles(styles)(ClaimFeedbackPanel)));