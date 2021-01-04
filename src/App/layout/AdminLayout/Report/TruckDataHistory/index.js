import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Row, Col, Card, Table } from "react-bootstrap";
import Select from "react-select";

import Aux from "../../../../../hoc/_Aux";
import * as actionTypes from "../../../../../store/actions";

import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

$.DataTable = require("datatables.net-responsive-bs");
let datatable;

class TruckDataHistory extends React.Component {
  state = {
    unit: { label: "Hour", value: "hour" },
  };
  async componentDidMount() {
    const companies_response = await axios.get(
      this.props.apiDomain + `/companies/get`
    );
    if (companies_response.data.status == 200) {
      this.props.setCompanies(companies_response.data.result);
    }
    let companyId = this.props.companyId != 0 ? this.props.companyId : 1;
    const response = await axios.get(
      this.props.apiDomain + "/report/getTruckDataHistory/" + companyId
    );
    if (response.data.status == 200) {
      let tableData = response.data.result;
      this.initTable(tableData, this.state.unit.value);
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.companyId != this.props.companyId ||
      this.state.unit != prevState.unit
    ) {
      const response = await axios.get(
        this.props.apiDomain +
          "/report/getTruckDataHistory/" +
          this.props.companyId
      );
      if (response.data.status == 200) {
        let tableData = response.data.result;
        if (datatable) {
          //   datatable.clear();
          //   datatable.rows.add(tableData);
          //   datatable.draw();
          datatable.destroy();
          this.initTable(tableData, this.state.unit.value);
        }
      }
    }
  }
  initTable = (tableData, unit) => {
    let tableResponsive = "#truck-data-history-table";

    datatable = $(tableResponsive).DataTable({
      data: tableData,
      order: [[0, "desc"]],
      columns: [
        {
          data: "date",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "transporter",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "driverName",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "netLoss",
          render: function(data, type, row) {
            return data;
          },
        },
        {
          data: "timeLoaded",
          render: function(data, type, row) {
            return unit == "hour"
              ? (data / 3600).toFixed(2) + " hr"
              : unit == "min"
              ? (data / 60).toFixed(1) + " min"
              : data + " s";
          },
        },
        {
          data: "timeArrived",
          render: function(data, type, row) {
            return unit == "hour"
              ? (data / 3600).toFixed(2) + " hr"
              : unit == "min"
              ? (data / 60).toFixed(1) + " min"
              : data + " s";
          },
        },
        {
          data: "timeUnloaded",
          render: function(data, type, row) {
            return unit == "hour"
              ? (data / 3600).toFixed(2) + " hr"
              : unit == "min"
              ? (data / 60).toFixed(1) + " min"
              : data + " s";
          },
        },
      ],
      responsive: {
        responsive: {
          details: {
            display: $.fn.dataTable.Responsive.display.childRowImmediate,
            type: "",
          },
        },
      },
    });
  };

  onCompanyChange = (option) => {
    this.props.onCompanyChange(option.value);
  };

  onUnitChange = (option) => {
    this.setState({ unit: option });
  };

  render() {
    let companyOptions = [];
    this.props.companies.map((comp) => {
      companyOptions.push({
        value: comp.id,
        label: comp.companyName,
      });
    });
    let currentCompanyOption = companyOptions.filter(
      (comp) => comp.value == this.props.companyId
    );
    let unitOptions = [
      { label: "Hour", value: "hour" },
      { label: "Minute", value: "min" },
      { label: "Second", value: "sec" },
    ];
    return (
      <Aux>
        <Row className="mb-4">
          <Col md={{ span: 4, offset: 8 }} xl={{ span: 3, offset: 9 }}>
            <div className="d-flex align-items-center justify-content-end">
              {this.props.authUser.type == 0 ? (
                <Select
                  className="basic-single w-100 m-r-10"
                  classNamePrefix="select"
                  value={
                    this.props.companyId != 0
                      ? currentCompanyOption[0]
                      : companyOptions[0]
                  }
                  onChange={this.onCompanyChange}
                  name="company"
                  options={companyOptions}
                />
              ) : (
                <></>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12} xl={12}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Truck Data History</Card.Title>
                <div className="card-header-right" style={{ width: "150px" }}>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    value={this.state.unit}
                    onChange={this.onUnitChange}
                    name="color"
                    options={unitOptions}
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Table
                  ref="tbl"
                  striped
                  hover
                  responsive
                  className="table table-condensed"
                  id="truck-data-history-table"
                >
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Transporter</th>
                      <th>Driver</th>
                      <th>Net loss</th>
                      <th>Time to load</th>
                      <th>Time to arrive</th>
                      <th>Time to unload</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>Date</th>
                      <th>Transporter</th>
                      <th>Driver</th>
                      <th>Net loss</th>
                      <th>Time to load</th>
                      <th>Time to arrive</th>
                      <th>Time to unload</th>
                    </tr>
                  </tfoot>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    apiDomain: state.apiDomain,
    authUser: state.authUser,
    companyId: state.companyId,
    companies: state.companies,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCompanies: (companies) =>
      dispatch({ type: actionTypes.COMPANIES_SET, companies: companies }),
    onCompanyChange: (companyId) =>
      dispatch({ type: actionTypes.COMPANY_CHANGE, companyId: companyId }),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TruckDataHistory)
);
