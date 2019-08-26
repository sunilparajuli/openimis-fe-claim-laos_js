import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { Paper, Grid } from "@material-ui/core";
import { FormattedMessage } from "@openimis/fe-core";

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(1)
    },
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

class BatchesSearcher extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.paper}>
                <Grid container className={classes.paperHeader}>
                    <Grid item xs={12} className={classes.paperHeaderTitle}>
                        <FormattedMessage module="claim" id="BatchesSearcher.title" />
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

export default injectIntl(withTheme(withStyles(styles)(BatchesSearcher)));