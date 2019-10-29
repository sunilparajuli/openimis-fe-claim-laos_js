import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import FileIcon from "@material-ui/icons/Search";
import {
    Dialog, DialogTitle, Divider, Button,
    DialogActions, DialogContent, Link, IconButton
} from "@material-ui/core";
import {
    FormattedMessage, withModulesManager, ProgressOrError, Table, TextInput,
    PublishedComponent,
    formatMessage, formatMessageWithValues,
    journalize, coreConfirm, decodeId
} from "@openimis/fe-core";
import { fetchClaimAttachments, downloadAttachment, deleteAttachment, createAttachment } from "../actions";
import { RIGHT_ADD } from "../constants";

const styles = theme => ({
    dialogTitle: theme.dialog.title,
    dialogContent: theme.dialog.content,
});

class AttachmentsDialog extends Component {
    state = {
        open: false,
        claimUuid: null,
        claimAttachments: [],
        attachmentToDelete: null,
        title: "",
        type: "",
        date: null,
        filename: null,
        mime: null,
        document: null,
    }

    componentDidUpdate(prevProps, props, snapshot) {
        if (!_.isEqual(prevProps.claimAttachments, this.props.claimAttachments)) {
            var claimAttachments = [...(this.props.claimAttachments || [])]
            if (!this.props.readOnly && this.props.rights.includes(RIGHT_ADD)) {
                claimAttachments.push({});
            }
            this.setState({ claimAttachments });
        } else if (!_.isEqual(prevProps.claim, this.props.claim) && !!this.props.claim) {
            this.props.fetchClaimAttachments(this.props.claim);
            this.setState({ open: true, claimUuid: this.props.claim.uuid });
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            var claimAttachments = [...this.state.claimAttachments];
            if (!!this.state.attachmentToDelete) {
                claimAttachments = claimAttachments.filter(a => a.id !== this.state.attachmentToDelete.id)
            } else if (!!this.state.document) {
                claimAttachments.pop()
                claimAttachments.push({
                    title: this.state.title,
                    type: this.state.type,
                    date: this.state.date,
                    filename: this.state.filename,
                },
                    {}
                );
            }
            this.setState(
                {
                    claimAttachments,
                    attachmentToDelete: null,
                    title: "",
                    type: "",
                    date: null,
                    filename: null,
                    mime: null,
                    document: null,
                }
            )
            // called from ClaimForm!
            // this.props.journalize(this.props.mutation);
        } else if (prevProps.confirmed !== this.props.confirmed && !!this.props.confirmed && !!this.state.attachmentToDelete) {
            this.props.deleteAttachment(
                this.state.attachmentToDelete,
                formatMessageWithValues(this.props.intl, "claim", "claim.ClaimAttachment.delete.mutationLabel", {
                    file: `${this.state.attachmentToDelete.title} (${this.state.attachmentToDelete.filename})`,
                    code: `${this.props.claim.code}`
                }))
        }
    }

    onClose = () => this.setState({ open: false },
        e => !!this.props.close && this.props.close())

    delete = a => {
        this.setState(
            { attachmentToDelete: a },
            e => this.props.coreConfirm(
                formatMessage(this.props.intl, "claim", "deleteClaimAttachment.confirm.title"),
                formatMessageWithValues(this.props.intl, "claim", "deleteClaimAttachment.confirm.message",
                    {
                        file: `${a.title} (${a.filename})`,
                    }),
            ))
    }

    addAttachment = e => {
        this.props.createAttachment(
            this.state,
            formatMessageWithValues(this.props.intl, "claim", "claim.ClaimAttachment.create.mutationLabel", {
                file: `${this.state.title} (${this.state.filename})`,
                code: `${this.props.claim.code}`
            }))
    }

    download = a => {
        this.props.downloadAttachment(a)
    }

    fileSelected = fileSelected => {
        if (!!fileSelected.target.files) {
            const file = fileSelected.target.files[0];
            this.setState({
                filename: file.name,
                mime: file.type,
            },
                e => {
                    var reader = new FileReader();
                    reader.onloadend = loaded => {
                        this.setState(
                            { document: btoa(loaded.target.result) },
                            this.addAttachment
                        )
                    }
                    reader.readAsBinaryString(file);
                })
        }
    }

    render() {
        const { classes, claim, readOnly = false,
            fetchingClaimAttachments, fetchedClaimAttachments, errorClaimAttachments } = this.props;
        const { open, claimAttachments } = this.state;
        if (!claim) return null;
        var headers = [
            "claimAttachment.type",
            "claimAttachment.title",
            "claimAttachment.date",
            "claimAttachment.fileName"
        ]
        var itemFormatters = [
            a => !!a.id ? <Link onClick={e => this.download(a)}>{a.type || ""}</Link> :
                !!a.filename ? a.type :
                    <TextInput onChange={v => this.setState({ type: v })} value={this.state.type} />,
            a => !!a.filename ? <Link onClick={e => this.download(a)}>{a.title || ""}</Link> :
                !!a.filename ? a.title :
                    <TextInput onChange={v => this.setState({ title: v })} value={this.state.title} />,
            a => !!a.id ? <Link onClick={e => this.download(a)}>{a.date || ""}</Link> :
                !!a.filename ? a.date :
                    <PublishedComponent id="core.DatePicker"
                        value={this.state.date}
                        onChange={d => this.setState({ date: d })}
                    />,
            a => !!a.id ? <Link onClick={e => this.download(a)}>{a.filename || ""}</Link> :
                !!a.filename ? a.filename :
                    <IconButton
                        variant="contained"
                        component="label"
                    >
                        <FileIcon />
                        <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={this.fileSelected}
                        />
                    </IconButton>,
        ];
        if (!readOnly) {
            headers.push("claimAttachment.delete");
            itemFormatters.push(
                a => !!a.id ? <IconButton onClick={e => this.delete(a)}><DeleteIcon /></IconButton> : ""
            )
        }
        return (
            <Dialog
                open={open}
                fullWidth={true}
            >
                <DialogTitle className={classes.dialogTitle}>
                    <FormattedMessage module="claim" id="attachments.title" values={{ 'code': claim.code }} />
                </DialogTitle>
                <Divider />
                <DialogContent className={classes.dialogContent}>
                    <ProgressOrError progress={fetchingClaimAttachments} error={errorClaimAttachments} />
                    {!!fetchedClaimAttachments && (
                        <Table
                            module="claim"
                            items={claimAttachments}
                            headers={headers}
                            itemFormatters={itemFormatters}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onClose} color="primary">
                        <FormattedMessage module="claim" id="close" />
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    confirmed: state.core.confirmed,
    submittingMutation: state.claim.submittingMutation,
    mutation: state.claim.mutation,
    fetchingClaimAttachments: state.claim.fetchingClaimAttachments,
    fetchedClaimAttachments: state.claim.fetchedClaimAttachments,
    errorClaimAttachments: state.claim.errorClaimAttachments,
    claimAttachments: state.claim.claimAttachments
});


const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        { fetchClaimAttachments, downloadAttachment, deleteAttachment, createAttachment, coreConfirm, journalize },
        dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(withStyles(styles)(AttachmentsDialog)))));