import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;
export { CREATE_ITEM_MUTATION };

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  }
  handleChange = e => {
    const { name, type, value } = e.target;
    this.setState({ [name]: type === 'number' ? (parseFloat(value) || '') : value })
  }
  render() {
    const LabelWithInput = ({ type, name, placeholder, required }) =>
      <label htmlFor={ name }>
        { placeholder }
        { (type === 'textarea') ?
          <textarea
            type={ type }
            id={ name }
            name={ name }
            placeholder={ placeholder }
            required={ required }
            value={ this.state[name] }
            onChange={ this.handleChange }
          />
          :
        <input
          type={ type }
          id={ name }
          name={ name }
          placeholder={ placeholder }
          required={ required }
          value={ this.state[name] }
          onChange={ this.handleChange }
        />
        }
      </label>;
    return (
      <Mutation mutation={ CREATE_ITEM_MUTATION } variables={ this.state }>
        {(createItem, { loading, error }) => (
          <Form onSubmit={ async e => {
            e.preventDefault();
            const res = await createItem();
            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id },
            });
          } }>
            <ErrorMessage error={ error }/>
            <fieldset disabled={ loading } aria-busy={ loading }>
              { LabelWithInput({ type: 'text', name: 'title', placeholder: 'Title', required: true }) }
              { LabelWithInput({ type: 'number', name: 'price', placeholder: 'Price', required: true }) }
              { LabelWithInput({ type: 'textarea', name: 'description', placeholder: 'Description', required: true }) }
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
