import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { formatMessage, AutoSuggestion, InputSelect, withModulesManager } from "@openimis/fe-core";
import { fetchBatchRuns } from "../actions";
import _debounce from "lodash/debounce";

class BatchRunSelect extends Component {

    componentDidUpdate(prevProps, prevState, snapshot) {        
        if (prevProps.scope !== this.props.scope) {
            this.props.fetchBatchRuns(this.props.scope);
        }
    }

    formatSuggestion = s => `${s.runDate}`;

    _onChange = v => this.props.onChange(
        v,
        this.formatSuggestion(v)
    )

    render() {
        const { name, scope, batchRuns, initValue } = this.props;
        return (
            <InputSelect
                disabled={!scope}
                module="claim" label="BatchRun"
                options={[
                    ...batchRuns.map(v => ({
                        value: v,
                        label: this.formatSuggestion(v)
                    }))]}
                name={name}
                value={initValue}
                onChange={this._onChange}
            />
        );
    }
}

const mapStateToProps = state => ({
    batchRuns: state.claim.batchRuns,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchBatchRuns }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(
    BatchRunSelect)));
