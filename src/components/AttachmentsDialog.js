import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import FileIcon from "@material-ui/icons/Add";
import {
    Dialog, DialogTitle, Divider, Button,
    DialogActions, DialogContent, Link, IconButton
} from "@material-ui/core";
import {
    FormattedMessage, withModulesManager, ProgressOrError, Table, TextInput,
    PublishedComponent,
    formatMessage, formatMessageWithValues,
    journalize, coreConfirm
} from "@openimis/fe-core";
import { fetchClaimAttachments, downloadAttachment, deleteAttachment, createAttachment } from "../actions";
import { RIGHT_ADD } from "../constants";

const styles = theme => ({
    dialogTitle: theme.dialog.title,
    dialogContent: theme.dialog.content,
});

const newAttachment = {
    title: "",
    type: "",
    date: null,
    filename: null,
    mime: null,
    document: null,
}

class AttachmentsDialog extends Component {
    state = {
        open: false,
        claimUuid: null,
        claimAttachments: [],
        attachmentToDelete: null,
        ...newAttachment
    }

    stateAttachment = () => {
        return {
            title: this.state.title,
            type: this.state.type,
            date: this.state.date,
            filename: this.state.filename,
            mime: this.state.mime,
        }
    }

    componentDidUpdate(prevProps, props, snapshot) {
        const { readOnly = false } = this.props;
        if (!_.isEqual(prevProps.claimAttachments, this.props.claimAttachments)) {
            var claimAttachments = [...(this.props.claimAttachments || [])]
            if (!this.props.readOnly && this.props.rights.includes(RIGHT_ADD)) {
                claimAttachments.push({});
            }
            this.setState({ claimAttachments });
        } else if (!_.isEqual(prevProps.claim, this.props.claim) && !!this.props.claim) {
            this.setState({ open: true, claimUuid: this.props.claim.uuid, claimAttachments: readOnly ? [] : [{}] },
                e => {
                    if (!!this.props.claim && !!this.props.claim.uuid) {
                        this.props.fetchClaimAttachments(this.props.claim);
                    }
                })
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            var claimAttachments = [...this.state.claimAttachments];
            if (!!this.state.attachmentToDelete) {
                claimAttachments = claimAttachments.filter(a => a.id !== this.state.attachmentToDelete.id)
            } else if (!!this.state.filename) {
                claimAttachments.pop()
                claimAttachments.push(this.stateAttachment(), {});
            }
            this.setState(
                {
                    claimAttachments,
                    attachmentToDelete: null,
                    ...newAttachment
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

    delete = (a, i) => {
        if (!!a.id) {
            this.setState(
                { attachmentToDelete: a },
                e => this.props.coreConfirm(
                    formatMessage(this.props.intl, "claim", "deleteClaimAttachment.confirm.title"),
                    formatMessageWithValues(this.props.intl, "claim", "deleteClaimAttachment.confirm.message",
                        {
                            file: `${a.title} (${a.filename})`,
                        }),
                ))
        } else {
            var claimAttachments = [...this.state.claimAttachments]
            claimAttachments.splice(i, 1)
            this.props.claim.attachments = [...claimAttachments]
            this.props.claim.attachments.pop()
            this.setState({ claimAttachments })
        }
    }

    addAttachment = document => {
        let attachment = { ...this.stateAttachment(), document }
        if (!!this.state.claimUuid) {
            this.props.createAttachment(
                { ...attachment, claimUuid: this.state.claimUuid },
                formatMessageWithValues(this.props.intl, "claim", "claim.ClaimAttachment.create.mutationLabel", {
                    file: `${this.state.title} (${this.state.filename})`,
                    code: `${this.props.claim.code}`
                }))
        } else {
            if (!this.props.claim.attachments) {
                this.props.claim.attachments = []
            }
            this.props.claim.attachments.push(attachment)
            var claimAttachments = [...this.state.claimAttachments]
            claimAttachments.pop()
            claimAttachments.push(attachment, {});
            this.setState({ ...newAttachment, claimAttachments })
        }
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
                        this.addAttachment(btoa(loaded.target.result))
                    }
                    reader.readAsBinaryString(file);
                })
        }
    }

    formatFileName(a) {
        if (!!a.id) return <Link onClick={e => this.download(a)}>{a.filename || ""}</Link>
        if (!!a.filename) return <i>{a.filename}</i>
        return (
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
            </IconButton>
        )
    }

    render() {
        const { classes, claim, readOnly = false,
            fetchingClaimAttachments, errorClaimAttachments } = this.props;
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
            a => this.formatFileName(a),
        ];
        if (!readOnly || !this.state.claimUuid) {
            headers.push("claimAttachment.delete");
            itemFormatters.push(
                (a, i) => !!a.filename ? <IconButton onClick={e => this.delete(a, i)}><DeleteIcon /></IconButton> : ""
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
                    {!fetchingClaimAttachments && !errorClaimAttachments && (
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