import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Head from 'next/head';
import { Query } from 'react-apollo';
import { SINGLE_ITEM_QUERY } from './UpdateItem';

import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteItem from './DeleteItem';
import ErrorMessage from './ErrorMessage';

class SingleItem extends Component {
  render() {
    const { item } = this.props;
    return (
      <Query query={ SINGLE_ITEM_QUERY } variables={{ id: this.props.id }}>
      {({ data, loading, error}) => {
        const { item } = data;
        if (error) return  <ErrorMessage error={ error }/>;
        if (loading) return <p>Loading...</p>;
        if (!item) return <p>No Item found</p>;
        return (
      <ItemStyles>
        <Head>
          <title>{ item.title }</title>
        </Head>
        { item.largeImage && <img src={item.largeImage} alt={item.title} /> }
        <Title>
          <Link href={{
            pathname: '/item',
            query: { id: item.id },
          }}><a>{ item.title }</a></Link>
        </Title>
        <PriceTag>{ formatMoney(item.price) }</PriceTag>
        <p>{ item.description }</p>
        <div className="buttonList">
          <Link href={{
            pathname: '/update',
            query: { id: item.id },
          }}><a>Edit</a></Link>
          <button>Add to Cart</button>
          <DeleteItem id={ item.id }>Delete</DeleteItem>
        </div>
      </ItemStyles>
        );
      }}
      </Query>
    );
  }
}

SingleItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    largeImage: PropTypes.string,
  }),
};

export default SingleItem;
