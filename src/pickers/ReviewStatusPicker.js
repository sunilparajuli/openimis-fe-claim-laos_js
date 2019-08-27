import React, { Component } from "react";
import { SelectInput } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { formatMessage } from "@openimis/fe-core";

import { REVIEW_STATUS } from "../constants";

class ReviewStatusPicker extends Component {

    _onChange = v => this.props.onChange(
        v,
        formatMessage(this.props.intl, "claim", `reviewStatus.${v}`)
    )

    render() {
        const { intl, name, value, withNull = true } = this.props;
        const options = withNull ? [{
            value: null,
            label: formatMessage(intl, "claim", "reviewStatus.null")
        }] : [];
        options.push(...REVIEW_STATUS.map(v => ({
            value: v,
            label: formatMessage(intl, "claim", `reviewStatus.${v}`)
        })));           
        return (
            <SelectInput
                module="claim" label="reviewStatus"
                options={options}
                name={name}
                value={value}
                onChange={this._onChange}
            />
        );
    }
}

export default injectIntl(ReviewStatusPicker);