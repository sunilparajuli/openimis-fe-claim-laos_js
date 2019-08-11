import React, { Component } from "react";
import { InputSelect } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { formatMessage } from "@openimis/fe-core";

import { REVIEW_STATUS } from "./constants";

class ReviewStatusSelect extends Component {
    render() {
        const { intl, name, value, onChange } = this.props;
        return (
            <InputSelect
                module="claim" label="reviewStatus"
                options={[{
                    value: null,
                    label: formatMessage(intl, "claim", "reviewStatus.null")
                }, ...REVIEW_STATUS.map(status => ({
                    value: status,
                    label: formatMessage(intl, "claim", "reviewStatus." + status)
                }))]}
                name={name}
                value={value || null}
                onChange={onChange}
            />
        );
    }
}

export default injectIntl(ReviewStatusSelect);