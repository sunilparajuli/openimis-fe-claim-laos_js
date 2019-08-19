import React, { Component } from "react";
import { SelectInput } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { formatMessage } from "@openimis/fe-core";

import { REVIEW_STATUS } from "./constants";

class ReviewStatusPicker extends Component {
    render() {
        const { intl, name, value, onChange } = this.props;
        return (
            <SelectInput
                module="claim" label="reviewStatus"
                options={[{
                    value: null,
                    label: formatMessage(intl, "claim", "reviewStatus.null")
                }, ...REVIEW_STATUS.map(status => ({
                    value: status,
                    label: formatMessage(intl, "claim", "reviewStatus." + status)
                }))]}
                name={name}
                value={value}
                onChange={onChange}
            />
        );
    }
}

export default injectIntl(ReviewStatusPicker);