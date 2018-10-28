import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      image
      largeImage
    }
  }
`;

export { SINGLE_ITEM_QUERY };

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;
export { UPDATE_ITEM_MUTATION };

class UpdateItem extends Component {
  state = {
  }
  handleChange = e => {
    const { name, type, value } = e.target;
    this.setState({ [name]: type === 'number' ? (parseFloat(value) || '') : value })
  }
  updateItemCall = async (e, updateItemMutation) => {
    e.preventDefault();
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      },
    });
    Router.push({
      pathname: '/item',
      query: { id: res.data.updateItem.id },
    });
  }
  render() {
    const LabelWithInput = ({ type, name, value,  placeholder, required }) =>
      <label htmlFor={ name }>
        { placeholder }
        { (type === 'textarea') ?
          <textarea
            type={ type }
            id={ name }
            name={ name }
            placeholder={ placeholder }
            required={ required }
            defaultValue={ value }
            onChange={ this.handleChange }
          />
          :
        <input
          type={ type }
          id={ name }
          name={ name }
          placeholder={ placeholder }
          required={ required }
          defaultValue={ value }
          onChange={ this.handleChange }
        />
        }
      </label>;
    return (
      <Query query={ SINGLE_ITEM_QUERY } variables={{ id: this.props.id }}>
      {({data, loading}) => {
        if (loading) return <p>Loading...</p>;
        if (!data.item) return <p>No Item found</p>;
        return (
      <Mutation mutation={ UPDATE_ITEM_MUTATION }>
        {(updateItem, { loading, error }) => (
          <Form onSubmit={ e => this.updateItemCall(e, updateItem) }>
            <ErrorMessage error={ error }/>
            <fieldset disabled={ loading } aria-busy={ loading }>
              { LabelWithInput({ value: data.item.title, type: 'text', name: 'title', placeholder: 'Title', required: true }) }
              { LabelWithInput({ value: data.item.price, type: 'number', name: 'price', placeholder: 'Price', required: true }) }
              { LabelWithInput({ value: data.item.description, type: 'textarea', name: 'description', placeholder: 'Description', required: true }) }
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
        );
      }}
      </Query>
    );
  }
}

export default UpdateItem;
