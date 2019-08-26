import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { Paper, Grid, Divider, IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { FormattedMessage, PublishedComponent, YearPicker, MonthPicker } from "@openimis/fe-core";

const styles = theme => ({
    paper: {},
    paperHeader: theme.paper.header,
    paperHeaderTitle: theme.paper.title,
    paperHeaderAction: theme.paper.action,
    paperDivider: theme.paper.divider, form: {
        padding: 0
    },
    item: {
        padding: theme.spacing(1)
    },
    paperDivider: theme.paper.divider,
});

class BatchesLauncher extends Component {

    state = {
        region: null,
        district: null,
        year: null,
        month: null,
    }

    launchBatch = e => {
        console.log("LAUNCH BATCH!");
    }

    render() {
        const { classes } = this.props;
        const min = new Date().getFullYear() - 7;
        const max = min + 9;
        return (
            <Paper className={classes.paper}>
                <Grid container className={classes.paperHeader}>
                    <Grid item xs={11} className={classes.paperHeaderTitle}>
                        <FormattedMessage module="claim" id="BatchesLauncher.title" />
                    </Grid>
                    <Grid item xs={1}>
                        <Grid container justify="flex-end">
                            <Grid item className={classes.paperHeaderAction}>
                                <IconButton onClick={this.launchBatch}>
                                    <SendIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <PublishedComponent
                            id="location.RegionPicker"
                            value={this.state.region}
                            onChange={(v, s) => this.setState({ region: v })}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <PublishedComponent
                            id="location.DistrictPicker"
                            value={this.state.district}
                            onChange={(v, s) => this.setState({ district: v })}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <YearPicker
                            module="claim"
                            label="year"
                            nullLabel="year.select"
                            min={min}
                            max={max}
                            value={this.state.year}
                            onChange={e => this.setState({ year: e })}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <MonthPicker
                            module="claim"
                            label="month"
                            nullLabel="month.select"
                            value={this.state.month}
                            onChange={e => this.setState({ month: e })}
                        />
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

export default injectIntl(withTheme(withStyles(styles)(BatchesLauncher)));