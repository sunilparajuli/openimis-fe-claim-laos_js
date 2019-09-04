import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import _ from "lodash";
import {
    Grid, Typography, Divider,
    Slider, Switch
} from "@material-ui/core";
import { FormattedMessage, DatePicker, PublishedComponent, formatMessage, decodeId } from "@openimis/fe-core";
import { FEEDBACK_ASSESSMENTS } from "../constants";

const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    item: theme.paper.item,
});



class ClaimFeedbackPanel extends Component {

    componentDidMount() {
        this.marks = FEEDBACK_ASSESSMENTS.map(value => {
            return {
                value,
                label: formatMessage(this.props.intl, "claim", `Feedback.OverallAssesment.${value}`)
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

    _controlledSwitch = f => this.props.edited.feedback[f] === undefined ?
        <Grid container alignItems="center" justify="center" onClick={e => this._toggleField(f, false)}>
            <Grid item>
                <FormattedMessage module="claim" id={`Feedback.${f}`} />
            </Grid>
            <Grid item>
                <Switch
                    color="primary"
                    checked={false}
                    disabled
                />
            </Grid>
        </Grid>
        :
        <Grid container alignItems="center" justify="center">
            <Grid item>
                <FormattedMessage module="claim" id={`Feedback.${f}`} />
            </Grid>
            <Grid item>
                <Switch
                    color="primary"
                    checked={this.props.edited.feedback[f]}
                    onChange={e => this._onChange(f, e.target.checked)}
                    disabled={this.props.edited.feedback[f] === undefined}
                />
            </Grid>
        </Grid>

    render() {
        const { intl, classes, edited } = this.props;
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
                            <DatePicker
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
                            {this._controlledSwitch('careRendered')}
                        </Grid>
                        <Grid item xs={3} className={classes.item}>
                            {this._controlledSwitch('drugPrescribed')}
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={3} />
                        <Grid item xs={3} className={classes.item}>
                            {this._controlledSwitch('paymentAsked')}
                        </Grid>
                        <Grid item xs={3} className={classes.item}>
                            {this._controlledSwitch('drugReceived')}
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={12} className={classes.item}>
                            <Divider />
                        </Grid>
                        <Grid item xs={3} />
                        <Grid item xs={6} className={classes.item}>
                            <Typography gutterBottom>
                                <FormattedMessage module="claim" id="Feedback.overallAssesment" />
                            </Typography>
                            {edited.feedback.asessment === undefined && (
                                <Slider
                                    max={!!this.marks ? this.marks.length - 1 : 0}
                                    step={1}
                                    valueLabelDisplay="auto"
                                    marks={this.marks}
                                    disabled
                                    onClick={e => this._toggleField('asessment', 0)}
                                />
                            )}
                            {edited.feedback.asessment !== undefined && (
                                <Slider
                                    max={!!this.marks ? this.marks.length - 1 : 0}
                                    step={1}
                                    value={edited.feedback.asessment}
                                    defaultValue={0}
                                    valueLabelDisplay="auto"
                                    marks={this.marks}                                    
                                    onChange={(e, v) => this._onChange('asessment', v)}
                                />
                            )}

                        </Grid>
                        <Grid item xs={3} />
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default injectIntl(withTheme(withStyles(styles)(ClaimFeedbackPanel)));