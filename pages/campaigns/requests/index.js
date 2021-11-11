import React, { Component } from "react";
import { Form, Input, Message, Button, Table } from 'semantic-ui-react'
import Layout from "../../../components/Layout"
import { Link } from '../../../routes';
import CampaignContract from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';
// import web3 from '../ethereum/web3';
// import { Router } from '../routes';

class RequestIndex extends Component {
	static async getInitialProps(props) {
		const { address } = props.query;
		const campaign = CampaignContract(address)
		const requestCount = await campaign.methods.getRequestsCount().call()
		const approversCount = await campaign.methods.approversCount().call()

		const summary = await campaign.methods.getSummary().call()
		const manager = summary[4]

		const requests = await Promise.all(
			Array(parseInt(requestCount)).fill().map( (element, index) => {
				return campaign.methods.requests(index).call();
			})
		);
		return { address, requests, requestCount, approversCount, manager};
	}

	renderRows() {
		return this.props.requests.map((request, index) => {
			return <RequestRow 
				key={index}
				id={index}
				request={request}
				address={this.props.address}
				approversCount={this.props.approversCount}
			/>
		})
	}

	render() {
		const { Header, Row, HeaderCell, Body } = Table;
		return (
			<Layout>
				<Link route={`/campaigns/${this.props.address}/requests/new`}>
					<a>
						<Button primary>
							Add Request
						</Button>
					</a>
				</Link>
				<Table>
					<Header>
						<Row>
							<HeaderCell>ID</HeaderCell>
							<HeaderCell>Description</HeaderCell>
							<HeaderCell>Amount</HeaderCell>
							<HeaderCell>Recipient</HeaderCell>
							<HeaderCell>Approval</HeaderCell>
							<HeaderCell>Approve</HeaderCell>
							<HeaderCell>Finalize</HeaderCell>
						</Row>
					</Header>
					<Body>
						{this.renderRows()}
					</Body>
				</Table>
			</Layout>
		)
	}
}
export default RequestIndex;