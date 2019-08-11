import React, { Component } from "react";
import { InputSelect } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { formatMessage } from "@openimis/fe-core";

import { FEEDBACK_STATUS } from "./constants";

class FeedbackStatusSelect extends Component {
    render() {
        const { intl, name, value, onChange } = this.props;
        return (
            <InputSelect
                module="claim" label="feedbackStatus"
                options={[{
                    value: null,
                    label: formatMessage(intl, "claim", "feedbackStatus.null")
                }, ...FEEDBACK_STATUS.map(status => ({
                    value: status,
                    label: formatMessage(intl, "claim", "feedbackStatus." + status)
                }))]}
                name={name}
                value={value || null}
                onChange={onChange}
            />
        );
    }
}

export default injectIntl(FeedbackStatusSelect);