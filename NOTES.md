How to design an application for real-time collaborative editing?

With the client-server architecture our naive solution would most likely be similar to the following design pattern.

# Operational Transform (OT)

OT is the main technique used (for eg in Google Docs,etc) to design real-time collborative editing to ensure consistency when multiple users edit the same document simultaneously.

OT is server-led event-driven architecture. In OT

1. Each client's edits are recorded as **operations**.
2. These **operations** are send by clients to server.
3. Server handles the conflicts and determines the "truth".
4. Server broadcasts the "truth" to the clients.

So, in OT server is the source of truth and responsible for conflict resolution.

# What is CRDT ?

The other approach to do it is via CRDT. With CRDT, server is no longer a source of truth and is not responsible for conflict resolution. In a P2P setup, server is not even necessary.

CRDT (**Conflict-Free Resolution Data Type**) is a **Distributed Data Structure** that allows multiple replicas to be **updated independently**, **merged automatically** in a way that **guarantees eventual consistency**.

CRDT a is a _Data Structure_ that is _replicated_ across multiple nodes with the following features:

1. A replica in any node can be updated independently, concurrently and without coordinating with any other replica.
2. An algorithm resolves any merge conflict automatically.
3. Though replicas may have different state at any given point, they are guaranteed to be _eventually convergent_.

More on the implementation later.

# Use Cases:

1. Distributed Data Bases and Caches (Redis CRDT)

- Why? Because CRDTs guarantees eventual consistency even in case of network partition.

2. Real-time collaborative editing.

- Why? Multiple users can edit the same document simultaneously without merge conflicts.

3. Messaging and Social Media

- Why? Users can interact while offline, changes can be merged seamlessly later.

4. Offline Friendly Applications

- Why? Allow users to modify data offline and then sync later without conflicts.

5. Misc other decentralized applications

- Why? Ensures consistency in a decentralized network without needing consensus for every change. (Blockchain is not via CRDT) [NOTE: There is a big difference between decentralized and distributed]

CRDT are use in some form or other by Redis Enterprise, MS CosmosDB, Soundcloud, Figma, Facebook, Paypal, Apple Notes, etc. (Conflicting information on this)[1][2]

# 2 Types of CRDT

## 1. Operation Based CRDT

Operation based CRDT proceed as following

1. A replica registers an operation and changes its local state.
2. It broadcasts the operation to all other replicas
3. All other replicas update their state when they receive the operation.

Whenevern replica receives the operations, it will get in sync.

A positive is that the amount of data transmitted is very low as only the operation is required to be transmitted.

A big negative is that there is a replica can go out of sync even if it misses a single operation.

## 2. State Based CRDT

State based CRDT proceeds as following

1. A replica registers an operation and changes its local state.
2. Then it broadcasts its local state to all other replicas.
3. Other replicas receive the state and resolve the conflict between their local state and the received state.

A big positive is that this is a self-healing system. Even if a replica goes out of network, when it joins again it can get updated as soon as it receives a state.

A negative that the about of data transmitted is large because the entire state needs to be transmitted.

NOTE : In CRDT, a server is not required in the traditional sense of a program which handles requests and generates response. In the demo, server only exists to broadcast the information from 1 replica to other replicas. This can also be done by P2P architecture.

Libraries provide readymade implementation of CRDT.

# Limitations of CRDT

- All of the major application providers (Google Docs, Evernote, etc) favour _strong consistency_ and hence they opt for server-led, event driven architecture. CRDT are not ideal for that use case.

# Properties of CRDT

## 1. Commutative:

- The order of events should be irrelevant.
- For eg:
  - Event A - User X types 'A'
  - Event B - User Y presses 'backspace'
  - To determine the final state, it should be irrelevant whether Event A or Event B occurred first ie `A then B` should be same as `B then A`.

## 2. Associative:

- Grouping of events should be irrelevant
- For eg:
  - Event A - User X types 'A'
  - Event B - User Y presses 'backspace'
  - Event C - User X types 'C'
- To determine the final state, it should be irrelevant whether the events are resolve as `(A then B) then C)` or (`A then (B then C)`)

- The reasoning behing these 2 properties is that because of networking parition, events are not available chronologically to all the nodes and hence order of the nodes and their grouping must be irrelevant.

## 3. Idempotent:

- Same operation multiple times should equivalent to a single operation.
- For eg:
  - User X presses 'backspace' 10 times without anything happening on the screen.
- Instead of deleting 10 character at once, the resolved state should have only 1 char deleted.

1. https://ably.com/blog/crdts-distributed-data-consistency-challenges
2. https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type
