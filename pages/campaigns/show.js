import React, { Component } from "react";
import Layout from "../../components/Layout"
import ContributeForm from "../../components/ContributeForm"
import { Card, Grid, Button } from "semantic-ui-react";
import CampaignContract from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';

class CampaignShow extends Component {
	static async getInitialProps(props) {
		const campaign = CampaignContract(props.query.address)
		const summary = await campaign.methods.getSummary().call()

		return { 
			address: props.query.address,
			minimunContribution: summary[0],
			balance: summary[1],
			requestsCount: summary[2],
			approversCount: summary[3],
			manager: summary[4]
		};
	}

	renderCards() {
		const {
			minimunContribution,
			balance,
			requestsCount,
			approversCount,
			manager
		} = this.props;

		const items = [
		 	{
		 		header: manager,
				meta: 'address of manager',
				description: "this is manager",
				style: { overflowWrap: 'break-word'}
		 	},
		 	{
		 		header: minimunContribution,
		 		meta: 'minimun Contribution (wei)',
		 		description: 'you must contribute at least this much wei'
		 	},
		 	{
		 		header: requestsCount,
		 		meta: 'Number of requests',
		 		description: 'Request must .....'
		 	},
		 	{
		 		header: approversCount,
		 		meta: 'Number approvers',
		 		description: 'number of people approvers'
		 	},
		 	{
		 		header: web3.utils.fromWei(balance, 'ether'),
		 		meta: 'campaign balance (ether)',
		 		description: 'the balance'
		 	}
		];

		return <Card.Group items={items} />
	}

  render() {
    return (
    	<Layout>
    		<Grid>
    			<Grid.Row>
	    			<Grid.Column width={10}>
	    				{this.renderCards()}
	    			</Grid.Column>
	    			<Grid.Column width={6}>
	    				<ContributeForm address={this.props.address}/>		
	    			</Grid.Column>
    			</Grid.Row>
    			<Grid.Row>
    				<Grid.Column>
    					<Link route={`/campaigns/${this.props.address}/requests`}>
	    					<a>
	    						<Button primary>View Requests</Button>
	    					</a>
	    				</Link>	
    				</Grid.Column>
    			</Grid.Row>
    		</Grid>
    	</Layout>
    );
  }
}

export default CampaignShow;
