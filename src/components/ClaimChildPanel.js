import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import {
    formatAmount, NumberInput, Table,
    PublishedComponent, AmountInput, TextInput,
} from "@openimis/fe-core";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import _ from "lodash";


class ClaimChildPanel extends Component {
    state = {
        data: []
    }

    initData = () => {
        let data = [];
        if (!!this.props.edited[`${this.props.type}s`]) {
            data = this.props.edited[`${this.props.type}s`] || []
        }
        if (!this.props.forReview) {
            data.push({});
        }
        return data;
    }

    componentDidMount() {
        this.setState({ data: this.initData() });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.edited_id && !this.props.edited_id) {
            let data = [];
            if (!this.props.forReview) {
                data.push({});
            }
            this.setState({ data });
        } else if (!!this.props.edited[`${this.props.type}s`]
            && !_.isEqual(prevProps.edited[`${this.props.type}s`], this.props.edited[`${this.props.type}s`])) {
            this.setState({ data: this.initData() })
        }
    }

    _change = (idx, attr, v) => {
        const data = this.state.data;
        data[idx][attr] = v;
        this.props.updateAttribute(`${this.props.type}s`, data);
        if (data.length === (idx + 1) && !this.props.forReview) {
            data.push({});
        }
        return data;
    }

    _onChange = (idx, attr, v) => {
        let data = this._change(idx, attr, v);
        this.setState({ data });
    }

    _onChangeWithPrice = (idx, attr, v) => {
        let data = this._change(idx, attr, v);
        data[idx].priceAsked = !!v ? v.price : null;
        this.setState({ data });
    }

    _onDelete = idx => {
        const data = this.state.data;
        data.splice(idx, 1);
        this.props.updateAttribute(`${this.props.type}s`, data);
        this.setState({ data });
    }

    render() {
        const { intl, edited, type, picker, forReview } = this.props;
        if (!edited) return null;
        const totalAmount = formatAmount(
            intl,
            _.round(this.state.data.reduce(
                (sum, r) => sum + (!!r.qtyProvided && !!r.priceAsked ? r.qtyProvided * r.priceAsked : 0), 0),
                2
            ));
        let headers = [
            `edit.${type}s.${type}`,
            `edit.${type}s.quantity`,
            `edit.${type}s.price`,
            `edit.${type}s.explanation`,
        ];

        let itemFormatters = [
            (i, idx) => <PublishedComponent
                readOnly={!!forReview}
                id={picker} withLabel={false} value={i[type]}
                onChange={v => this._onChangeWithPrice(idx, type, v)}
            />,
            (i, idx) => <NumberInput
                readOnly={!!forReview}
                value={i.qtyProvided}
                onChange={v => this._onChange(idx, "qtyProvided", v)}
            />,
            (i, idx) => <AmountInput
                readOnly={!!forReview}
                value={i.priceAsked}
                onChange={v => this._onChange(idx, "priceAsked", v)}
            />,
            (i, idx) => <TextInput
                readOnly={!!forReview}
                value={i.explanation}
                onChange={v => this._onChange(idx, "explanation", v)}
            />,
        ];
        if (!!forReview) {
            headers.push(
                `edit.${type}s.appQuantity`,
                `edit.${type}s.appPrice`,
            );
            itemFormatters.push(
                (i, idx) => <NumberInput
                    value={i.qtyApproved}
                    onChange={v => this._onChange(idx, "qtyApproved", v)}
                />,
                (i, idx) => <AmountInput
                    value={i.priceApproved}
                    onChange={v => this._onChange(idx, "priceApproved", v)}
                />,
            );
        }

        headers.push(`edit.${type}s.justification`);
        itemFormatters.push(
            (i, idx) => <TextInput value={i.justification} onChange={v => this._onChange(idx, "justification", v)} />
        );
        if (!!forReview) {
            headers.push(
                `edit.${type}s.status`,
                `edit.${type}s.rejectionReason`,
            );
            itemFormatters.push(
                (i, idx) => <PublishedComponent
                    readOnly={false}
                    id="claim.ApprovalStatusPicker"
                    withNull={false}
                    withLabel={false}
                    value={i.status}
                    onChange={v => this._onChange(idx, 'status', v)}
                />,
                (i, idx) => <PublishedComponent
                    readOnly={false}
                    id="claim.RejectionReasonPicker"
                    withLabel={false}
                    value={i.rejectionReason}
                    compact={true}
                    onChange={v => this._onChange(idx, 'rejectionReason', v)}
                />,
            );
        }
        if (!forReview) {
            headers.push(`edit.${type}s.delete`);
            itemFormatters.push(
                (i, idx) => idx === this.state.data.length - 1 ?
                    null :
                    <IconButton onClick={e => this._onDelete(idx)}><DeleteIcon /></IconButton>
            );
        }
        return (
            <Table
                module="claim"
                header={`edit.${this.props.type}s.title`}
                headerValues={{ totalAmount }}
                headers={headers}
                itemFormatters={itemFormatters}
                items={this.state.data}
            />
        )
    }
}

export default injectIntl(ClaimChildPanel);