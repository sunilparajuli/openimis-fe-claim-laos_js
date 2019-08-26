import React, { Component } from "react";
import { SelectInput } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { formatMessage } from "@openimis/fe-core";

import { FEEDBACK_STATUS } from "./constants";

class FeedbackStatusPicker extends Component {

    _onChange = v => this.props.onChange(
        v,
        formatMessage(this.props.intl, "claim", `feedbackStatus.${v}`)
    )

    render() {
        const { intl, name, value, onChange, withNull = true } = this.props;
        const options = withNull ? [{
            value: null,
            label: formatMessage(intl, "claim", "feedbackStatus.null")
        }] : [];
        options.push(...FEEDBACK_STATUS.map(v => ({
            value: v,
            label: formatMessage(intl, "claim", `feedbackStatus.${status}`)
        })));  
        return (
            <SelectInput
                module="claim" label="feedbackStatus"
                options={options}
                name={name}
                value={value}
                onChange={_onChange}
            />
        );
    }
}

export default injectIntl(FeedbackStatusPicker);