import React, { Component } from "react";
import { SelectInput } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { formatMessage } from "@openimis/fe-core";

import { APPROVAL_STATUS } from "../constants";

class ApprovalStatusPicker extends Component {

    _onChange = v => this.props.onChange(
        v,
        formatMessage(this.props.intl, "claim", `approvalStatus.${v}`)
    )

    render() {
        const { intl, name, value, withNull = true, withLabel = true } = this.props;
        const options = withNull ? [{
            value: null,
            label: formatMessage(intl, "claim", "approvalStatus.null")
        }] : [];
        options.push(...APPROVAL_STATUS.map(v => ({
            value: v,
            label: formatMessage(intl, "claim", `approvalStatus.${v}`)
        })));
        return (
            <SelectInput
                module="claim"
                label={withLabel ? "approvalStatus" : null}
                options={options}
                name={name}
                value={value}
                onChange={this._onChange}
            />
        );
    }
}

export default injectIntl(ApprovalStatusPicker);