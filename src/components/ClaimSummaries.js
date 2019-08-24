import React, { Component } from "react";
import Table from "@openimis/fe-core";


class ClaimSummaries extends Component {
    render() {
        return <Table
            module="claim"
            headers={[
                "claimSummaries.code",
                "claimSummaries.healthFacility",
                "claimSummaries.claimedDate",
                "claimSummaries.feedbackStatus",
                "claimSummaries.reviewStatus",
                "claimSummaries.claimed",
                "claimSummaries.approved",
                "claimSummaries.claimStatus"
            ]}
            aligns={[, , , , , "right", "right"]}
            itemFormatters={[
                c => c.code,
                c => `${c.healthFacility.code} ${c.healthFacility.name}`,
                c => formatDateFromIso(intl, c.dateClaimed),
                c => formatMessage(intl, "claim", `feedbackStatus.${c.feedbackStatus}`),
                c => formatMessage(intl, "claim", `reviewStatus.${c.reviewStatus}`),
                c => formatAmount(intl, c.claimed),
                c => formatAmount(intl, c.approved),
                c => formatMessage(intl, "claim", `claimStatus.${c.status}`)
            ]}
            items={claims}
            withPagination={true}
            withSelection={true}
            itemIdentifier={this.rowIdentifier}
            selection={this.state.selection}
            selectAll={this.state.selectAll}
            clearAll={this.state.clearAll}
            onChangeSelection={this.onChangeSelection}
            onDoubleClick={this.onDoubleClick}
            page={this.state.page}
            pageSize={this.state.pageSize}
            count={claimsPageInfo.totalCount}
            onChangePage={this.onChangePage}
            rowsPerPageOptions={this.rowsPerPageOptions}
            onChangeRowsPerPage={this.onChangeRowsPerPage}
        />
    }
}

export default ClaimSummaries;