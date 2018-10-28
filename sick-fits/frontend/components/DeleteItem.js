import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

export { DELETE_ITEM_MUTATION };

class DeleteItem extends Component {
  update = (cache, payload) => {
    // Update cache on the client
    // 1. Read the cache
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    // 2. Filter the deleted item out
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    // 3. Put items in cache
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }
  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={ this.update }
      >
      {(deleteItem, { loading, error }) => (
        <button onClick={() => {
          if (confirm('Are you sure you want to delete this item?')){
            deleteItem();
          }
        }} disabled={loading}>
          { loading ? 'Loading...' : this.props.children }
        </button>
      )}
      </Mutation>
    );
  }
}

export default DeleteItem;
