---
title: Quorum Certificate and Distributed Key Generation
sidebar_label: QC and DKG
description: How the Flow protocol manages the Epoch Setup Phase
toc_max_heading_level: 4
---

:::warning

  If you haven't read the Intro to Flow Staking document and the Epoch protocol document,
  please read that first. Those documents provide an overview of epochs on Flow for
  all users and are necessary prerequisites to this document.

:::

:::warning

  This document assumes you have some technical knowledge about the Flow
  blockchain and programming environment.

:::

## Epoch Setup Phase

**Purpose:** During the epoch setup phase, all nodes participating in the upcoming epoch
must perform setup tasks in preparation for the upcoming epoch, including
the Collector Cluster Quorum Certificate Generation and Consensus Committe Distributed Key Generation.

**Duration:** The epoch setup phase begins right after the `EpochSetup` service event is emitted.
It ends with the block where `EpochCommit` service emitted.

## Machine Accounts

The processes described in this document are fully automated.

They are expected to be performed entirely by the node software with no manual
interaction required by the node operator after the node has been set up and registered.

To facilitate this, we recommend that node operators use a secondary "machine account"
that only stores the `FlowClusterQC.Voter` or `FlowDKG.Participant` resource objects
in addition to FLOW to pay for transaction fees. You can connect your node to this account
to participate in the Epoch Setup Phase without having to do the actions manually.

If you are using the [Staking Collection](./14-staking-collection.md) for your node,
this functionality is built-in. When you register a node with the staking collection,
you also have to provide a public key or keys for your machine account for the node.

If you have a node without a machine account (if you were operating a node from the time
before epochs and staking collection were enabled, for example) the staking collection
also provides a method to create a machine account for an existing node.

See the [Staking Collection Docs](./14-staking-collection.md#machine-account-support)
for more information.

## Collector Cluster Quorum Certificate Generation Protocol

The collector nodes are organized into clusters and must bootstrap
the Hotstuff consensus algorithm for each cluster. To do this,
they generate the root block for their respective clusters
and submit a vote for the root block to a specialized smart contract, `FlowClusterQC`.
If 2/3 of the collectors in a cluster have voted with the same unique vote,
then the cluster is considered complete.
Once all clusters are complete, the QC is complete.

### `FlowClusterQC` Transactions

#### Create QC Voter Object

A node uses the [`getClusterQCVoter()`](https://github.com/onflow/flow-core-contracts/blob/master/contracts/epochs/FlowEpoch.cdc#L905)
function in the `FlowEpoch` contract to create their Voter object and needs to provide
a reference to their `FlowIDTableStaking.NodeStaker` object to prove they are the node owner.

When registering a node with the staking collection, this process is handled by
[the transaction to register.](./14-staking-collection.md#register-a-new-staked-node)
It also creates a machine account for the QC object.

If a user already has a registered node with the staking collection, but hasn't created their QC Voter object yet,
they can use the [`create_machine_account.cdc` transaction.](./14-staking-collection.md#create-a-machine-account-for-an-existing-node)

If a user is not using the staking collection, they can use the **Create QC Voter** ([QC.01](../../build/core-contracts/07-epoch-contract-reference.md#quorum-certificate-transactions-and-scripts))
transaction. This will only store the QC Voter object in the account that stores the `NodeStaker` object.
It does not create a machine account or store it elsewhere, so it is not recommended to use. We encourage to use the staking collection instead.

#### Submit Vote

During the Epoch Setup Phase, the node software should submit the votes for the QC generation
automatically using the **Submit QC Vote** ([QC.02](../../build/core-contracts/07-epoch-contract-reference.md#quorum-certificate-transactions-and-scripts))
transaction with the following arguments.

| Argument                | Type     | Description |
|-------------------------|----------|-------------|
| **voteSignature**       | `String` | The signed message (signed with the node's staking key) |
| **voteMessage**         | `String` | The raw message itself. |

## Consensus Committee Distributed Key Generation Protocol (DKG)

The Random Beacon Committee for the next Epoch (currently all consensus nodes)
will run the DKG through a specialized smart contract, `FlowDKG`.
To do this, they post a series of messages to a public "whiteboard" to 
collectively generate a shared key array. When each node has enough information
to generate their array of keys, they send the generated array to the smart contract
as their final submission.
If `(# of consensus nodes-1)/2` consensus nodes submit the same key array,
the DKG is considered to be complete.

### `FlowDKG` Transactions

#### Create DKG Participant Object

A node uses the [`getDKGParticipant()`](https://github.com/onflow/flow-core-contracts/blob/master/contracts/epochs/FlowEpoch.cdc#L919)
function in the `FlowEpoch` contract to create their Voter object and needs to provide
a reference to their `FlowIDTableStaking.NodeStaker` object to prove they are the node owner.

When registering a node with the staking collection, this process is handled by
[the transaction to register.](./14-staking-collection.md#register-a-new-staked-node)
It also creates a machine account for the DKG Object.

If a user already has a registered node with the staking collection, but hasn't created their DKG Participant object yet,
they can use the [`create_machine_account.cdc` transaction.](./14-staking-collection.md#create-a-machine-account-for-an-existing-node)

If a user is not using the staking collection, they can use the **Create DKG Participant** ([DKG.01](../../build/core-contracts/07-epoch-contract-reference.md#dkg-transactions-and-scripts))
transaction. This will only store the DKG Participant object in the account that stores the `NodeStaker` object.
It does not create a machine account or store it elsewhere, so it is not recommended to use. 
The staking collection is the recommended method.

#### Post Whiteboard Message

During the Epoch Setup Phase, the node software should post whiteboard messages to the DKG
automatically using the **Post Whiteboard Message** ([DKG.02](../../build/core-contracts/07-epoch-contract-reference.md#dkg-transactions-and-scripts))
transaction with the following arguments.

| Argument          | Type     | Description |
|-------------------|----------|-------------|
| **content**       | `String` | The content of the whiteboard message |

#### Send Final Submission

During the Epoch Setup Phase, the node software should send its final submission for the DKG
automatically using the **Send Final Submission** ([DKG.03](../../build/core-contracts/07-epoch-contract-reference.md#dkg-transactions-and-scripts))
transaction with the following arguments.

| Argument           | Type        | Description |
|--------------------|-------------|-------------|
| **submission**     | `[String?]` | The final key vector submission for the DKG. |

## Monitor Events and Query State from the QC and DKG Contracts

See the [QC and DKG events and scripts document](./10-qc-dkg-scripts-events.md) for information
about the events that can be emitted by these contracts and scripts you can use to query information.
