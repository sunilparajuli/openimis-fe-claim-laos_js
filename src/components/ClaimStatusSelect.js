import React, { Component } from "react";
import { InputSelect } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { formatMessage } from "@openimis/fe-core";

import { CLAIM_STATUS } from "./constants";

class ClaimStatusSelect extends Component {
    render() {
        const { intl, name, value, onChange } = this.props;
        return (
            <InputSelect
                module="claim" label="claimStatus"
                options={[{
                    value: null,
                    label: formatMessage(intl, "claim", "claimStatus.null")
                }, ...CLAIM_STATUS.map(status => ({
                    value: status,
                    label: formatMessage(intl, "claim", "claimStatus." + status)
                }))]}
                name={name}
                value={value || null}
                onChange={onChange}
            />
        );
    }
}

export default injectIntl(ClaimStatusSelect);