import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { ALL_ITEMS_QUERY } from './Items';
import { PAGINATION_QUERY } from './Pagination';

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
      title
      description
      price
      image
      largeImage
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
  uploadFile = async e => {
    console.log('Uploading', e);
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'rtgli0ni');
    const res = await fetch('https://api.cloudinary.com/v1_1/vikmind/image/upload', {
      method: 'POST',
      body: data,
    });
    const file = await res.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
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
      <Mutation
        mutation={ CREATE_ITEM_MUTATION }
        variables={ this.state }
        refetchQueries={[
          {
            query: ALL_ITEMS_QUERY,
            variables: { skip: 0 }
          },
          {
            query: PAGINATION_QUERY
          }
        ]}
      >
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
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Select file"
                  required
                  onChange={ this.uploadFile }
                />
                { this.state.image && <img width="200" src={ this.state.image } alt={ this.state.title } /> }
              </label>
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
