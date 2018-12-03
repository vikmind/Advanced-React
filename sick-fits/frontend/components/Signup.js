import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const SINGUP_MUTATION  = gql`
  mutation SINGUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(
      name: $name
      email: $email
      password: $password
    ) {
      id
      email
      name
    }
  }
`;

class Signup extends Component {
  state = {
    email: '',
    name: '',
    password: '',
  };
  saveState = e => {
    const { name, type, value } = e.target;
    this.setState({ [name]: value })
  }

  render() {
    return (
      <Mutation
        mutation={ SINGUP_MUTATION }
        variables={ this.state }
      >
        {(signup, { loading, error }) => (
          <Form method="post" onSubmit={ async e => {
            e.preventDefault();
            const res = await signup();
            this.setState({ name: '', email: '', password: '' });
          } }>
            <ErrorMessage error={ error }/>
            <fieldset disabled={ loading } aria-busy={ loading }>
              <h2>Sign Up for An Account</h2>
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.saveState}
                />
              </label>
              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={this.state.name}
                  onChange={this.saveState}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.saveState}
                />
              </label>
              <button type="submit">Sing Up</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signup;
