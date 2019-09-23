import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import _ from "lodash";
import {
    Grid, Typography, Divider,
    Slider, Switch
} from "@material-ui/core";
import { FormattedMessage, PublishedComponent, formatMessage, decodeId } from "@openimis/fe-core";
import { FEEDBACK_ASSESSMENTS } from "../constants";

const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    item: theme.paper.item,
    tristate: {
        width: "200px",
    },
    assessment: {
        width: "480px",
    }    
});



class ClaimFeedbackPanel extends Component {

    constructor(props) {
        super(props);
        this.tristateMarks = [-1, 0, 1].map(value => {
            return {
                value,
                label: formatMessage(props.intl, "claim", `Feedback.Tristate.${value}`)
            }
        })
        this.marks = FEEDBACK_ASSESSMENTS.map(value => {
            return {
                value,
                label: formatMessage(props.intl, "claim", `Feedback.OverallAssesment.${value}`)
            }
        })
    }

    _toggleField = (field, v) => {
        if (this.props.edited.feedback[field] === undefined) {
            this.props.edited.feedback[field] = v
            this.props.updateAttribute("feedback", this.props.edited.feedback);
        }
    }

    _onChange = (attr, v) => {
        this.props.edited.feedback[attr] = v
        this.props.updateAttribute("feedback", this.props.edited.feedback);
    }

    _onTristateChange = (f, value) => {
        switch (value) {
            case -1:
                this._onChange(f, null);
                break;
            case 0:
                this._onChange(f, false);
                break;
            case 1:
                this._onChange(f, true);
                break;
        }

    }

    _mapTristateValue = v => {
        switch (v) {
            case null:
                return -1;
            case undefined:
                return -1;
            case false:
                return 0;
            case true:
                return 1;
        }
    }

    _mapAssessmentValue = v => {
        switch (v) {
            case null:
                return -1;
            case undefined:
                return -1;
            default:
                return v;
        }
    }

    _tristate = f => (
        <Grid container alignItems="center" justify="center" direction="column">
            <Grid item>
                <FormattedMessage module="claim" id={`Feedback.${f}`} />
            </Grid>
            <Grid>
                <Slider className={this.props.classes.tristate}
                    min={-1}
                    max={1}
                    step={1}
                    value={this._mapTristateValue(this.props.edited.feedback[f])}
                    defaultValue={0}
                    valueLabelDisplay="off"
                    marks={this.tristateMarks}
                    onChange={(e, v) => this._onTristateChange(f, v)}
                />
            </Grid>
        </Grid>
    )

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
                        <Grid item xs={3} className={classes.item}>
                            <PublishedComponent id="core.DatePicker"
                                module="claim"
                                label="Feedback.date"
                                value={edited.feedback.feedbackDate || null}
                                onChange={d => this._onChange("feedbackDate", `${d}T00:00:00`)}
                            />
                        </Grid>
                        <Grid item xs={3} className={classes.item}>
                            <PublishedComponent
                                id="claim.ClaimOfficerPicker"
                                value={edited.feedback.chfOfficerCode}
                                onChange={(v, s) => this._onChange("chfOfficerCode", !!v ? decodeId(v.id) : null)}
                            />
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={3} />
                        <Grid item xs={3} className={classes.item}>
                            {this._tristate('careRendered')}
                        </Grid>
                        <Grid item xs={3} className={classes.item}>
                            {this._tristate('drugPrescribed')}
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={3} />
                        <Grid item xs={3} className={classes.item}>
                            {this._tristate('paymentAsked')}
                        </Grid>
                        <Grid item xs={3} className={classes.item}>
                            {this._tristate('drugReceived')}
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={12} className={classes.item}>
                            <Divider />
                        </Grid>
                        <Grid item xs={2} />
                        <Grid item xs={8} className={classes.item}>
                            <Grid container alignItems="center" justify="center" direction="column">
                                <Grid item className={classes.assessmentContainer}>
                                    <Typography gutterBottom>
                                        <FormattedMessage module="claim" id="Feedback.overallAssesment" />
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Slider className={classes.assessment}
                                        min={-1}
                                        max={!!this.marks ? this.marks.length - 2 : -1}
                                        step={1}
                                        value={this._mapAssessmentValue(edited.feedback.asessment)}
                                        defaultValue={-1}
                                        valueLabelDisplay="off"
                                        marks={this.marks}
                                        onChange={(e, v) => this._onChange('asessment', v)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={2} />
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default injectIntl(withTheme(withStyles(styles)(ClaimFeedbackPanel)));