import React, { Component } from "react";
import { SelectInput } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { formatMessage } from "@openimis/fe-core";

import { FEEDBACK_STATUS } from "./constants";

class FeedbackStatusPicker extends Component {
    render() {
        const { intl, name, value, onChange } = this.props;
        return (
            <SelectInput
                module="claim" label="feedbackStatus"
                options={[{
                    value: null,
                    label: formatMessage(intl, "claim", "feedbackStatus.null")
                }, ...FEEDBACK_STATUS.map(status => ({
                    value: status,
                    label: formatMessage(intl, "claim", "feedbackStatus." + status)
                }))]}
                name={name}
                value={value}
                onChange={onChange}
            />
        );
    }
}

export default injectIntl(FeedbackStatusPicker);