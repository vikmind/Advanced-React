import SingleItem from '../components/SingleItem';

const ItemPage = props => (
  <div>
    <SingleItem id={ props.query.id }/>
  </div>
)

export default ItemPage;
